# 02. Casos de teste

Resumo dos casos de teste. A versão para preencher durante a execução está em [`planilhas/`](planilhas/):

- `Planilha_Testes_Verzel_Store.xlsx`: casos por critério de aceite (cupom, frete, quantidade, arredondamento, checkout, exploratório), casos de API, calculadora de valores esperados, bugs e ambiguidades.
- `Casos_Manuais_Complementares_Verzel.xlsx`: fluxo básico, listagem, carrinho, navegação, pedido concluído e compatibilidade.

A collection do Postman para a API está em [`api/verzel-store.postman_collection.json`](api/verzel-store.postman_collection.json). Os cenários em Gherkin estão em [`../features/`](../features/).

Valores esperados vêm das regras da documentação (`total = subtotal − desconto + frete`) e foram calculados antes da execução.

## Parte A. Casos manuais por critério de aceite (52 casos)

| ID | Grupo | CA | Cenário | Pré-condição | Passos | Resultado esperado |
|---|---|---|---|---|---|---|
| CT-A1 | A. Cupom | CA01 | Aplicar BEMVINDO10 | Carrinho vazio | 1. Adicionar 1× Mochila Urbana 20L<br>2. Abrir carrinho<br>3. Digitar BEMVINDO10 e aplicar | Subtotal 100,00 · Desconto 10,00 · Frete 19,90 · Faltante 100,00 · Total 109,90 |
| CT-A2a | A. Cupom | CA02 | Cupom em minúsculas | 1× Mochila no carrinho | Aplicar 'bemvindo10' | Desconto 10,00 · Total 109,90 |
| CT-A2b | A. Cupom | CA02 | Cupom com caixa mista | 1× Mochila no carrinho | Aplicar 'BemVindo10' | Desconto 10,00 · Total 109,90 |
| CT-A2c | A. Cupom | CA02 | Espaços no início | 1× Mochila no carrinho | Aplicar '   BEMVINDO10' | Desconto 10,00 · Total 109,90 |
| CT-A2d | A. Cupom | CA02 | Espaços no fim | 1× Mochila no carrinho | Aplicar 'BEMVINDO10   ' | Desconto 10,00 · Total 109,90 |
| CT-A2e | A. Cupom | CA02 | Espaço no meio (ambiguidade) | 1× Mochila no carrinho | Aplicar 'BEM VINDO10' | Não definido na doc. Registrar o que ocorre e a interpretação (provável: cupom inválido). |
| CT-A3 | A. Cupom | CA03 | Cupom inexistente | 1× Mochila no carrinho | Aplicar 'NAOEXISTE' | Mensagem exata 'Cupom inválido.' · Desconto 0 · Total 119,90 |
| CT-A4 | A. Cupom | CA04 | Cupom expirado | 1× Mochila no carrinho | Aplicar 'VERAO2026' | Mensagem exata 'Cupom expirado.' · Desconto 0 · Total 119,90 |
| CT-A5 | A. Cupom | CA05 | Apenas um cupom por vez | BEMVINDO10 já aplicado | 1. Tentar aplicar outro cupom sem remover<br>2. Remover o cupom<br>3. Aplicar VERAO2026 | Passo 1: UI impede ou exige remover. Passo 3: desconto do BEMVINDO10 desaparece e aparece 'Cupom expirado.' |
| CT-A6 | A. Cupom | CA01 | Cupom recalcula ao mudar quantidade | BEMVINDO10 aplicado com 1× Mochila | Mudar a quantidade da Mochila para 2 | Subtotal 200,00 · Desconto 20,00 · Frete 0,00 · Total 180,00 |
| CT-A7 | A. Cupom | CA03 | Cupom vazio | 1× Mochila no carrinho | Clicar em aplicar sem digitar | Nada é aplicado; mensagem clara (anotar). Não deve quebrar a tela. |
| CT-A8 | A. Cupom | CA01 | Aplicar cupom antes de adicionar produto | Carrinho vazio | Aplicar BEMVINDO10, depois adicionar 1× Mochila | Anotar. Se o cupom fica aplicado: desconto 10,00 · Total 109,90. |
| CT-A9 | A. Cupom | CA01 | Esvaziar carrinho com cupom aplicado | BEMVINDO10 aplicado | Remover todos os itens | Sem valores negativos; sem desconto fantasma (anotar). |
| CT-B1a | B. Frete | CA06 | Limite exato R$ 200,00 (Mochila) | Carrinho vazio | Adicionar 2× Mochila | Subtotal 200,00 · Frete 0,00 · Faltante 0,00 · Total 200,00 |
| CT-B1b | B. Frete | CA06 | Limite exato R$ 200,00 (Garrafa) | Carrinho vazio | Adicionar 4× Garrafa Térmica 750ml | Subtotal 200,00 · Frete 0,00 · Total 200,00 |
| CT-B2 | B. Frete | CA07 | Um passo abaixo do limite | Carrinho vazio | Adicionar 1× Camiseta + 1× Calça Jeans | Subtotal 199,80 · Frete 19,90 · Faltante 0,20 · Total 219,70 |
| CT-B3 | B. Frete | CA07 | Frete fixo e aviso de faltante | Carrinho vazio | Adicionar 1× Mochila | Frete 19,90 · Aviso: faltam R$ 100,00 · Total 119,90 |
| CT-B4 | B. Frete | CA08 | Frete usa subtotal ANTES do cupom | Carrinho vazio | Adicionar 2× Mochila e aplicar BEMVINDO10 | Desconto 20,00 · Frete 0,00 · Total 180,00 (se o frete virar 19,90, viola CA08) |
| CT-B5 | B. Frete | CA09 | Desconto não incide sobre o frete | Carrinho vazio | Adicionar Camiseta + Calça e aplicar BEMVINDO10 | Subtotal 199,80 · Desconto 19,98 · Frete 19,90 (inteiro) · Total 199,72 |
| CT-B6 | B. Frete | CA06 | Frete grátis bem acima do limite | Carrinho vazio | Adicionar 1× Jaqueta Corta-Vento | Subtotal 229,90 · Frete 0,00 · Faltante 0,00 (mensagem oculta ou R$ 0,00) · Total 229,90 |
| CT-B7 | B. Frete | CA06 | Cruzar o limite subindo e descendo | Carrinho vazio | 1. 2× Mochila (200,00)<br>2. Reduzir para 1× (100,00)<br>3. Subir de novo para 2× | Frete 0,00 → 19,90 → 0,00 e faltante atualiza a cada passo |
| CT-B8 | B. Frete | CA06 | Cupom + subtotal logo abaixo do limite | Carrinho vazio | Camiseta + Calça + BEMVINDO10 | Frete 19,90 (subtotal 199,80 < 200,00) · Total 199,72 |
| CT-C1 | C. Quantidade | CA10 | Exatamente 5 unidades | Carrinho vazio | Adicionar 5× Garrafa Térmica | Aceita · Subtotal 250,00 · Frete 0,00 · Total 250,00 |
| CT-C2a | C. Quantidade | CA10 | 6 unidades pelo botão + | 5× Garrafa no carrinho | Clicar em + de novo | Bloqueia ou avisa; quantidade permanece 5 |
| CT-C2b | C. Quantidade | CA10 | 6 unidades digitando no campo | Carrinho com Garrafa | Digitar 6 no campo de quantidade | Bloqueia, ajusta para 5 ou mostra erro; nunca aceita 6 em silêncio |
| CT-C2c | C. Quantidade | CA10 | 6 unidades via 'Adicionar' repetido | Carrinho vazio | Clicar 6× em Adicionar na lista de produtos | Soma não passa de 5 (ambiguidade: registrar o comportamento) |
| CT-C2d | C. Quantidade | CA10 | Limite aplicado em cada produto separadamente | Carrinho vazio | 5× Garrafa + 5× Boné | Aceita (limite é por produto) · Subtotal 499,50 |
| CT-C3 | C. Quantidade | CA10 | Valores inválidos no campo | 1× Garrafa no carrinho | Digitar: 0, -1, 1,5, abc, 99, vazio | Nenhum valor inválido é aceito em silêncio; anotar o resultado de cada um |
| CT-C4 | C. Quantidade | — | Reduzir abaixo de 1 | 1× produto no carrinho | Clicar em − com quantidade 1 | Remove o item ou bloqueia (anotar); sem quantidade 0 ou negativa |
| CT-D1 | D. Arredondamento | CA11 | 3× Camiseta com cupom | Carrinho vazio | Adicionar 3× Camiseta e aplicar BEMVINDO10 | Subtotal 179,70 · Desconto 17,97 · Frete 19,90 · Faltante 20,30 · Total 181,63 |
| CT-D2a | D. Arredondamento | CA11 | 3× Boné com cupom | Carrinho vazio | Adicionar 3× Boné e aplicar BEMVINDO10 | Subtotal 149,70 · Desconto 14,97 · Frete 19,90 · Faltante 50,30 · Total 154,63 |
| CT-D2b | D. Arredondamento | CA11 | 3× Meias com cupom | Carrinho vazio | Adicionar 3× Kit Meias e aplicar BEMVINDO10 | Subtotal 89,70 · Desconto 8,97 · Frete 19,90 · Faltante 110,30 · Total 100,63 |
| CT-D3 | D. Arredondamento | CA11 | Formatação de moeda | Qualquer carrinho | Conferir se todos os valores aparecem como R$ 1.234,56 (2 casas, vírgula) | Nenhum valor como 17.970000001, R$ 0,1 ou 1234.5 |
| CT-D4 | D. Arredondamento | CA11 | Carrinho misto | Carrinho vazio | 1× Tênis (189,90) + 1× Meias (29,90) + 1× Boné (49,90) + BEMVINDO10 | Subtotal 269,70 · Desconto 26,97 · Frete 0,00 · Total 242,73 |
| CT-E1 | E. Checkout | — | Pedido válido sem cupom | 1× Mochila no carrinho | Preencher Maria Silva / maria@exemplo.com / 01310-100 e confirmar | Número no formato VZ-000000; resumo igual ao carrinho (Total 119,90) |
| CT-E2 | E. Checkout | CA01 | Pedido válido com cupom | 1× Mochila + BEMVINDO10 | Confirmar pedido | VZ-000000; Desconto 10,00 · Frete 19,90 · Total 109,90 |
| CT-E3 | E. Checkout | — | Nome sem sobrenome | Item no carrinho | Nome 'Maria' | Rejeita com mensagem no campo |
| CT-E4 | E. Checkout | — | Nome vazio | Item no carrinho | Deixar nome em branco | Rejeita |
| CT-E5 | E. Checkout | — | Nome com espaço no fim (ambiguidade) | Item no carrinho | Nome 'Maria   ' | Rejeita (sem sobrenome real). Registrar interpretação. |
| CT-E6 | E. Checkout | — | E-mail inválido | Item no carrinho | Testar: maria@ · maria.com · @exemplo.com · maria @x.com | Rejeita todos |
| CT-E7 | E. Checkout | — | CEP com hífen | Item no carrinho | 01310-100 | Aceita |
| CT-E8 | E. Checkout | — | CEP sem hífen | Item no carrinho | 01310100 | Aceita |
| CT-E9 | E. Checkout | — | CEP inválido | Item no carrinho | Testar: 0131010 (7) · 013101000 (9) · abcde-fgh · vazio | Rejeita todos |
| CT-E10 | E. Checkout | — | Todos os campos vazios | Item no carrinho | Confirmar sem preencher nada | Todos os erros aparecem (não só o primeiro) |
| CT-E11 | E. Checkout | — | Sem etapa de pagamento online | Item no carrinho | Percorrer o fluxo até o fim | Não existe pagamento online (pago na entrega). Etapa de pagamento = divergência. |
| CT-E12 | E. Checkout | — | Clique duplo em Confirmar | Dados válidos preenchidos | Clicar rápido 2× em Confirmar | Não gera erro nem duas confirmações (anotar) |
| CT-F1 | F. Exploratório | — | Voltar e recarregar | Carrinho com itens e cupom | F5 no carrinho; botão Voltar do navegador | Carrinho persiste na aba (esperado). Cupom: anotar se persiste. |
| CT-F2 | F. Exploratório | — | Consistência UI × API | DevTools > Network | Comparar resposta de /api/carrinho/calcular com a tela | Valores idênticos. Divergência = bug de UI. |
| CT-F3 | F. Exploratório | — | Responsividade | Largura 375px | Percorrer produtos, carrinho e checkout | Sem texto cortado, sem rolagem horizontal, botões clicáveis |
| CT-F4 | F. Exploratório | — | Teclado | Qualquer tela | Tab/Shift+Tab/Enter nos formulários | Foco visível; Enter aplica cupom/envia formulário |
| CT-F5 | F. Exploratório | — | Textos e acentuação | Qualquer tela | Ler mensagens e rótulos | Português correto, sem inglês nem códigos técnicos expostos |
| CT-F6 | F. Exploratório | — | Carrinho vazio | Carrinho vazio | Abrir o carrinho e tentar finalizar | Mensagem amigável; não permite confirmar pedido vazio |

## Parte B. Casos manuais complementares (39 casos)

| ID | Grupo | Cenário | Passos | Resultado esperado |
|---|---|---|---|---|
| CT-001 | 0. Fluxo básico | Acessar loja | Abrir https://verzel-store.qa-test-verzel-store.workers.dev/ | Loja carregada, sem erro visível |
| CT-002 | 0. Fluxo básico | Visualizar produtos | Observar a página inicial | Produtos exibidos |
| CT-003 | 0. Fluxo básico | Adicionar produto | Clicar em Adicionar em um produto e abrir o carrinho | Produto aparece no carrinho |
| CT-004 | 0. Fluxo básico | Alterar quantidade | No carrinho, aumentar e diminuir a quantidade de um item | Total atualizado |
| CT-005 | 0. Fluxo básico | Aplicar cupom (ajustado) | Com 1× Mochila no carrinho, aplicar BEMVINDO10 | Desconto de 10% sobre o subtotal (R$ 10,00); total R$ 109,90 |
| CT-006 | 1. Listagem | Quantidade de produtos exibidos | Contar os produtos na listagem | 8 produtos (P001 a P008) |
| CT-007 | 1. Listagem | Nome e preço de cada produto | Comparar cada card com a tabela da documentação | Iguais à documentação (ex.: Camiseta Essencial R$ 59,90) |
| CT-008 | 1. Listagem | Formatação de preço | Observar o preço de todos os produtos | Formato R$ 59,90, com vírgula e 2 casas |
| CT-009 | 1. Listagem | Descrição e categoria | Comparar com a resposta de GET /api/produtos (aba Network) | Aparecem na tela e batem com a API |
| CT-010 | 1. Listagem | Imagens dos produtos | Observar todos os cards | Imagens carregam, sem imagem quebrada |
| CT-011 | 1. Listagem | Detalhe de um produto (se existir) | Clicar em um produto | Abre o produto certo, com dados corretos. Se não existir a tela, marcar como N/A. |
| CT-012 | 2. Adicionar ao carrinho | Adicionar o mesmo produto 2 vezes | Clicar 2× em Adicionar no mesmo produto | Uma linha com quantidade 2, não duas linhas |
| CT-013 | 2. Adicionar ao carrinho | Adicionar produtos diferentes | Adicionar Camiseta e Boné | Uma linha por produto; subtotal R$ 109,80 |
| CT-014 | 2. Adicionar ao carrinho | Contador do carrinho (ícone/badge) | Adicionar itens e observar o contador | Reflete a quantidade correta (anotar se conta unidades ou produtos) |
| CT-015 | 2. Adicionar ao carrinho | Feedback ao adicionar | Adicionar um produto | Mensagem ou indicação visual de que foi adicionado |
| CT-016 | 2. Adicionar ao carrinho | Adicionar todos os 8 produtos | Adicionar 1 unidade de cada produto | Subtotal R$ 849,40; frete R$ 0,00; total R$ 849,40 |
| CT-017 | 3. Carrinho | Remover um item | Clicar em remover em um dos itens | Item some e os totais recalculam |
| CT-018 | 3. Carrinho | Esvaziar o carrinho | Remover todos os itens | Estado vazio com mensagem amigável; sem valores negativos |
| CT-019 | 3. Carrinho | Total por linha | Conferir cada linha na calculadora | Preço unitário × quantidade, correto |
| CT-020 | 3. Carrinho | Remover o cupom | Aplicar BEMVINDO10 e clicar em remover cupom | Desconto some e total volta ao valor sem cupom |
| CT-021 | 3. Carrinho | Mensagem de falta para frete grátis | Mochila ×1, depois ×2 | Mostra 'faltam R$ 100,00' e some ao atingir R$ 200,00 |
| CT-022 | 3. Carrinho | Continuar comprando | No carrinho, voltar à lista de produtos | Volta à lista sem perder o carrinho |
| CT-023 | 4. Navegação e estado | Recarregar a página (F5) com itens | Adicionar itens e apertar F5 | Carrinho continua na mesma aba (esperado pela doc) |
| CT-024 | 4. Navegação e estado | Abrir a loja em outra aba | Abrir a URL em nova aba | Carrinho vazio (esperado, NÃO é bug) |
| CT-025 | 4. Navegação e estado | Botão Voltar do navegador | Navegar até o carrinho e clicar em Voltar | Não perde dados nem quebra a tela |
| CT-026 | 4. Navegação e estado | URL inexistente | Acessar /xyz | Página de erro tratada, sem tela em branco |
| CT-027 | 4. Navegação e estado | Acessar /documentacao | Abrir /documentacao | Abre e o conteúdo bate com o PDF |
| CT-028 | 4. Navegação e estado | Links e botões do menu | Clicar em cada link e botão do menu | Todos levam ao destino certo |
| CT-029 | 5. Pedido concluído | Tela de confirmação | Finalizar um pedido válido | Mostra número VZ-000000, dados do cliente e itens |
| CT-030 | 5. Pedido concluído | Valores da confirmação × carrinho | Comparar subtotal, desconto, frete e total | Idênticos |
| CT-031 | 5. Pedido concluído | CEP exibido na confirmação | Informar 01310-100 e ver a confirmação | Pode aparecer sem hífen (a API normaliza); conferir consistência |
| CT-032 | 5. Pedido concluído | Carrinho após confirmar | Voltar à loja depois de confirmar | Anotar o comportamento (esvazia ou não) |
| CT-033 | 5. Pedido concluído | Nova compra logo depois | Iniciar um novo pedido | Não herda itens nem cupom da compra anterior |
| CT-034 | 6. Compatibilidade e usabilidade | Chrome, Firefox e Edge | Repetir o fluxo básico em cada navegador | Mesmo comportamento nos três |
| CT-035 | 6. Compatibilidade e usabilidade | Celular (375px) e tablet (768px) | DevTools > modo dispositivo; percorrer o fluxo | Layout se adapta, sem rolagem horizontal |
| CT-036 | 6. Compatibilidade e usabilidade | Navegação por teclado | Usar Tab, Shift+Tab e Enter | Funcionam e o foco fica visível |
| CT-037 | 6. Compatibilidade e usabilidade | Zoom 150% | Ctrl + '+' até 150% | Nada sobrepõe ou corta |
| CT-038 | 6. Compatibilidade e usabilidade | Mensagens de erro | Provocar erros de cupom e checkout | Em português, com acentos, claras e perto do campo |
| CT-039 | 6. Compatibilidade e usabilidade | Cliques rápidos repetidos | Clicar várias vezes em Aplicar, + e Confirmar | Sem duplicar ação nem travar |

## Parte C. Casos de API (50 casos)

| ID | Endpoint | Cenário | Requisição | HTTP | Resultado esperado |
|---|---|---|---|---|---|
| API-01 | GET /api/produtos | Listar produtos | GET | 200 | 8 produtos com id, nome, descricao, categoria, preco; preços conforme tabela |
| API-02 | GET /api/produtos/{id} | Id existente | GET /api/produtos/P001 | 200 | Produto P001, Camiseta Essencial, preco 59.9 |
| API-03 | GET /api/produtos/{id} | Id inexistente | GET /api/produtos/P999 | 404 | erro.codigo = PRODUTO_NAO_ENCONTRADO |
| API-04 | /api/produtos | Método não permitido | POST /api/produtos | 405 | METODO_NAO_PERMITIDO |
| API-05 | /api/xyz | Rota inexistente | GET /api/xyz | 404 | ROTA_NAO_ENCONTRADA |
| API-06 | POST /api/carrinho/calcular | Sem cupom, abaixo de 200 | itens: P005×1 | 200 | subtotal 100 · desconto 0 · frete 19.9 · freteGratis false · faltante 100 · total 119.9 |
| API-07 | POST /api/carrinho/calcular | Cupom válido | itens: P005×1, cupom BEMVINDO10 | 200 | desconto 10 · frete 19.9 · total 109.9 · cupom.aplicado true |
| API-08 | POST /api/carrinho/calcular | Limite 200,00 exato | itens: P005×2 | 200 | frete 0 · freteGratis true · faltante 0 · total 200 |
| API-09 | POST /api/carrinho/calcular | Frete grátis usa subtotal antes do cupom | itens: P005×2, cupom BEMVINDO10 | 200 | subtotal 200 · desconto 20 · frete 0 · total 180 |
| API-10 | POST /api/carrinho/calcular | Desconto não incide no frete | itens: P001×1 + P002×1, cupom BEMVINDO10 | 200 | subtotal 199.8 · desconto 19.98 · frete 19.9 · faltante 0.2 · total 199.72 |
| API-11 | POST /api/carrinho/calcular | Exemplo da documentação | itens: P002×1 + P004×2, cupom BEMVINDO10 | 200 | subtotal 239.7 · desconto 23.97 · frete 0 · total 215.73 |
| API-12 | POST /api/carrinho/calcular | Arredondamento (float) | itens: P001×3, cupom BEMVINDO10 | 200 | subtotal 179.7 · desconto 17.97 · total 181.63 (nenhum valor com 15+ casas, ex.: 179.70000000000002) |
| API-13 | POST /api/carrinho/calcular | Cupom minúsculo | cupom 'bemvindo10' | 200 | cupom.aplicado true · desconto 10 (P005×1) |
| API-14 | POST /api/carrinho/calcular | Cupom com espaços | cupom '  BEMVINDO10  ' | 200 | cupom.aplicado true · desconto 10 |
| API-15 | POST /api/carrinho/calcular | Cupom inexistente | cupom NAOEXISTE | 200 | desconto 0 · cupom.mensagem 'Cupom inválido.' (não gera erro aqui) |
| API-16 | POST /api/carrinho/calcular | Cupom expirado | cupom VERAO2026 | 200 | desconto 0 · cupom.mensagem 'Cupom expirado.' |
| API-17 | POST /api/carrinho/calcular | Cupom null / vazio / só espaços | cupom null, "", "   " | 200 | Anotar (ambiguidade). Provável: tratado como sem cupom. |
| API-18 | POST /api/carrinho/calcular | Cupom em tipo errado | cupom 123 e cupom {} | a anotar | Anotar comportamento (ambiguidade); não deve ser erro 500 |
| API-19 | POST /api/carrinho/calcular | Corpo não-JSON | body: {abc | 400 | JSON_INVALIDO |
| API-20 | POST /api/carrinho/calcular | itens ausente | {} | 422 | ITENS_OBRIGATORIOS |
| API-21 | POST /api/carrinho/calcular | itens vazio | itens: [] | 422 | ITENS_OBRIGATORIOS |
| API-22 | POST /api/carrinho/calcular | item não é objeto | itens: ["P001"] | 422 | ITEM_INVALIDO |
| API-23 | POST /api/carrinho/calcular | item sem produtoId | itens: [{"quantidade":1}] | 422 | ITEM_INVALIDO |
| API-24 | POST /api/carrinho/calcular | produto inexistente | itens: P999×1 | 422 | PRODUTO_NAO_ENCONTRADO |
| API-25 | POST /api/carrinho/calcular | produto duplicado | itens: P001×1 e P001×2 | 422 | ITEM_DUPLICADO |
| API-26 | POST /api/carrinho/calcular | quantidade 0 | P001×0 | 422 | QUANTIDADE_INVALIDA |
| API-27 | POST /api/carrinho/calcular | quantidade negativa | P001×-1 | 422 | QUANTIDADE_INVALIDA |
| API-28 | POST /api/carrinho/calcular | quantidade decimal | P001×1.5 | 422 | QUANTIDADE_INVALIDA |
| API-29 | POST /api/carrinho/calcular | quantidade como string | P001×"2" | 422 | QUANTIDADE_INVALIDA |
| API-30 | POST /api/carrinho/calcular | quantidade null | P001×null | 422 | QUANTIDADE_INVALIDA |
| API-31 | POST /api/carrinho/calcular | quantidade 5 (limite) | P008×5 | 200 | subtotal 250 · frete 0 |
| API-32 | POST /api/carrinho/calcular | quantidade 6 | P008×6 | 422 | QUANTIDADE_MAXIMA_EXCEDIDA |
| API-33 | POST /api/carrinho/calcular | Soma dos itens | Qualquer carrinho com 2+ itens | 200 | soma dos total dos itens = subtotal; total = subtotal − desconto + frete |
| API-34 | POST /api/pedidos | Pedido válido | cliente válido; P005×1; BEMVINDO10 | 201 | numero ^VZ-\d{6}$ · cep 01310100 (sem hífen) · total 109.9 |
| API-35 | POST /api/pedidos | Pedido sem cupom | cliente válido; P005×1 | 201 | total 119.9 · cupom ausente ou aplicado false (anotar) |
| API-36 | POST /api/pedidos | Cupom inexistente | cupom NAOEXISTE | 422 | CUPOM_INVALIDO |
| API-37 | POST /api/pedidos | Cupom expirado | cupom VERAO2026 | 422 | CUPOM_EXPIRADO |
| API-38 | POST /api/pedidos | Nome sem sobrenome | nome 'Maria' | 422 | DADOS_INVALIDOS, detalhes em campos |
| API-39 | POST /api/pedidos | E-mail inválido | maria@ · maria.com · @exemplo.com | 422 | DADOS_INVALIDOS |
| API-40 | POST /api/pedidos | CEP 7 dígitos / letras / 9 dígitos | 0131010 · abcde-fgh · 013101000 | 422 | DADOS_INVALIDOS |
| API-41 | POST /api/pedidos | CEP sem hífen | 01310100 | 201 | cep normalizado 01310100 |
| API-42 | POST /api/pedidos | Vários dados inválidos | nome, e-mail e CEP inválidos | 422 | DADOS_INVALIDOS com todos os erros em campos |
| API-43 | POST /api/pedidos | cliente ausente | sem o objeto cliente | 422 | Anotar código (provável DADOS_INVALIDOS) |
| API-44 | POST /api/pedidos | Quantidade 6 | P008×6 com cliente válido | 422 | QUANTIDADE_MAXIMA_EXCEDIDA |
| API-45 | POST /api/pedidos | Itens vazio | itens: [] | 422 | ITENS_OBRIGATORIOS |
| API-46 | POST /api/pedidos | Erros combinados | cliente inválido + quantidade 6 | 422 | Anotar qual erro vem primeiro (ambiguidade: ordem de validação) |
| API-47 | Todas | Formato do erro | Qualquer resposta de erro | — | JSON {erro:{codigo,mensagem,campo}} e Content-Type application/json |
| API-48 | Todas | Valores com no máximo 2 casas decimais | Todas as respostas 200/201 | — | Nenhum número com ruído de ponto flutuante |
| API-49 | POST /api/carrinho/calcular | Paridade UI × API | Carrinho na tela vs. resposta no Network | 200 | Mesmos valores |
| Corpo base dos pedidos: {"cliente":{"nome":"Maria Silva","email":"maria@exemplo.com","cep":"01310-100"},"itens":[...],"cupom":"..."}. Base URL: https://verzel-store.qa-test-verzel-store.workers.dev |  |  |  |  |  |
