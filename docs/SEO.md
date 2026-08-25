# SEO — como o site aparece no Google

O site é uma SPA: o servidor entrega sempre o mesmo `index.html` e o React monta
o conteúdo no navegador. O Google executa JavaScript antes de indexar, então o
conteúdo é lido normalmente — desde que cada página tenha **endereço próprio**,
**título próprio** e possa ser **alcançada por um link**. É isso que os arquivos
abaixo garantem.

## Onde fica cada coisa

| Arquivo | Papel |
| --- | --- |
| `routes.ts` | Lista de endereços (`/sobre`, `/equipe`, `/contato`, …) e a conversão endereço ⇄ view. |
| `seo.ts` | Título, descrição, canonical, Open Graph e dados estruturados de cada view. Aplicado a cada troca de página. |
| `index.html` | Tags fixas: descrição padrão, ícones, Open Graph, dados estruturados da organização. |
| `public/robots.txt` | Libera o rastreamento e aponta o sitemap. |
| `public/sitemap.xml` | Lista todos os endereços para o Search Console. |
| `public/google*.html` | Arquivo de verificação de propriedade do Google Search Console. Não renomear nem remover. |
| `vercel.json` | Declara quais endereços a SPA responde. Endereço fora da lista devolve 404 de verdade. |

## Ao criar uma página nova

1. Adicione a view em `routes.ts` (`ROUTES`).
2. Adicione título e descrição em `seo.ts` (`VIEW_SEO`).
3. Adicione o caminho em `vercel.json` (`rewrites`) — sem isso o endereço
   responde 404 em produção.
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

## Depois de publicar

1. Search Console → verificar a propriedade (o arquivo de verificação já está no
   ar em `/google54a4ed200935c697.html`).
2. Search Console → Sitemaps → enviar `sitemap.xml`.
3. Search Console → Inspeção de URL → "Solicitar indexação" para a home.

A indexação leva de alguns dias a algumas semanas; não há como acelerar além do
pedido de indexação.

## Pendências conhecidas

- `og-image.svg` funciona como pré-visualização, mas WhatsApp e LinkedIn só
  exibem imagem em JPG/PNG. Um arquivo `og-image.jpg` de 1200×630 substituiria
  bem (basta trocar a referência em `index.html` e em `seo.ts`).
- O Tailwind é carregado pelo CDN (`cdn.tailwindcss.com`), que gera o CSS no
  navegador. Funciona, mas atrasa a primeira renderização e pesa no relatório de
  performance. Migrar para o Tailwind instalado no projeto melhoraria a nota de
  Core Web Vitals.
- As páginas de serviço e de case ainda não têm endereço próprio (abrem por
  estado, na raiz), então não podem ser indexadas individualmente.
