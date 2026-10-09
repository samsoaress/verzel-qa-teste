# Teste técnico QA Júnior: Verzel Store (VZS-142)

Validação da entrega **Cupom de desconto e frete grátis** (versão 2.3.0) da Verzel Store: cenários de teste, execução manual e exploratória, testes de API, report de bugs, evidências e automação com Playwright.

- **Candidato(a):** `[PREENCHER: nome]`
- **Loja:** https://verzel-store.qa-test-verzel-store.workers.dev/
- **Documentação da entrega:** https://verzel-store.qa-test-verzel-store.workers.dev/documentacao
- **API:** https://verzel-store.qa-test-verzel-store.workers.dev/api

## Onde encontrar cada entrega

| Entrega pedida | Onde está |
|---|---|
| Cenários de teste (Gherkin) | [`features/`](features/) (`cupom`, `frete`, `quantidade`, `pedido`, `carrinho`) |
| Análise, matriz CA → casos e ambiguidades | [`docs/01-analise-e-ambiguidades.md`](docs/01-analise-e-ambiguidades.md) |
| Casos de teste manuais e de API | [`docs/02-casos-de-teste-manuais.md`](docs/02-casos-de-teste-manuais.md) e [`docs/planilhas/`](docs/planilhas/) |
| Execução e resultado de cada cenário | [`docs/03-execucao-e-resultados.md`](docs/03-execucao-e-resultados.md) |
| Report de bugs | [`docs/04-relatorio-de-bugs.md`](docs/04-relatorio-de-bugs.md) |
| Documento com as evidências | [`docs/05-evidencias.md`](docs/05-evidencias.md) e [`docs/evidencias/`](docs/evidencias/) |
| Testes de API manuais (Postman) | [`docs/api/verzel-store.postman_collection.json`](docs/api/verzel-store.postman_collection.json) |
| Automação com Playwright | [`tests/`](tests/) |

## Estrutura do repositório

```
├── README.md
├── package.json / tsconfig.json / playwright.config.ts
├── docs/
│   ├── 01-analise-e-ambiguidades.md
│   ├── 02-casos-de-teste-manuais.md
│   ├── 03-execucao-e-resultados.md
│   ├── 04-relatorio-de-bugs.md
│   ├── 05-evidencias.md
│   ├── planilhas/        planilhas de execução (xlsx)
│   ├── api/              collection do Postman
│   └── evidencias/
│       ├── ui/           prints e gravações da loja
│       └── api/          prints do Postman e saídas do curl
├── features/             cenários em Gherkin (pt)
└── tests/
    ├── api/              testes de API (Playwright, sem navegador)
    └── e2e/              testes de interface (Playwright, Chromium)
        └── pages/        page object com os seletores
```

## Como rodar a automação

**Pré-requisitos:** Node.js 18 ou superior.

```bash
npm install
npx playwright install chromium   # só necessário para os testes de interface

npm test              # tudo
npm run test:api      # só API (não abre navegador)
npm run test:e2e      # só interface
npm run test:headed   # interface com o navegador visível
npm run report        # abre o relatório HTML da última execução
```

Para apontar para outra URL sem editar o código:

```bash
BASE_URL=https://outra-url npm run test:api            # macOS/Linux
$env:BASE_URL="https://outra-url"; npm run test:api    # Windows (PowerShell)
```

### O que a automação cobre

| Suíte | Testes | O que valida |
|---|---|---|
| `tests/api/produtos.spec.ts` | 12 | Catálogo, preços, 404 e 405 |
| `tests/api/carrinho.spec.ts` | 49 | Valores (CA01, CA06 a CA11), variações do cupom (CA02), cupom inválido e expirado (CA03, CA04), validações e códigos de erro |
| `tests/api/pedidos.spec.ts` | 29 | Pedido válido, número `VZ-000000`, CEP normalizado, cupom inválido e expirado (422), dados do cliente |
| `tests/e2e/produtos.spec.ts` | 18 | Listagem (8 produtos, nome e preço), banner de frete grátis, botão Adicionar e limite de 5 unidades |
| `tests/e2e/carrinho.spec.ts` | 39 | Cupom, frete grátis, arredondamento, carrinho (contador, remover, vazio, F5, outra aba), navegação e checkout |

Decisões da automação:

- **Execução sequencial** (`workers: 1`) e sem testes de carga, porque o ambiente é compartilhado com outros candidatos.
- **Valores esperados fixos**, calculados à mão a partir das regras da documentação, e não recalculados pelo próprio teste.
- **Casas decimais verificadas** pelo texto do número (detecta `179.70000000000002`).
- **Casos ambíguos** (cupom `null`, vazio ou de tipo errado; cliente ausente; ordem de validação) não afirmam um resultado. Eles garantem que não há erro 500 e **anotam o comportamento observado** no relatório HTML (anotação `observado`).
- **Testes que acham bug** não são apagados: o teste fica no repositório falhando e o `docs/03` aponta o BUG correspondente.
- Os seletores da interface ficam concentrados em `tests/e2e/pages/loja.page.ts`. Os da listagem de produtos foram confirmados no HTML da loja (`li.produto`, `article[aria-labelledby]`, botão "Adicionar ao carrinho"). Os do cabeçalho, carrinho, cupom e checkout vieram do codegen (botões "Aplicar cupom", "Finalizar compra", "Confirmar pedido" etc.). Só o **bloco de resumo** (rótulos Subtotal, Desconto, Frete, Total), as mensagens de erro do checkout e a tela de confirmação ainda são palpite, marcados como `[PALPITE]`.

## Resumo dos resultados

`[PREENCHER depois da execução]`

| Item | Total | Passou | Falhou |
|---|---|---|---|
| Casos manuais | | | |
| Casos de API | | | |
| Automação | | | |

Bugs encontrados: `[X]` (Crítica: `[ ]`, Alta: `[ ]`, Média: `[ ]`, Baixa: `[ ]`). Lista em [`docs/04-relatorio-de-bugs.md`](docs/04-relatorio-de-bugs.md).

## Decisões e interpretações

As ambiguidades da documentação e a interpretação adotada para cada uma estão em [`docs/01-analise-e-ambiguidades.md`](docs/01-analise-e-ambiguidades.md#7-ambiguidades-e-interpretações-adotadas).

Comportamentos descritos em "Sobre este ambiente" (carrinho só na aba, pedidos fictícios, sem e-mail, dados fixos, sem estoque) **não foram tratados como bugs**. Testes de carga, estresse e segurança ficaram fora do escopo, conforme o enunciado.

## Uso de IA

`[PREENCHER com sinceridade: onde e como você usou IA, ou que não usou.]`

## Limitações

- `[PREENCHER: o que não deu tempo de testar, navegadores não cobertos etc.]`
