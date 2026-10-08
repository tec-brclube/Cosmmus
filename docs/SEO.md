# SEO — como o site aparece no Google

O site é uma SPA: o servidor entrega sempre o mesmo `index.html` e o React monta
o conteúdo no navegador. O Google executa JavaScript antes de indexar, então o
conteúdo é lido normalmente — desde que cada página tenha **endereço próprio**,
**título próprio** e possa ser **alcançada por um link**. É isso que os arquivos
abaixo garantem.

## Onde fica cada coisa

| Arquivo | Papel |
| --- | --- |
| `routePaths.ts` | Mapa view → endereço (`/sobre`, `/equipe`, `/contato`, …). Lido também pelo build. |
| `routes.ts` | Conversão endereço ⇄ view e links internos. |
| `seoData.ts` | Título, descrição e imagem de compartilhamento de cada view. Lido pelo navegador e pelo build. |
| `seo.ts` | Aplica esses textos (canonical, Open Graph, dados estruturados) a cada troca de página. |
| `vite-plugin-share-pages.ts` | No build, gera um HTML por endereço com título e imagem próprios (veja abaixo). |
| `public/og-image.jpg`, `public/og-coop.jpg` | Imagens de pré-visualização, 1200 × 630, JPG. |
| `index.html` | Tags fixas: descrição padrão, ícones, Open Graph, dados estruturados da organização. |
| `public/robots.txt` | Libera o rastreamento e aponta o sitemap. |
| `public/sitemap.xml` | Lista todos os endereços para o Search Console. |
| `public/google*.html` | Arquivo de verificação de propriedade do Google Search Console. Não renomear nem remover. |
| `vercel.json` | Declara quais endereços a SPA responde e aponta cada um para o seu HTML. Endereço fora da lista devolve 404 de verdade. |

## Ao criar uma página nova

1. Adicione a view em `routePaths.ts` (`ROUTES`).
2. Adicione título e descrição em `seoData.ts` (`VIEW_SEO`). Para uma imagem de
   compartilhamento própria, acrescente `image`.
3. Adicione em `vercel.json` (`rewrites`)
   `{ "source": "/caminho", "destination": "/caminho/index.html" }` — sem isso o
   endereço responde 404 em produção. O build falha se faltar, de propósito.
4. Adicione a URL em `public/sitemap.xml` e atualize o `lastmod`.

Os mesmos quatro passos valem ao renomear um caminho. Links já compartilhados
deixam de funcionar quando um caminho muda.

## Regras que o código já respeita

- **Uma H1 por página.** Na home, a H1 é a chamada do Hero; os blocos de resumo
  (Áreas de Atuação, Metodologia) usam H2. Nas páginas próprias, o título da
  página é a H1.
- **Menu e rodapé são links reais** (`<a href>`), não botões: o rastreador
  consegue segui-los e o visitante consegue abrir em outra aba. O clique comum
  continua navegando sem recarregar.
- **Toda imagem tem `alt`.**
- **O painel administrativo é marcado como `noindex`.**

## Pré-visualização ao compartilhar o link

WhatsApp, Facebook, LinkedIn e X **não executam JavaScript**: leem só o HTML que
o servidor entrega. Por isso o título e a imagem trocados pelo `seo.ts` não
chegam a eles. O plugin `vite-plugin-share-pages.ts` resolve isso no build:
copia `dist/index.html` para `dist/<caminho>/index.html` com o título, a
descrição, o endereço e a imagem de cada página, e o `vercel.json` entrega cada
endereço com o seu arquivo.

- A imagem precisa ser **JPG ou PNG** (SVG é ignorado), 1200 × 630, de preferência
  abaixo de 300 KB.
- `/coop` usa `og-coop.jpg`; todas as outras páginas usam `og-image.jpg`.
- As páginas individuais da equipe (`/equipe/<nome>`) ainda compartilham a
  pré-visualização da home, porque o título delas vem de dados com fotos que o
  build não lê.
- WhatsApp e Facebook guardam a prévia por dias. Para forçar a atualização:
  Depurador de Compartilhamento do Facebook (developers.facebook.com/tools/debug)
  e Inspetor de Posts do LinkedIn (linkedin.com/post-inspector).

## Depois de publicar

1. Search Console → verificar a propriedade (o arquivo de verificação já está no
   ar em `/google54a4ed200935c697.html`).
2. Search Console → Sitemaps → enviar `sitemap.xml`.
3. Search Console → Inspeção de URL → "Solicitar indexação" para a home.

A indexação leva de alguns dias a algumas semanas; não há como acelerar além do
pedido de indexação.

## Pendências conhecidas

- O Tailwind é carregado pelo CDN (`cdn.tailwindcss.com`), que gera o CSS no
  navegador. Funciona, mas atrasa a primeira renderização e pesa no relatório de
  performance. Migrar para o Tailwind instalado no projeto melhoraria a nota de
  Core Web Vitals.
- As páginas de serviço e de case ainda não têm endereço próprio (abrem por
  estado, na raiz), então não podem ser indexadas individualmente.
