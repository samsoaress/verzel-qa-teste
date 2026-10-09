# language: pt
@quantidade
Funcionalidade: Limite de quantidade por produto
  Cada produto pode ter no máximo 5 unidades por pedido.
  A regra vale para a interface e para a API.

  Contexto:
    Dado que estou na Verzel Store com o carrinho vazio

  @CA10 @ui
  Cenário: Exatamente 5 unidades são aceitas
    Quando adiciono 5 "Garrafa Térmica 750ml" ao carrinho
    Então o subtotal é R$ 250,00
    E o frete é R$ 0,00

  @CA10 @ui
  Cenário: Não é possível chegar a 6 unidades pelo botão de aumentar
    Dado que tenho 5 "Garrafa Térmica 750ml" no carrinho
    Quando clico em aumentar a quantidade
    Então a quantidade continua 5
    E a loja bloqueia ou informa o limite

  @CA10 @ui
  Cenário: Não é possível chegar a 6 unidades digitando a quantidade
    Dado que tenho 1 "Garrafa Térmica 750ml" no carrinho
    Quando digito 6 no campo de quantidade
    Então a quantidade não fica em 6
    E a loja bloqueia ou informa o limite

  @CA10 @ui @ambiguidade
  Cenário: Adicionar o mesmo produto várias vezes pela lista não passa de 5
    Quando clico 6 vezes em adicionar "Garrafa Térmica 750ml"
    Então a quantidade no carrinho não passa de 5
    # Interpretação adotada: o limite vale para a soma das adições

  @CA10 @ui
  Cenário: O limite vale por produto, não pelo carrinho
    Quando adiciono 5 "Garrafa Térmica 750ml" ao carrinho
    E adiciono 5 "Boné Aba Curva" ao carrinho
    Então o subtotal é R$ 499,50

  @ui
  Esquema do Cenário: Valores inválidos no campo de quantidade
    Dado que tenho 1 "Garrafa Térmica 750ml" no carrinho
    Quando digito "<valor>" no campo de quantidade
    Então a loja não aceita o valor em silêncio

    Exemplos:
      | valor |
      | 0     |
      | -1    |
      | 1,5   |
      | abc   |
      | 99    |

  @ui
  Cenário: Reduzir abaixo de 1 unidade
    Dado que tenho 1 "Garrafa Térmica 750ml" no carrinho
    Quando clico em diminuir a quantidade
    Então o item é removido ou a quantidade permanece 1
    E a quantidade nunca fica 0 ou negativa

  @CA10 @api
  Cenário: API aceita quantidade 5
    Quando calculo pela API o produto "P008" com quantidade 5
    Então a resposta tem status 200

  @CA10 @api
  Esquema do Cenário: API rejeita quantidade acima do máximo
    Quando calculo pela API o produto "P008" com quantidade <qtd>
    Então a resposta tem status 422
    E o código do erro é "QUANTIDADE_MAXIMA_EXCEDIDA"

    Exemplos:
      | qtd |
      | 6   |
      | 10  |
      | 100 |

  @api
  Esquema do Cenário: API rejeita quantidade inválida
    Quando calculo pela API o produto "P001" com quantidade <qtd>
    Então a resposta tem status 422
    E o código do erro é "QUANTIDADE_INVALIDA"

    Exemplos:
      | qtd  |
      | 0    |
      | -1   |
      | 1.5  |
      | "2"  |
      | null |

  @api
  Cenário: API rejeita o mesmo produto repetido na lista
    Quando calculo pela API os itens "P001" com quantidade 1 e "P001" com quantidade 2
    Então a resposta tem status 422
    E o código do erro é "ITEM_DUPLICADO"
