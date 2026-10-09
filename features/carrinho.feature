# language: pt
@carrinho
Funcionalidade: Produtos e carrinho
  O carrinho fica guardado apenas na aba do navegador.
  Os pedidos não são armazenados e produtos, preços e cupons são fixos.

  @ui
  Cenário: A loja lista os 8 produtos com nome e preço corretos
    Dado que estou na Verzel Store
    Então vejo 8 produtos
    E "Camiseta Essencial" custa R$ 59,90
    E "Jaqueta Corta-Vento" custa R$ 229,90

  @ui
  Cenário: Adicionar o mesmo produto duas vezes gera uma única linha
    Dado que estou na Verzel Store com o carrinho vazio
    Quando adiciono 1 "Camiseta Essencial" ao carrinho
    E adiciono 1 "Camiseta Essencial" ao carrinho
    Então o carrinho tem uma linha "Camiseta Essencial" com quantidade 2
    E o subtotal é R$ 119,80

  @ui
  Cenário: Adicionar todos os produtos
    Dado que estou na Verzel Store com o carrinho vazio
    Quando adiciono 1 unidade de cada um dos 8 produtos
    Então o subtotal é R$ 849,40
    E o frete é R$ 0,00

  @ui
  Cenário: Remover um item recalcula os totais
    Dado que tenho 1 "Camiseta Essencial" e 1 "Boné Aba Curva" no carrinho
    Quando removo "Boné Aba Curva"
    Então o subtotal é R$ 59,90

  @ui
  Cenário: Carrinho vazio mostra mensagem amigável
    Dado que tenho 1 "Camiseta Essencial" no carrinho
    Quando removo "Camiseta Essencial"
    Então vejo uma mensagem de carrinho vazio
    E não consigo finalizar o pedido

  @ui
  Cenário: O carrinho sobrevive ao recarregar a página na mesma aba
    Dado que tenho 1 "Camiseta Essencial" no carrinho
    Quando recarrego a página
    Então o carrinho continua com 1 "Camiseta Essencial"

  @ui
  Cenário: Outra aba começa com o carrinho vazio (comportamento esperado)
    Dado que tenho 1 "Camiseta Essencial" no carrinho
    Quando abro a loja em outra aba
    Então o carrinho está vazio
