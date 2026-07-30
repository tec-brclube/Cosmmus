<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# COSMMUS Business

Site institucional da Cosmmus Business (React + Vite + Tailwind).

View your app in AI Studio: https://ai.studio/apps/dd8af852-7a6f-4120-bc5a-fea2c5fba5e1

## Rodar localmente

**Pré-requisitos:** Node.js

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie o arquivo `.env.local` a partir do exemplo e preencha as variáveis:
   ```bash
   cp .env.example .env.local
   ```
3. Rode o app:
   ```bash
   npm run dev
   ```

O site sobe em http://localhost:3000

## Variáveis de ambiente

| Variável | Obrigatória | Para que serve |
| --- | --- | --- |
| `VITE_SHEETS_ENDPOINT` | Não | Sobrescreve a planilha que recebe o formulário `/aplicacaocosmmus`. O endereço padrão fica no código (`DEFAULT_ENDPOINT` em `components/aplicacao/submit.ts`); use a variável apenas para apontar para outra planilha em testes. Veja [docs/FORMULARIO-SHEETS.md](docs/FORMULARIO-SHEETS.md) |
| `GEMINI_API_KEY` | Não | Chave da API do Gemini |

> `.env.local` **não** vai para o Git. Em produção, cadastre as mesmas variáveis no painel da hospedagem.

## Páginas

| Rota | Conteúdo |
| --- | --- |
| `/` | Site institucional (início, sobre, áreas de atuação, metodologia, cases, conteúdos, contato) |
| `/aplicacaocosmmus` | Formulário de Caracterização Organizacional — Gestão de Riscos Psicossociais e Saúde no Trabalho (22 etapas, tema claro, respostas gravadas no Google Sheets) |

## Deploy na Vercel

1. Importe o repositório na Vercel (framework detectado: **Vite**).
2. Não é preciso cadastrar variáveis para o formulário funcionar: o endereço da planilha vive no código. Cadastre `GEMINI_API_KEY` apenas se for usá-la.
3. O arquivo [vercel.json](vercel.json) já contém o *rewrite* de SPA necessário para que o link direto `/aplicacaocosmmus` funcione sem erro 404.
4. Build: `npm run build` · Output: `dist`

Como as variáveis `VITE_*` são embutidas no build, **é preciso um novo deploy** sempre que o valor do endpoint mudar.

## Scripts

```bash
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção em dist/
npm run preview  # serve o build localmente
npm run lint     # checagem de tipos (tsc)
```
