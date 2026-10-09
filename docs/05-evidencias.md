# 05. Evidências da execução

Este documento reúne as evidências. Os arquivos ficam em:

- `evidencias/ui/`: prints e gravações da loja (`CT-B1a-falhou.png`, `BUG-001.png`)
- `evidencias/api/`: prints do Postman e saídas do curl (`API-08.png`, `BUG-003-resposta.json`)
- `../playwright-report/`: relatório HTML da automação (não vai para o Git; copie para `evidencias/automacao/` se quiser entregá-lo)

## Convenção de nomes

| Tipo | Padrão | Exemplo |
|---|---|---|
| Caso que passou | `CT-xx-passou.png` | `CT-A1-passou.png` |
| Caso que falhou | `CT-xx-falhou.png` | `CT-B1a-falhou.png` |
| Bug | `BUG-00X.png` (ou `.gif`/`.mp4`) | `BUG-001.png` |
| API | `API-xx.png` | `API-08.png` |

## Como incluir uma imagem neste documento

```markdown
![CT-B1a: frete cobrado em R$ 200,00](evidencias/ui/CT-B1a-falhou.png)
```

## Índice de evidências

| Caso / Bug | O que mostra | Arquivo | Resultado |
|---|---|---|---|
| | *(preencha conforme tirar os prints)* | | |

---

## Evidências de UI

<!-- Para cada evidência: título, o que foi feito, imagem. Exemplo:

### CT-B1a: Limite exato de R$ 200,00
Adicionadas 2 unidades de Mochila Urbana 20L. Esperado: frete R$ 0,00. Obtido: ...

![CT-B1a](evidencias/ui/CT-B1a-falhou.png)
-->

## Evidências de API

<!-- Exemplo:

### API-08: Limite exato de R$ 200,00
Requisição e resposta no Postman.

![API-08](evidencias/api/API-08.png)
-->

## Automação

<!-- Cole aqui um print do relatório do Playwright (`npm run report`) e cite quais testes falharam por causa de bugs. -->
