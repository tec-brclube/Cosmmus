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

O endereço do endpoint fica **no próprio código**, em `DEFAULT_ENDPOINT` no início de
[`components/aplicacao/submit.ts`](../components/aplicacao/submit.ts). Para trocar de planilha, basta editar essa
constante e publicar — não é preciso mexer no painel da hospedagem.

```ts
const DEFAULT_ENDPOINT = 'https://script.google.com/macros/s/SEU_ID_AQUI/exec';
```

### Por que não fica em variável de ambiente?

Variáveis `VITE_*` são **embutidas no bundle durante o build**: o endereço apareceria no JavaScript público de
qualquer forma. Mantê-lo em `.env` não o tornaria mais reservado — apenas exigiria acesso ao painel da hospedagem
para cada publicação, e um build feito sem a variável gera um site que **não grava nada**, silenciosamente.

A proteção real é o Apps Script aceitar **somente gravação, nunca leitura**: o endereço não dá acesso ao conteúdo
da planilha.

### Apontar para outra planilha temporariamente

Para testes ou homologação, crie `.env.local` na raiz do projeto (já ignorado pelo Git):

```
VITE_SHEETS_ENDPOINT=https://script.google.com/macros/s/OUTRO_ID/exec
```

A variável tem precedência sobre a constante do código. Reinicie o servidor com `npm run dev` depois de criá-la.

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

---

## Dois formulários, uma planilha

O site tem dois formulários, e os dois usam o mesmo Apps Script e a mesma
planilha — cada um gravando em sua própria aba:

| Formulário | Endereço | Aba | Protocolo |
| --- | --- | --- | --- |
| NR-01 — Caracterização Organizacional | `/aplicacaocosmmus` | `Respostas` | `COSMMUS-…` |
| Diagnóstico Cosmmus | `/diagnostico` | `Diagnostico Cosmmus` | `DIAG-…` |

A aba vai no campo `aba` de cada envio. O script só aceita os nomes listados em
`ABAS_PERMITIDAS`, para que um envio adulterado não crie abas estranhas, e cria
a aba sozinho na primeira resposta.

**Ao publicar o Diagnóstico Cosmmus, atualize o Apps Script**: abra a
planilha → Extensões → Apps Script, substitua o conteúdo por
`google-apps-script/Codigo.gs` e implante uma nova versão. Sem isso, as
respostas do formulário novo caem na aba `Respostas`, misturadas às do outro
formulário e criando colunas novas no fim da planilha.

### Onde mexer para mudar as perguntas

- Caracterização organizacional: `components/aplicacao/formSchema.ts`
- Diagnóstico Cosmmus: `components/diagnostico/formSchema.ts`
- Textos de abertura e de conclusão: o arquivo do formulário
  (`ApplicationForm.tsx` / `DiagnosticoForm.tsx`)
- Tela, validação, rascunho e envio: `components/formulario/` — vale para os dois

Alterar o texto de uma pergunta muda o nome da coluna na planilha. O script casa
as colunas por nome, então a pergunta alterada vira uma coluna nova e a antiga
fica com os dados já gravados.

## Avisos de formulário concluído

O Apps Script avisa por dois canais quando alguém **conclui** um formulário.
Salvamentos automáticos, que acontecem enquanto a pessoa preenche, nunca
disparam aviso.

| Canal | Constante | Onde configurar |
| --- | --- | --- |
| E-mail | `NOTIFY_EMAIL` | pode ficar no repositório |
| Google Chat | `CHAT_WEBHOOK` | **somente no editor do Apps Script** |

O webhook do Chat carrega chave e token de acesso ao espaço na própria URL —
quem tem a URL consegue publicar mensagens lá. Por isso ele fica vazio aqui e
é preenchido apenas no editor do Apps Script, que não é público. Ao atualizar
o script, lembre de repor o valor: colar o arquivo do repositório por cima
apaga a URL.

Se o Chat estiver fora do ar ou a URL estiver errada, a resposta do cliente
não se perde: a linha já foi gravada antes, e a falha aparece apenas no log de
execuções do Apps Script.

## Dimensionamento automático (IPC)

`Avaliacao.gs` traz o modelo do "Pré-Diagnóstico Cosmmus Business v1.1"
adaptado às perguntas do Diagnóstico do site. A cada formulário **concluído**,
o script pontua nove dimensões de 1 a 4, soma o IPC (9 a 36) e acrescenta 19
colunas à direita das respostas: as notas por dimensão, nível, horas, equipe,
prazo, faixa de preço e o alerta principal.

| Dimensão | De onde vem |
| --- | --- |
| Porte | 8A, 7B, 8B, 9B — vale a maior evidência |
| Maturidade organizacional | 12 e 13 — vale a pior |
| Maturidade financeira | 14 |
| Tecnologia e dados | 18, reforçado por sinais da 16 |
| Amplitude do escopo | 22 — quantidade de áreas marcadas |
| Qualidade das informações | 23 |
| Disponibilidade das pessoas | 24 |
| Urgência | 25 |
| Entregável | 5 — o objetivo mais pesado marcado |

Níveis: I Essencial (9–14), II Estruturado (15–21), III Amplo (22–28),
IV Alta Complexidade (29–36). O preço sai de `horas × taxa média ponderada ×
(1 + reserva de escopo) × fator de urgência`, com as taxas em `PARAMETROS`.

**A faixa é referência interna, nunca preço final.** Toda linha nasce com
"Aguardando revisão humana" na última coluna, como no modelo original.

### Para calibrar

Depois de alguns projetos, compare horas previstas com realizadas e ajuste
`PARAMETROS` e `NIVEIS`, no topo do `Avaliacao.gs`. As tabelas de pontuação
(`PONTOS`) casam o texto exato de cada resposta: se você reescrever uma opção
no formulário do site, atualize o texto correspondente aqui — senão a
dimensão passa a usar a nota padrão silenciosamente.

As perguntas são localizadas pelo número (`12`, `7B`, `2.1`), não pelo
enunciado inteiro, então reescrever o texto de uma pergunta não quebra o
modelo — só reescrever as **opções de resposta** quebra.

### Painel

`Painel.gs` cria uma **aba nova**, chamada `Painel`, na própria planilha das
respostas. Ela traz indicadores (iniciados, concluídos, abandonados, IPC
médio, piso e teto somados do funil), a distribuição por nível, a contagem de
alertas e a lista de oportunidades concluídas, ordenada da mais complexa para
a mais simples.

Para criar: no editor do Apps Script, escolha a função `criarPainel` e clique
em Executar. Depois disso, a planilha ganha o menu **COSMMUS → Atualizar
painel**, que refaz a estrutura sem passar pelo editor.

Os números são fórmulas: uma vez criado, o painel se atualiza sozinho a cada
resposta nova. Só é preciso rodar de novo se colunas mudarem de lugar — por
exemplo, depois de acrescentar perguntas ao formulário.

O painel apenas lê as colunas que o `Avaliacao.gs` grava. Quem calcula é o
script: assim existe uma fonte de verdade só.
