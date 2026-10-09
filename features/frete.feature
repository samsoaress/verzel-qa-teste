# language: pt
@frete
Funcionalidade: Frete grátis
  Como cliente da Verzel Store
  Quero ganhar frete grátis em compras maiores
  Para pagar menos nas minhas compras

  Contexto:
    Dado que estou na Verzel Store com o carrinho vazio

  @CA06 @ui @api
  Cenário: Subtotal exatamente igual a R$ 200,00 tem frete grátis
    Dado que adiciono 2 "Mochila Urbana 20L" ao carrinho
    Quando visualizo o resumo do carrinho
    Então o subtotal é R$ 200,00
    E o frete é R$ 0,00
    E o total é R$ 200,00

  @CA06 @ui @api
  Cenário: Subtotal de R$ 200,00 formado por outro produto
    Dado que adiciono 4 "Garrafa Térmica 750ml" ao carrinho
    Quando visualizo o resumo do carrinho
    Então o subtotal é R$ 200,00
    E o frete é R$ 0,00

  @CA06 @ui @api
  Cenário: Subtotal acima de R$ 200,00 tem frete grátis
    Dado que adiciono 1 "Jaqueta Corta-Vento" ao carrinho
    Quando visualizo o resumo do carrinho
    Então o subtotal é R$ 229,90
    E o frete é R$ 0,00
    E não há valor faltante para o frete grátis

  @CA07 @ui @api
  Cenário: Subtotal abaixo de R$ 200,00 cobra frete fixo
    Dado que adiciono 1 "Mochila Urbana 20L" ao carrinho
    Quando visualizo o resumo do carrinho
    Então o frete é R$ 19,90
    E o carrinho informa que faltam R$ 100,00 para o frete grátis
    E o total é R$ 119,90

  @CA07 @ui @api
  Cenário: Subtotal de R$ 199,80 está a R$ 0,20 do frete grátis
    Dado que adiciono 1 "Camiseta Essencial" ao carrinho
    E que adiciono 1 "Calça Jeans Slim" ao carrinho
    Quando visualizo o resumo do carrinho
    Então o subtotal é R$ 199,80
    E o frete é R$ 19,90
    E o carrinho informa que faltam R$ 0,20 para o frete grátis
    E o total é R$ 219,70

  @CA08 @ui @api
  Cenário: O frete grátis considera o subtotal antes do desconto do cupom
    Dado que adiciono 2 "Mochila Urbana 20L" ao carrinho
    Quando aplico o cupom "BEMVINDO10"
    Então o subtotal é R$ 200,00
    E o desconto é R$ 20,00
    E o frete é R$ 0,00
    E o total é R$ 180,00

  @CA08 @ui @api
  Cenário: Cupom não dá frete grátis a quem não atingiu o subtotal
    Dado que adiciono 1 "Camiseta Essencial" ao carrinho
    E que adiciono 1 "Calça Jeans Slim" ao carrinho
    Quando aplico o cupom "BEMVINDO10"
    Então o frete é R$ 19,90

  @CA09 @ui @api
  Cenário: O desconto do cupom não incide sobre o frete
    Dado que adiciono 1 "Camiseta Essencial" ao carrinho
    E que adiciono 1 "Calça Jeans Slim" ao carrinho
    Quando aplico o cupom "BEMVINDO10"
    Então o desconto é R$ 19,98
    E o frete é R$ 19,90
    E o total é R$ 199,72

  @ui
  Cenário: O frete acompanha o subtotal ao subir e descer da faixa
    Dado que adiciono 2 "Mochila Urbana 20L" ao carrinho
    Quando reduzo a quantidade de "Mochila Urbana 20L" para 1
    Então o frete é R$ 19,90
    Quando aumento a quantidade de "Mochila Urbana 20L" para 2
    Então o frete é R$ 0,00

  @CA06 @CA07 @api
  Esquema do Cenário: Regra de frete por faixa de subtotal
    Dado que o carrinho tem o produto "<produto>" com quantidade <qtd>
    Quando calculo o carrinho
    Então o subtotal é <subtotal>
    E o frete é <frete>

    Exemplos:
      | produto               | qtd | subtotal | frete |
      | Mochila Urbana 20L    | 1   | 100,00   | 19,90 |
      | Garrafa Térmica 750ml | 3   | 150,00   | 19,90 |
      | Garrafa Térmica 750ml | 4   | 200,00   | 0,00  |
      | Garrafa Térmica 750ml | 5   | 250,00   | 0,00  |
      | Tênis Casual Urbano   | 1   | 189,90   | 19,90 |
      | Jaqueta Corta-Vento   | 1   | 229,90   | 0,00  |
