# 03. Execução e resultados

Registre aqui o resultado de **cada** caso executado. A fonte do dia a dia são as planilhas em `planilhas/`; este arquivo é a versão consolidada para leitura no GitHub.

**Legenda:** ✅ Passou · ❌ Falhou · ⚠️ Bloqueado · ❓ Dúvida (ambiguidade) · ➖ N/A (funcionalidade inexistente) · ⏳ Não executado

**Como preencher:** troque ⏳ pelo status, escreva em *Obtido* o que a loja mostrou (com valores), ligue o bug (ex.: `BUG-001`) e aponte a evidência (ex.: `evidencias/ui/CT-B1a.png`).

## Ambiente de execução

| Item | Valor |
|---|---|
| Data da execução | `[PREENCHER]` |
| Navegador e versão | `[PREENCHER]` |
| Sistema operacional | `[PREENCHER]` |
| URL testada | https://verzel-store.qa-test-verzel-store.workers.dev/ |
| Versão da entrega | 2.3.0 (VZS-142) |

## Resumo

| Status | Manuais | API | Automação |
|---|---|---|---|
| ✅ Passou | `[ ]` | `[ ]` | `[ ]` |
| ❌ Falhou | `[ ]` | `[ ]` | `[ ]` |
| ⚠️ Bloqueado | `[ ]` | `[ ]` | `[ ]` |
| ❓ Dúvida | `[ ]` | `[ ]` | `[ ]` |
| ⏳ Não executado | `[ ]` | `[ ]` | `[ ]` |

## Casos manuais (UI)

| ID | Cenário | Status | Obtido | Bug | Evidência |
|---|---|---|---|---|---|
| CT-A1 | Aplicar BEMVINDO10 | ⏳ | | | |
| CT-A2a | Cupom em minúsculas | ⏳ | | | |
| CT-A2b | Cupom com caixa mista | ⏳ | | | |
| CT-A2c | Espaços no início | ⏳ | | | |
| CT-A2d | Espaços no fim | ⏳ | | | |
| CT-A2e | Espaço no meio (ambiguidade) | ⏳ | | | |
| CT-A3 | Cupom inexistente | ⏳ | | | |
| CT-A4 | Cupom expirado | ⏳ | | | |
| CT-A5 | Apenas um cupom por vez | ⏳ | | | |
| CT-A6 | Cupom recalcula ao mudar quantidade | ⏳ | | | |
| CT-A7 | Cupom vazio | ⏳ | | | |
| CT-A8 | Aplicar cupom antes de adicionar produto | ⏳ | | | |
| CT-A9 | Esvaziar carrinho com cupom aplicado | ⏳ | | | |
| CT-B1a | Limite exato R$ 200,00 (Mochila) | ⏳ | | | |
| CT-B1b | Limite exato R$ 200,00 (Garrafa) | ⏳ | | | |
| CT-B2 | Um passo abaixo do limite | ⏳ | | | |
| CT-B3 | Frete fixo e aviso de faltante | ⏳ | | | |
| CT-B4 | Frete usa subtotal ANTES do cupom | ⏳ | | | |
| CT-B5 | Desconto não incide sobre o frete | ⏳ | | | |
| CT-B6 | Frete grátis bem acima do limite | ⏳ | | | |
| CT-B7 | Cruzar o limite subindo e descendo | ⏳ | | | |
| CT-B8 | Cupom + subtotal logo abaixo do limite | ⏳ | | | |
| CT-C1 | Exatamente 5 unidades | ⏳ | | | |
| CT-C2a | 6 unidades pelo botão + | ⏳ | | | |
| CT-C2b | 6 unidades digitando no campo | ⏳ | | | |
| CT-C2c | 6 unidades via 'Adicionar' repetido | ⏳ | | | |
| CT-C2d | Limite aplicado em cada produto separadamente | ⏳ | | | |
| CT-C3 | Valores inválidos no campo | ⏳ | | | |
| CT-C4 | Reduzir abaixo de 1 | ⏳ | | | |
| CT-D1 | 3× Camiseta com cupom | ⏳ | | | |
| CT-D2a | 3× Boné com cupom | ⏳ | | | |
| CT-D2b | 3× Meias com cupom | ⏳ | | | |
| CT-D3 | Formatação de moeda | ⏳ | | | |
| CT-D4 | Carrinho misto | ⏳ | | | |
| CT-E1 | Pedido válido sem cupom | ⏳ | | | |
| CT-E2 | Pedido válido com cupom | ⏳ | | | |
| CT-E3 | Nome sem sobrenome | ⏳ | | | |
| CT-E4 | Nome vazio | ⏳ | | | |
| CT-E5 | Nome com espaço no fim (ambiguidade) | ⏳ | | | |
| CT-E6 | E-mail inválido | ⏳ | | | |
| CT-E7 | CEP com hífen | ⏳ | | | |
| CT-E8 | CEP sem hífen | ⏳ | | | |
| CT-E9 | CEP inválido | ⏳ | | | |
| CT-E10 | Todos os campos vazios | ⏳ | | | |
| CT-E11 | Sem etapa de pagamento online | ⏳ | | | |
| CT-E12 | Clique duplo em Confirmar | ⏳ | | | |
| CT-F1 | Voltar e recarregar | ⏳ | | | |
| CT-F2 | Consistência UI × API | ⏳ | | | |
| CT-F3 | Responsividade | ⏳ | | | |
| CT-F4 | Teclado | ⏳ | | | |
| CT-F5 | Textos e acentuação | ⏳ | | | |
| CT-F6 | Carrinho vazio | ⏳ | | | |
| CT-001 | Acessar loja | ⏳ | | | |
| CT-002 | Visualizar produtos | ⏳ | | | |
| CT-003 | Adicionar produto | ⏳ | | | |
| CT-004 | Alterar quantidade | ⏳ | | | |
| CT-005 | Aplicar cupom (ajustado) | ⏳ | | | |
| CT-006 | Quantidade de produtos exibidos | ⏳ | | | |
| CT-007 | Nome e preço de cada produto | ⏳ | | | |
| CT-008 | Formatação de preço | ⏳ | | | |
| CT-009 | Descrição e categoria | ⏳ | | | |
| CT-010 | Imagens dos produtos | ⏳ | | | |
| CT-011 | Detalhe de um produto (se existir) | ⏳ | | | |
| CT-012 | Adicionar o mesmo produto 2 vezes | ⏳ | | | |
| CT-013 | Adicionar produtos diferentes | ⏳ | | | |
| CT-014 | Contador do carrinho (ícone/badge) | ⏳ | | | |
| CT-015 | Feedback ao adicionar | ⏳ | | | |
| CT-016 | Adicionar todos os 8 produtos | ⏳ | | | |
| CT-017 | Remover um item | ⏳ | | | |
| CT-018 | Esvaziar o carrinho | ⏳ | | | |
| CT-019 | Total por linha | ⏳ | | | |
| CT-020 | Remover o cupom | ⏳ | | | |
| CT-021 | Mensagem de falta para frete grátis | ⏳ | | | |
| CT-022 | Continuar comprando | ⏳ | | | |
| CT-023 | Recarregar a página (F5) com itens | ⏳ | | | |
| CT-024 | Abrir a loja em outra aba | ⏳ | | | |
| CT-025 | Botão Voltar do navegador | ⏳ | | | |
| CT-026 | URL inexistente | ⏳ | | | |
| CT-027 | Acessar /documentacao | ⏳ | | | |
| CT-028 | Links e botões do menu | ⏳ | | | |
| CT-029 | Tela de confirmação | ⏳ | | | |
| CT-030 | Valores da confirmação × carrinho | ⏳ | | | |
| CT-031 | CEP exibido na confirmação | ⏳ | | | |
| CT-032 | Carrinho após confirmar | ⏳ | | | |
| CT-033 | Nova compra logo depois | ⏳ | | | |
| CT-034 | Chrome, Firefox e Edge | ⏳ | | | |
| CT-035 | Celular (375px) e tablet (768px) | ⏳ | | | |
| CT-036 | Navegação por teclado | ⏳ | | | |
| CT-037 | Zoom 150% | ⏳ | | | |
| CT-038 | Mensagens de erro | ⏳ | | | |
| CT-039 | Cliques rápidos repetidos | ⏳ | | | |

## Casos de API

| ID | Cenário | Status | Obtido | Bug | Evidência |
|---|---|---|---|---|---|
| API-01 | GET /api/produtos: Listar produtos | ⏳ | | | |
| API-02 | GET /api/produtos/{id}: Id existente | ⏳ | | | |
| API-03 | GET /api/produtos/{id}: Id inexistente | ⏳ | | | |
| API-04 | /api/produtos: Método não permitido | ⏳ | | | |
| API-05 | /api/xyz: Rota inexistente | ⏳ | | | |
| API-06 | POST /api/carrinho/calcular: Sem cupom, abaixo de 200 | ⏳ | | | |
| API-07 | POST /api/carrinho/calcular: Cupom válido | ⏳ | | | |
| API-08 | POST /api/carrinho/calcular: Limite 200,00 exato | ⏳ | | | |
| API-09 | POST /api/carrinho/calcular: Frete grátis usa subtotal antes do cupom | ⏳ | | | |
| API-10 | POST /api/carrinho/calcular: Desconto não incide no frete | ⏳ | | | |
| API-11 | POST /api/carrinho/calcular: Exemplo da documentação | ⏳ | | | |
| API-12 | POST /api/carrinho/calcular: Arredondamento (float) | ⏳ | | | |
| API-13 | POST /api/carrinho/calcular: Cupom minúsculo | ⏳ | | | |
| API-14 | POST /api/carrinho/calcular: Cupom com espaços | ⏳ | | | |
| API-15 | POST /api/carrinho/calcular: Cupom inexistente | ⏳ | | | |
| API-16 | POST /api/carrinho/calcular: Cupom expirado | ⏳ | | | |
| API-17 | POST /api/carrinho/calcular: Cupom null / vazio / só espaços | ⏳ | | | |
| API-18 | POST /api/carrinho/calcular: Cupom em tipo errado | ⏳ | | | |
| API-19 | POST /api/carrinho/calcular: Corpo não-JSON | ⏳ | | | |
| API-20 | POST /api/carrinho/calcular: itens ausente | ⏳ | | | |
| API-21 | POST /api/carrinho/calcular: itens vazio | ⏳ | | | |
| API-22 | POST /api/carrinho/calcular: item não é objeto | ⏳ | | | |
| API-23 | POST /api/carrinho/calcular: item sem produtoId | ⏳ | | | |
| API-24 | POST /api/carrinho/calcular: produto inexistente | ⏳ | | | |
| API-25 | POST /api/carrinho/calcular: produto duplicado | ⏳ | | | |
| API-26 | POST /api/carrinho/calcular: quantidade 0 | ⏳ | | | |
| API-27 | POST /api/carrinho/calcular: quantidade negativa | ⏳ | | | |
| API-28 | POST /api/carrinho/calcular: quantidade decimal | ⏳ | | | |
| API-29 | POST /api/carrinho/calcular: quantidade como string | ⏳ | | | |
| API-30 | POST /api/carrinho/calcular: quantidade null | ⏳ | | | |
| API-31 | POST /api/carrinho/calcular: quantidade 5 (limite) | ⏳ | | | |
| API-32 | POST /api/carrinho/calcular: quantidade 6 | ⏳ | | | |
| API-33 | POST /api/carrinho/calcular: Soma dos itens | ⏳ | | | |
| API-34 | POST /api/pedidos: Pedido válido | ⏳ | | | |
| API-35 | POST /api/pedidos: Pedido sem cupom | ⏳ | | | |
| API-36 | POST /api/pedidos: Cupom inexistente | ⏳ | | | |
| API-37 | POST /api/pedidos: Cupom expirado | ⏳ | | | |
| API-38 | POST /api/pedidos: Nome sem sobrenome | ⏳ | | | |
| API-39 | POST /api/pedidos: E-mail inválido | ⏳ | | | |
| API-40 | POST /api/pedidos: CEP 7 dígitos / letras / 9 dígitos | ⏳ | | | |
| API-41 | POST /api/pedidos: CEP sem hífen | ⏳ | | | |
| API-42 | POST /api/pedidos: Vários dados inválidos | ⏳ | | | |
| API-43 | POST /api/pedidos: cliente ausente | ⏳ | | | |
| API-44 | POST /api/pedidos: Quantidade 6 | ⏳ | | | |
| API-45 | POST /api/pedidos: Itens vazio | ⏳ | | | |
| API-46 | POST /api/pedidos: Erros combinados | ⏳ | | | |
| API-47 | Todas: Formato do erro | ⏳ | | | |
| API-48 | Todas: Valores com no máximo 2 casas decimais | ⏳ | | | |
| API-49 | POST /api/carrinho/calcular: Paridade UI × API | ⏳ | | | |
| Corpo base dos pedidos: {"cliente":{"nome":"Maria Silva","email":"maria@exemplo.com","cep":"01310-100"},"itens":[...],"cupom":"..."}. Base URL: https://verzel-store.qa-test-verzel-store.workers.dev | :  | ⏳ | | | |

## Automação (Playwright)

Rode `npm run test:api` e `npm run test:e2e`, abra `npm run report` e registre aqui os resultados. Testes que falham por causa de um bug devem apontar o BUG correspondente. Veja o README para o significado de cada projeto.

| Suíte | Total | Passou | Falhou | Observações |
|---|---|---|---|---|
| `tests/api` | `[ ]` | `[ ]` | `[ ]` | |
| `tests/e2e` | `[ ]` | `[ ]` | `[ ]` | |
