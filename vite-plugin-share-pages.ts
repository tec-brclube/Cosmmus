import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';
import { ROUTES } from './routePaths';
import {
  COOP_IMAGE,
  COOP_IMAGE_ALT,
  DEFAULT_IMAGE,
  DEFAULT_IMAGE_ALT,
  SITE_URL,
  VIEW_SEO,
} from './seoData';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Uma página HTML por endereço, para a pré-visualização ao compartilhar.
 *
 * O site é uma SPA: o servidor entrega sempre o mesmo index.html e o
 * JavaScript troca título e imagem depois. Só que WhatsApp, Facebook, LinkedIn
 * e X não rodam JavaScript: leem apenas o HTML que chega. Sem este passo,
 * qualquer link do site (inclusive /coop) apareceria com o título e a
 * imagem da página inicial.
 *
 * Depois do build, este plugin copia dist/index.html para
 * dist/<caminho>/index.html trocando título, descrição, endereço e imagem pelos
 * de seoData.ts. O vercel.json aponta cada endereço para o seu arquivo; o
 * plugin confere se os dois estão de acordo e falha o build se não estiverem.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const escapeAttr = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const setMeta = (html: string, attr: 'name' | 'property', key: string, content: string): string => {
  const pattern = new RegExp(`<meta ${attr}="${key}" content="[^"]*" />`);
  if (!pattern.test(html)) throw new Error(`index.html não tem <meta ${attr}="${key}" ... />`);
  return html.replace(pattern, () => `<meta ${attr}="${key}" content="${escapeAttr(content)}" />`);
};

export default function sharePages(): Plugin {
  let root = process.cwd();
  let outDir = 'dist';

  return {
    name: 'share-pages',
    apply: 'build',
    configResolved(config) {
      root = config.root;
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const indexPath = path.join(outDir, 'index.html');
      const base = fs.readFileSync(indexPath, 'utf8');
      const generated: string[] = [];

      for (const [view, routePath] of Object.entries(ROUTES)) {
        const seo = VIEW_SEO[view as keyof typeof VIEW_SEO];
        if (!seo || !routePath) continue;

        const url = `${SITE_URL}${routePath}`;
        const isCoop = seo.image === COOP_IMAGE;
        const image = seo.image || DEFAULT_IMAGE;
        const imageAlt = isCoop ? COOP_IMAGE_ALT : DEFAULT_IMAGE_ALT;

        let html = base;
        html = html.replace(/<title>[^<]*<\/title>/, () => `<title>${escapeAttr(seo.title)}</title>`);
        html = html.replace(/<link rel="canonical" href="[^"]*" \/>/, () => `<link rel="canonical" href="${url}" />`);
        html = setMeta(html, 'name', 'description', seo.description);
        html = setMeta(html, 'property', 'og:title', seo.title);
        html = setMeta(html, 'property', 'og:description', seo.description);
        html = setMeta(html, 'property', 'og:url', url);
        html = setMeta(html, 'property', 'og:image', image);
        html = setMeta(html, 'property', 'og:image:alt', imageAlt);
        html = setMeta(html, 'name', 'twitter:title', seo.title);
        html = setMeta(html, 'name', 'twitter:description', seo.description);
        html = setMeta(html, 'name', 'twitter:image', image);
        html = setMeta(html, 'name', 'twitter:image:alt', imageAlt);

        const target = path.join(outDir, routePath, 'index.html');
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, html);
        generated.push(routePath);
      }

      // O vercel.json precisa mandar cada endereço para o arquivo gerado.
      // Sem isso o arquivo existe, mas ninguém o recebe.
      const vercelPath = path.join(root, 'vercel.json');
      if (fs.existsSync(vercelPath)) {
        const rewrites: { source: string; destination: string }[] = JSON.parse(fs.readFileSync(vercelPath, 'utf8')).rewrites || [];
        for (const routePath of generated) {
          const rule = rewrites.find((r) => r.source === routePath);
          if (!rule || rule.destination !== `${routePath}/index.html`) {
            throw new Error(
              `vercel.json: "${routePath}" precisa de { "source": "${routePath}", "destination": "${routePath}/index.html" } ` +
                `para o link compartilhado mostrar a imagem e o título corretos.`,
            );
          }
        }
        for (const rule of rewrites) {
          if (rule.destination !== '/index.html' && !fs.existsSync(path.join(outDir, rule.destination))) {
            throw new Error(`vercel.json: "${rule.source}" aponta para ${rule.destination}, que o build não gerou.`);
          }
        }
      }

      for (const image of [DEFAULT_IMAGE, COOP_IMAGE]) {
        const file = path.join(root, 'public', image.replace(SITE_URL, ''));
        if (!fs.existsSync(file)) throw new Error(`Imagem de compartilhamento ausente: ${file}`);
      }

      console.log(`share-pages: ${generated.length} páginas geradas (${generated.join(', ')})`);
    },
  };
}
