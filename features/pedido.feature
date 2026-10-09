# language: pt
@pedido
Funcionalidade: Confirmação do pedido
  O pagamento é feito na entrega. Não existe etapa de pagamento online.
  O nome precisa de nome e sobrenome, o e-mail de formato válido e o CEP de 8 dígitos.

  Contexto:
    Dado que estou na Verzel Store com o carrinho vazio
    E que adiciono 1 "Mochila Urbana 20L" ao carrinho

  @ui @api
  Cenário: Pedido válido sem cupom
    Quando finalizo o pedido com nome "Maria Silva", e-mail "maria@exemplo.com" e CEP "01310-100"
    Então vejo um número de pedido no formato "VZ-000000"
    E o total confirmado é R$ 119,90

  @CA01 @ui @api
  Cenário: Pedido válido com cupom mantém desconto, frete e total
    Dado que apliquei o cupom "BEMVINDO10"
    Quando finalizo o pedido com nome "Maria Silva", e-mail "maria@exemplo.com" e CEP "01310-100"
    Então vejo um número de pedido no formato "VZ-000000"
    E o desconto confirmado é R$ 10,00
    E o frete confirmado é R$ 19,90
    E o total confirmado é R$ 109,90

  @ui
  Cenário: O resumo do pedido é igual ao do carrinho
    Dado que apliquei o cupom "BEMVINDO10"
    Quando finalizo o pedido com dados válidos
    Então subtotal, desconto, frete e total da confirmação são iguais aos do carrinho

  @ui
  Cenário: Não existe etapa de pagamento online
    Quando percorro o fluxo até a confirmação do pedido
    Então não é exibida nenhuma etapa de pagamento online

  @ui @api
  Esquema do Cenário: Nomes inválidos são rejeitados
    Quando finalizo o pedido com nome "<nome>", e-mail "maria@exemplo.com" e CEP "01310-100"
    Então o pedido não é confirmado
    E vejo um erro no campo nome

    Exemplos:
      | nome  |
      | Maria |
      |       |

  @ambiguidade
  Cenário: Nome com espaço depois do primeiro nome
    Quando finalizo o pedido com nome "Maria " e e-mail e CEP válidos
    Então registro o comportamento observado
    # Interpretação adotada: sem sobrenome real, portanto rejeitado

  @ui @api
  Esquema do Cenário: E-mails inválidos são rejeitados
    Quando finalizo o pedido com nome "Maria Silva", e-mail "<email>" e CEP "01310-100"
    Então o pedido não é confirmado
    E vejo um erro no campo e-mail

    Exemplos:
      | email           |
      | maria@          |
      | maria.com       |
      | @exemplo.com    |
      | maria@exemplo   |

  @ui @api
  Esquema do Cenário: CEPs válidos são aceitos
    Quando finalizo o pedido com nome "Maria Silva", e-mail "maria@exemplo.com" e CEP "<cep>"
    Então vejo um número de pedido no formato "VZ-000000"

    Exemplos:
      | cep       |
      | 01310-100 |
      | 01310100  |

  @ui @api
  Esquema do Cenário: CEPs inválidos são rejeitados
    Quando finalizo o pedido com nome "Maria Silva", e-mail "maria@exemplo.com" e CEP "<cep>"
    Então o pedido não é confirmado
    E vejo um erro no campo CEP

    Exemplos:
      | cep       |
      | 0131010   |
      | 013101000 |
      | abcde-fgh |

  @ui
  Cenário: Todos os erros aparecem ao enviar o formulário vazio
    Quando finalizo o pedido sem preencher nenhum campo
    Então vejo erros nos campos nome, e-mail e CEP

  @api
  Cenário: API normaliza o CEP removendo o hífen
    Quando confirmo um pedido pela API com o CEP "01310-100"
    Então a resposta tem status 201
    E o CEP devolvido é "01310100"

  @api
  Cenário: API lista todos os campos inválidos em "campos"
    Quando confirmo um pedido pela API com nome "Maria", e-mail "x" e CEP "1"
    Então a resposta tem status 422
    E o código do erro é "DADOS_INVALIDOS"
    E os detalhes em "campos" citam nome, e-mail e CEP
