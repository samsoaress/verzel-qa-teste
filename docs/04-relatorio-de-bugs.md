# 04. Relatório de bugs

Um bug por seção. Os IDs seguem a ordem de descoberta (`BUG-001`, `BUG-002`...). Evidências ficam em `evidencias/ui/` e `evidencias/api/`.

## Índice

| ID | Título | Severidade | Prioridade | CA | Camada | Caso | Status |
|---|---|---|---|---|---|---|---|
| | *(nenhum bug registrado ainda: preencha conforme encontrar)* | | | | | | |

## Critérios de classificação

| Severidade | Significado |
|---|---|
| **Crítica** | Impede o fluxo principal (ex.: não consegue confirmar pedido) ou gera valor financeiro muito errado |
| **Alta** | Viola um critério de aceite com impacto no valor pago (ex.: frete cobrado indevidamente) |
| **Média** | Comportamento incorreto com contorno ou impacto limitado (ex.: mensagem errada, cupom não recalcula) |
| **Baixa** | Visual, texto ou usabilidade sem impacto no valor |

**Prioridade** indica a urgência de correção e pode diferir da severidade.

## Modelo de report

Copie o bloco abaixo para cada bug novo.

```markdown
## BUG-00X: <título que descreve o problema>

- **Severidade:** Alta | **Prioridade:** Alta
- **Critério violado:** CAxx
- **Camada:** UI / API / UI e API
- **Caso relacionado:** CT-xx / API-xx
- **Ambiente:** Chrome xxx, Windows/macOS, data
- **Pré-condição:** carrinho vazio

### Passos para reproduzir
1. ...
2. ...

### Resultado esperado
...

### Resultado obtido
...

### Evidências
- evidencias/ui/BUG-00X.png
- Requisição e resposta JSON (se for de API)

### Observações
Reprodutível X/X vezes. Acontece só na UI / só na API / nos dois.
```

---

## Bugs encontrados

<!-- Adicione os bugs abaixo, um por seção. -->
