# 01. Análise da documentação e ambiguidades

## 1. Visão geral

- **Card:** VZS-142, versão 2.3.0, publicada em 30/09/2026, status *Pronto para teste*.
- **Entrega:** aplicação de cupom de desconto no carrinho e regra de frete grátis. Os cálculos são feitos pela API e a interface apenas exibe o resultado.
- **Alvo:** loja https://verzel-store.qa-test-verzel-store.workers.dev/ e API em `/api`.

## 2. Escopo

| Dentro do escopo | Fora do escopo |
|---|---|
| Cupom de desconto (CA01 a CA05) | Testes de carga, estresse e segurança |
| Frete grátis e frete fixo (CA06 a CA09) | Login e cadastro de clientes |
| Limite de 5 unidades, UI e API (CA10) | Pagamento online (o pagamento é na entrega) |
| Arredondamento (CA11) | Consulta de pedidos |
| Regras que já existiam: nome, e-mail, CEP | Estoque, envio de e-mail, cobrança |
| Endpoints `/api/produtos`, `/api/carrinho/calcular`, `/api/pedidos` | |

**Comportamentos do ambiente que NÃO são bugs** (seção "Sobre este ambiente"): carrinho guardado só na aba, pedidos fictícios e não armazenados, sem e-mail e sem cobrança, dados fixos, sem controle de estoque e API sem estado.

## 3. Regras de cálculo

```
subtotal = soma(preço unitário × quantidade)
desconto = subtotal × percentual do cupom válido   (0 sem cupom válido)
frete    = 0,00 se subtotal >= 200,00, senão 19,90
faltante = max(0, 200,00 − subtotal)
total    = subtotal − desconto + frete
```

Observações derivadas dos critérios: o frete usa o subtotal **antes** do cupom (CA08); o desconto **não** incide sobre o frete (CA09); todos os valores são arredondados a 2 casas (CA11).

## 4. Matriz de rastreabilidade (critério de aceite → casos)

| CA | Critério | Casos manuais | Casos de API | Automação |
|---|---|---|---|---|
| CA01 | BEMVINDO10 aplica 10% | CT-A1, CT-A6, CT-005, CT-D4 | API-07, API-11 | CT02, CT08, e2e CT-A1 |
| CA02 | Cupom sem diferenciar caixa e com espaços nas pontas | CT-A2a a CT-A2d | API-13, API-14 | cupom (variações), e2e CT-A2 |
| CA03 | Cupom inexistente: "Cupom inválido." | CT-A3, CT-A7 | API-15, API-36 | cupom inexistente, e2e CT-A3 |
| CA04 | Cupom expirado: "Cupom expirado." | CT-A4 | API-16, API-37 | cupom expirado, e2e CT-A4 |
| CA05 | Um cupom por vez | CT-A5 | n/a (regra de interface) | n/a |
| CA06 | Frete grátis a partir de R$ 200,00 (inclusive) | CT-B1a, CT-B1b, CT-B6, CT-B7 | API-08 | CT03, CT04, CT11, e2e CT-B1a |
| CA07 | Frete fixo R$ 19,90 e faltante | CT-B2, CT-B3, CT-021 | API-06 | CT01, CT05, e2e CT-B2 |
| CA08 | Frete usa subtotal antes do cupom | CT-B4, CT-B8 | API-09 | CT06, e2e CT-B4 |
| CA09 | Desconto não incide no frete | CT-B5 | API-10 | CT07, e2e CT-B5 |
| CA10 | Máximo de 5 unidades (UI e API) | CT-C1 a CT-C4 | API-26 a API-32, API-44 | CT10, validações, e2e CT-C2 |
| CA11 | Arredondamento a 2 casas | CT-D1 a CT-D4 | API-12, API-48 | CT09, CT12 a CT14 |

## 5. Estratégia de teste

1. **Análise** da documentação e levantamento das regras e dos limites (199,80 / 200,00 / 229,90; quantidades 4 / 5 / 6).
2. **Valores esperados** calculados antes de olhar a loja (aba *Calculadora* da planilha).
3. **Testes manuais** por critério de aceite, mais fluxo básico, navegação e compatibilidade.
4. **Testes exploratórios** com tempo definido (45 minutos) e foco em estados inesperados.
5. **Testes de API** com Postman (manuais) e Playwright (automatizados): contrato, valores, validações e formato de erro.
6. **Paridade UI × API**: comparar o que a tela mostra com a resposta de `/api/carrinho/calcular` na aba Network.
7. **Automação** com Playwright: projeto `api` (sem navegador) e projeto `e2e` (Chromium).

Técnicas aplicadas: análise de valor-limite, partição de equivalência, tabela de decisão (cupom × faixa de frete), teste exploratório e teste baseado em critérios de aceite.

## 6. Riscos e pontos de atenção

- **Valor-limite do frete:** erro clássico de `>` no lugar de `>=` em R$ 200,00 (CA06).
- **Ordem das regras:** aplicar o desconto antes de decidir o frete viola o CA08.
- **Desconto no frete:** viola o CA09.
- **Limite de 5 só na interface:** o CA10 vale também para a API; testar os dois e os vários caminhos de entrada (botão +, digitação, adicionar repetido).
- **Ponto flutuante:** `59.9 × 3` em JavaScript dá `179.70000000000003`. Verificar casas decimais em todas as respostas (CA11).
- **Textos exatos:** `Cupom inválido.` e `Cupom expirado.` (com ponto final e acento).

## 7. Ambiguidades e interpretações adotadas

A documentação pede que ambiguidades sejam registradas com a interpretação adotada. As colunas *Comportamento observado* devem ser preenchidas durante a execução.

| # | Ponto ambíguo | Fonte | O que a documentação diz | Interpretação adotada | Caso | Comportamento observado |
|---|---|---|---|---|---|---|
| 1 | Método de arredondamento | CA11 | 'Arredondados para 2 casas decimais', sem citar o método | Comercial (half-up) | CT-D1, API-12 | `[PREENCHER]` |
| 2 | Cupom com espaço no meio ('BEM VINDO10') | CA02 | Só fala de espaços no início e no fim | Cupom inválido | CT-A2e | `[PREENCHER]` |
| 3 | Mesmo produto adicionado várias vezes pela UI (3 + 3) | CA10 | Máximo de 5 unidades por produto por pedido | O limite vale para a soma | CT-C2c | `[PREENCHER]` |
| 4 | Cupom vazio, null ou só espaços | CA02/CA03 | Não define | Tratado como sem cupom | API-17, CT-A7 | `[PREENCHER]` |
| 5 | Cupom com tipo errado (número/objeto) | API | Não define | Erro de validação ou sem cupom; nunca 500 | API-18 | `[PREENCHER]` |
| 6 | Trocar cupom sem remover o atual | CA05 | 'Para trocar, o cliente remove o cupom atual' | UI deve impedir a aplicação do segundo | CT-A5 | `[PREENCHER]` |
| 7 | Mensagem de faltante quando já há frete grátis | CA07 | Só descreve o caso abaixo de R$ 200 | Mensagem oculta ou R$ 0,00 | CT-B6 | `[PREENCHER]` |
| 8 | Nome com espaços no fim ('Maria  ') | Regras existentes | Precisa de nome e sobrenome | Rejeitar (sem sobrenome real) | CT-E5 | `[PREENCHER]` |
| 9 | Ordem de validação em /api/pedidos com vários erros | API | Não define a precedência | Anotar a ordem observada | API-46 | `[PREENCHER]` |
| 10 | Carrinho vazio: frete e total | Regras | Fórmula não cobre subtotal zero | Frete 0 e total 0, ou bloquear finalização | CT-F6 | `[PREENCHER]` |
| 11 | Cupom aplicado antes de ter itens | CA01 | Não define | Cupom permanece e aplica ao adicionar | CT-A8 | `[PREENCHER]` |

> As interpretações da coluna 5 foram sugeridas na montagem do projeto. **Revise e substitua pela sua própria** depois de ver o comportamento real da loja.

## 8. Itens que pedem observação adicional

- O ambiente é compartilhado com outros candidatos: nenhum teste de carga foi feito e a automação roda com um único worker, de forma sequencial.
- A documentação não descreve a interface (telas, textos de botões, mensagens de campos). Os testes de UI foram escritos a partir das regras de negócio, e os seletores foram obtidos com o codegen do Playwright. Os do bloco de resumo e das mensagens de erro do checkout ainda precisam ser confirmados (ver `tests/e2e/pages/loja.page.ts`).
