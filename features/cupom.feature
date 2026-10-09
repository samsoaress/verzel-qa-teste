# language: pt
@cupom
Funcionalidade: Cupom de desconto
  Como cliente da Verzel Store
  Quero aplicar um cupom de desconto no carrinho
  Para pagar menos nas minhas compras

  Contexto:
    Dado que estou na Verzel Store com o carrinho vazio
    E que adiciono 1 "Mochila Urbana 20L" ao carrinho

  @CA01 @ui
  Cenário: Cupom BEMVINDO10 aplica 10% sobre o subtotal
    Quando aplico o cupom "BEMVINDO10"
    Então o subtotal é R$ 100,00
    E o desconto é R$ 10,00
    E o frete é R$ 19,90
    E o total é R$ 109,90

  @CA02 @ui @api
  Esquema do Cenário: O código do cupom não diferencia maiúsculas de minúsculas
    Quando aplico o cupom "<codigo>"
    Então o desconto é R$ 10,00
    E o total é R$ 109,90

    Exemplos:
      | codigo     |
      | BEMVINDO10 |
      | bemvindo10 |
      | BemVindo10 |
      | bEmViNdO10 |

  @CA02 @ui @api
  Cenário: Espaços no início do código do cupom são ignorados
    Quando aplico o cupom "   BEMVINDO10"
    Então o desconto é R$ 10,00

  @CA02 @ui @api
  Cenário: Espaços no fim do código do cupom são ignorados
    Quando aplico o cupom "BEMVINDO10   "
    Então o desconto é R$ 10,00

  @CA02 @ambiguidade
  Cenário: Espaço no meio do código não está definido na documentação
    Quando aplico o cupom "BEM VINDO10"
    Então registro o comportamento observado
    # Interpretação adotada: cupom inválido (CA02 só cita espaços nas pontas)

  @CA03 @ui @api
  Cenário: Cupom inexistente exibe mensagem e não aplica desconto
    Quando aplico o cupom "NAOEXISTE"
    Então vejo a mensagem "Cupom inválido."
    E nenhum desconto é aplicado
    E o total é R$ 119,90

  @CA04 @ui @api
  Cenário: Cupom fora da validade exibe mensagem e não aplica desconto
    Quando aplico o cupom "VERAO2026"
    Então vejo a mensagem "Cupom expirado."
    E nenhum desconto é aplicado
    E o total é R$ 119,90

  @CA05 @ui
  Cenário: Apenas um cupom pode ser aplicado por vez
    Dado que apliquei o cupom "BEMVINDO10"
    Quando tento aplicar o cupom "VERAO2026" sem remover o atual
    Então a loja não permite a troca direta
    E o desconto do cupom "BEMVINDO10" continua aplicado

  @CA05 @ui
  Cenário: Para trocar de cupom é preciso remover o atual
    Dado que apliquei o cupom "BEMVINDO10"
    Quando removo o cupom atual
    E aplico o cupom "VERAO2026"
    Então vejo a mensagem "Cupom expirado."
    E nenhum desconto é aplicado

  @CA01 @ui
  Cenário: O desconto é recalculado quando a quantidade muda
    Dado que apliquei o cupom "BEMVINDO10"
    Quando altero a quantidade de "Mochila Urbana 20L" para 2
    Então o desconto é R$ 20,00
    E o total é R$ 180,00

  @ui
  Cenário: Remover o cupom devolve o total sem desconto
    Dado que apliquei o cupom "BEMVINDO10"
    Quando removo o cupom atual
    Então nenhum desconto é aplicado
    E o total é R$ 119,90

  @CA03 @ambiguidade
  Cenário: Aplicar cupom sem digitar nada
    Quando clico em aplicar com o campo de cupom vazio
    Então registro o comportamento observado
    E a tela não apresenta erro técnico

  @api
  Cenário: Na API de cálculo, cupom inválido não gera erro
    Quando calculo o carrinho pela API com o cupom "NAOEXISTE"
    Então a resposta tem status 200
    E o desconto é 0
    E "cupom.mensagem" é "Cupom inválido."

  @api
  Cenário: Na API de pedidos, cupom expirado gera erro
    Quando confirmo um pedido pela API com o cupom "VERAO2026"
    Então a resposta tem status 422
    E o código do erro é "CUPOM_EXPIRADO"
