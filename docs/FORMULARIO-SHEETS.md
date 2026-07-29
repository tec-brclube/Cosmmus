# Formulário de Caracterização Organizacional → Google Sheets

Endereço da página: **`/aplicacaocosmmus`**

As respostas são enviadas para uma planilha do Google via **Google Apps Script**, sem servidor e sem custo.

---

## 1. Criar a planilha

1. Crie uma planilha nova no Google Sheets (ex.: `COSMMUS — Caracterização Organizacional`).
2. Não precisa criar colunas nem abas: o script cria a aba **Respostas** e os cabeçalhos no primeiro envio.

## 2. Colar o script

1. Na planilha, abra **Extensões → Apps Script**.
2. Apague o conteúdo do arquivo `Código.gs` e cole tudo o que está em [`google-apps-script/Codigo.gs`](../google-apps-script/Codigo.gs).
3. (Opcional) Preencha `NOTIFY_EMAIL` com um e-mail para receber aviso a cada novo envio.
4. Salve (ícone de disquete).

## 3. Implantar como aplicativo da web

1. Clique em **Implantar → Nova implantação**.
2. Em **Tipo**, escolha **Aplicativo da Web**.
3. Configure:
   - **Descrição:** `Formulário Cosmmus`
   - **Executar como:** `Eu (seu e-mail)`
   - **Quem pode acessar:** `Qualquer pessoa` ← obrigatório, senão o site não consegue gravar
4. Clique em **Implantar** e autorize o acesso (a tela de aviso do Google é esperada: **Avançado → Acessar projeto**).
5. Copie a **URL do aplicativo da web**. Ela termina em `/exec`.

> Para testar, cole a URL no navegador. Deve aparecer `{"result":"ok",...}`.

## 4. Ligar o site à planilha

Crie o arquivo `.env.local` na raiz do projeto (ele já é ignorado pelo Git) com:

```
VITE_SHEETS_ENDPOINT=https://script.google.com/macros/s/SEU_ID_AQUI/exec
```

Reinicie o servidor:

```bash
npm run dev
```

Enquanto essa variável não existir, o formulário funciona normalmente mas exibe um aviso na última etapa e não grava nada.

> **Importante:** em produção, a mesma variável precisa estar configurada no serviço de hospedagem (Vercel, Netlify, etc.), em *Environment Variables*. Variáveis `VITE_*` são embutidas no build — o endpoint fica visível no código do site, o que é aceitável aqui porque o script só aceita gravação, nunca leitura.

## 5. Atualizando o script depois

Se alterar o `Codigo.gs`, use **Implantar → Gerenciar implantações → Editar (lápis) → Versão: Nova versão → Implantar**. A URL continua a mesma.

> ⚠️ O script **precisa** estar na versão que localiza a linha pelo protocolo (`findRowByProtocol`). Uma versão antiga, que apenas adiciona linhas, criaria uma linha nova a cada salvamento automático — dezenas de duplicatas por preenchimento. Sempre publique a nova versão do script **antes** de publicar o site.

---

## Como as respostas chegam

O formulário tem **22 seções e 159 perguntas**, que geram **223 colunas** na planilha.

### Salvamento contínuo

As respostas **não** esperam o envio final: elas sobem para a planilha enquanto a pessoa preenche.

- A linha é criada no primeiro campo respondido e depois apenas **atualizada** — o `Protocolo` é a chave que identifica a linha.
- O envio acontece ~2,5 s após a pessoa parar de digitar e também a cada troca de etapa.
- Se a aba for fechada, um `sendBeacon` tenta salvar o que faltava.
- Se a pessoa voltar depois no mesmo navegador, retoma o mesmo protocolo e continua atualizando a mesma linha.
- A coluna `Status` distingue **`Em preenchimento`** de **`Concluído`**.

> Consequência prática: você verá na planilha formulários incompletos, com status `Em preenchimento`. Isso é intencional — é justamente o que evita perder dados de quem abandona no meio. Para trabalhar apenas com os finalizados, filtre `Status = Concluído`.

### Colunas

| Coluna | Conteúdo |
| --- | --- |
| `Data/hora` | Início do preenchimento (horário de Brasília) — não muda nas atualizações |
| `Protocolo` | Código exibido ao cliente, ex.: `COSMMUS-20260729-4F2A`. Identifica a linha |
| `Status` | `Em preenchimento` ou `Concluído` |
| `Última atualização` | Momento do último salvamento |
| `Etapa alcançada` | Ex.: `7 de 22` |
| `1.1 Razão social` … | Uma coluna por pergunta, na ordem do formulário (até `22.6`) |

Regras de gravação:

- **Caixas de seleção** (várias respostas) chegam separadas por `; ` na mesma célula.
- **Grades** (perguntas 4.3 e 11.1) e **grupos numéricos** (pergunta 3.1) geram **uma coluna por linha** — ex.: `4.3 ... [Organograma]`, `11.1 ... [Absenteísmo]`.
- Opções "Outro" geram uma coluna extra `[Outro - especificar]` com o texto digitado.
- As colunas são casadas por **nome do cabeçalho**. Se novas perguntas forem adicionadas ao formulário, elas entram como colunas novas no fim da planilha, sem desalinhar o histórico.
- Não renomeie nem reordene manualmente a linha 1 da aba `Respostas`.

## Comportamento do formulário

- **22 etapas**, com barra de progresso e tempo estimado de 35 a 50 minutos.
- **Tema claro** (fundo `paper` e texto escuro) para leitura confortável em formulário longo, entre o menu e o rodapé escuros do site.
- **Salvamento contínuo** na planilha (ver acima) + **rascunho local** (`localStorage`), permitindo fechar e retomar depois no mesmo navegador.
- **Indicador de salvamento** no pé de cada etapa: `Salvando respostas...`, `Respostas salvas às HH:MM` ou `Sem conexão com a planilha — tentar novamente`.
- **Campos condicionais**: 1.7 e 1.8 aparecem só se houver mais de uma unidade; 3.5 só se houver terceirizados; 4.9 só se houver dificuldade de retenção; 9.7 só se houver pressão excessiva.
- **Limite de seleção**: a pergunta 15.1 aceita no máximo 10 opções (as demais são desabilitadas ao atingir o limite).
- **Obrigatórios**: 1.1, 1.2, 1.3, 1.5, 1.6, 1.9, 2.1, 2.4, 2.5, 22.4 e as duas declarações finais (22.5 e 22.6).
- Se o envio falhar, o rascunho é preservado e o cliente pode baixar uma cópia das respostas em `.txt`.

## Hospedagem: rota direta

Como o site é uma SPA, o servidor precisa devolver o `index.html` para `/aplicacaocosmmus`. Em desenvolvimento o Vite já faz isso.

- **Vercel** — criar `vercel.json`:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```
- **Netlify** — criar `public/_redirects`:
  ```
  /*  /index.html  200
  ```
- **Hostinger / Apache** — criar `.htaccess` na pasta publicada:
  ```apache
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteRule ^ index.html [L]
  ```

Sem essa regra, o link compartilhado abre erro 404 (o menu "Aplique-se" continua funcionando).

## LGPD

O formulário coleta dados de contato profissional e informações organizacionais — não deve receber nomes de trabalhadores nem dados de saúde individualizados (a pergunta 7 orienta a informar faixas salariais, não salários individuais). A etapa 11 registra o aceite explícito para tratamento dos dados com a finalidade de análise de escopo e elaboração de proposta.
