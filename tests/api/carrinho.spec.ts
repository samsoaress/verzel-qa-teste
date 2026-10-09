import { test, expect } from '@playwright/test';
import { calcular, conferirValores, duasCasas, esperarErro, postCru, Esperado } from './helpers';

type Cenario = {
  id: string;
  ca: string;
  nome: string;
  itens: { produtoId: string; quantidade: number }[];
  cupom?: string;
  esperado: Esperado;
};

const e = (
  subtotal: number, desconto: number, frete: number, faltante: number, total: number,
): Esperado => ({ subtotal, desconto, frete, freteGratis: frete === 0, faltante, total });

// Valores esperados calculados à mão a partir das regras da documentação (fórmula: total = subtotal - desconto + frete).
const CENARIOS: Cenario[] = [
  { id: 'CT01', ca: 'CA07', nome: 'abaixo de R$ 200 cobra frete fixo', itens: [{ produtoId: 'P005', quantidade: 1 }], esperado: e(100, 0, 19.9, 100, 119.9) },
  { id: 'CT02', ca: 'CA01', nome: 'BEMVINDO10 aplica 10%', itens: [{ produtoId: 'P005', quantidade: 1 }], cupom: 'BEMVINDO10', esperado: e(100, 10, 19.9, 100, 109.9) },
  { id: 'CT03', ca: 'CA06', nome: 'subtotal exato R$ 200,00 (Mochila x2) tem frete grátis', itens: [{ produtoId: 'P005', quantidade: 2 }], esperado: e(200, 0, 0, 0, 200) },
  { id: 'CT04', ca: 'CA06', nome: 'subtotal exato R$ 200,00 (Garrafa x4) tem frete grátis', itens: [{ produtoId: 'P008', quantidade: 4 }], esperado: e(200, 0, 0, 0, 200) },
  { id: 'CT05', ca: 'CA07', nome: 'R$ 199,80 cobra frete e informa faltante de R$ 0,20', itens: [{ produtoId: 'P001', quantidade: 1 }, { produtoId: 'P002', quantidade: 1 }], esperado: e(199.8, 0, 19.9, 0.2, 219.7) },
  { id: 'CT06', ca: 'CA08', nome: 'frete grátis considera subtotal ANTES do cupom', itens: [{ produtoId: 'P005', quantidade: 2 }], cupom: 'BEMVINDO10', esperado: e(200, 20, 0, 0, 180) },
  { id: 'CT07', ca: 'CA09', nome: 'desconto não incide sobre o frete', itens: [{ produtoId: 'P001', quantidade: 1 }, { produtoId: 'P002', quantidade: 1 }], cupom: 'BEMVINDO10', esperado: e(199.8, 19.98, 19.9, 0.2, 199.72) },
  { id: 'CT08', ca: 'CA01', nome: 'exemplo da documentação (Calça + 2 Bonés)', itens: [{ produtoId: 'P002', quantidade: 1 }, { produtoId: 'P004', quantidade: 2 }], cupom: 'BEMVINDO10', esperado: e(239.7, 23.97, 0, 0, 215.73) },
  { id: 'CT09', ca: 'CA11', nome: 'arredondamento: 3 Camisetas com cupom', itens: [{ produtoId: 'P001', quantidade: 3 }], cupom: 'BEMVINDO10', esperado: e(179.7, 17.97, 19.9, 20.3, 181.63) },
  { id: 'CT10', ca: 'CA10', nome: 'limite de 5 unidades (Garrafa x5)', itens: [{ produtoId: 'P008', quantidade: 5 }], esperado: e(250, 0, 0, 0, 250) },
  { id: 'CT11', ca: 'CA06', nome: 'bem acima do limite (Jaqueta)', itens: [{ produtoId: 'P007', quantidade: 1 }], esperado: e(229.9, 0, 0, 0, 229.9) },
  { id: 'CT12', ca: 'CA11', nome: 'arredondamento: 3 Bonés com cupom', itens: [{ produtoId: 'P004', quantidade: 3 }], cupom: 'BEMVINDO10', esperado: e(149.7, 14.97, 19.9, 50.3, 154.63) },
  { id: 'CT13', ca: 'CA11', nome: 'arredondamento: 3 Kits de Meias com cupom', itens: [{ produtoId: 'P006', quantidade: 3 }], cupom: 'BEMVINDO10', esperado: e(89.7, 8.97, 19.9, 110.3, 100.63) },
  { id: 'CT14', ca: 'CA11', nome: 'carrinho misto (Tênis + Meias + Boné) com cupom', itens: [{ produtoId: 'P003', quantidade: 1 }, { produtoId: 'P006', quantidade: 1 }, { produtoId: 'P004', quantidade: 1 }], cupom: 'BEMVINDO10', esperado: e(269.7, 26.97, 0, 0, 242.73) },
];

test.describe('POST /api/carrinho/calcular: valores', () => {
  for (const c of CENARIOS) {
    test(`${c.id} [${c.ca}] ${c.nome}`, async ({ request }) => {
      const res = await calcular(request, c.itens, c.cupom);
      expect(res.status()).toBe(200);
      conferirValores(await res.json(), c.esperado);
    });
  }

  test('API-33 total = subtotal - desconto + frete e soma dos itens = subtotal', async ({ request }) => {
    const res = await calcular(
      request,
      [{ produtoId: 'P003', quantidade: 1 }, { produtoId: 'P006', quantidade: 2 }, { produtoId: 'P004', quantidade: 3 }],
      'BEMVINDO10',
    );
    const b = await res.json();
    const somaItens = Math.round(b.itens.reduce((s: number, i: any) => s + i.total, 0) * 100) / 100;
    expect.soft(somaItens, 'soma dos totais dos itens').toBe(b.subtotal);
    expect.soft(Math.round((b.subtotal - b.desconto + b.frete) * 100) / 100, 'fórmula do total').toBe(b.total);
    for (const i of b.itens) {
      expect.soft(duasCasas(i.total), `total do item ${i.produtoId} (${i.total})`).toBe(true);
      expect.soft(duasCasas(i.precoUnitario)).toBe(true);
    }
  });

  test('estrutura da resposta contém todos os campos documentados', async ({ request }) => {
    const res = await calcular(request, [{ produtoId: 'P005', quantidade: 1 }], 'BEMVINDO10');
    expect(res.headers()['content-type'] ?? '').toContain('application/json');
    const b = await res.json();
    for (const campo of ['itens', 'subtotal', 'desconto', 'frete', 'freteGratis', 'valorFaltanteFreteGratis', 'total', 'cupom']) {
      expect.soft(b, `campo ausente: ${campo}`).toHaveProperty(campo);
    }
    expect(b.cupom).toMatchObject({ codigo: 'BEMVINDO10', aplicado: true });
    expect(b.itens[0]).toMatchObject({ produtoId: 'P005', nome: 'Mochila Urbana 20L', precoUnitario: 100, quantidade: 1, total: 100 });
  });
});

test.describe('POST /api/carrinho/calcular: cupom', () => {
  const VARIACOES = ['BEMVINDO10', 'bemvindo10', 'BemVindo10', '  BEMVINDO10', 'BEMVINDO10  ', '  bemvindo10  '];
  for (const codigo of VARIACOES) {
    test(`CA02 aceita o cupom "${codigo}"`, async ({ request }) => {
      const res = await calcular(request, [{ produtoId: 'P005', quantidade: 1 }], codigo);
      expect(res.status()).toBe(200);
      const b = await res.json();
      expect(b.cupom.aplicado).toBe(true);
      expect(b.desconto).toBe(10);
      expect(b.total).toBe(109.9);
    });
  }

  test('CA03 cupom inexistente: 200, sem desconto e mensagem "Cupom inválido."', async ({ request }) => {
    const res = await calcular(request, [{ produtoId: 'P005', quantidade: 1 }], 'NAOEXISTE');
    expect(res.status()).toBe(200);
    const b = await res.json();
    expect(b.desconto).toBe(0);
    expect(b.total).toBe(119.9);
    expect(b.cupom.aplicado).toBe(false);
    expect(b.cupom.mensagem).toBe('Cupom inválido.');
  });

  test('CA04 cupom expirado: 200, sem desconto e mensagem "Cupom expirado."', async ({ request }) => {
    const res = await calcular(request, [{ produtoId: 'P005', quantidade: 1 }], 'VERAO2026');
    expect(res.status()).toBe(200);
    const b = await res.json();
    expect(b.desconto).toBe(0);
    expect(b.total).toBe(119.9);
    expect(b.cupom.aplicado).toBe(false);
    expect(b.cupom.mensagem).toBe('Cupom expirado.');
  });

  test('CA02 cupom expirado em minúsculas também é reconhecido como expirado', async ({ request }) => {
    const res = await calcular(request, [{ produtoId: 'P005', quantidade: 1 }], ' verao2026 ');
    const b = await res.json();
    expect(b.cupom.mensagem).toBe('Cupom expirado.');
  });

  // Ambiguidades: a documentação não define o resultado. O teste só garante que não há erro 500
  // e registra o comportamento observado como anotação no relatório.
  const AMBIGUOS: [string, unknown][] = [
    ['API-17a cupom null', null],
    ['API-17b cupom string vazia', ''],
    ['API-17c cupom só com espaços', '   '],
    ['API-18a cupom numérico', 123],
    ['API-18b cupom objeto', {}],
    ['CT-A2e cupom com espaço no meio', 'BEM VINDO10'],
  ];
  for (const [nome, cupom] of AMBIGUOS) {
    test(`${nome} (ambiguidade: registra o comportamento)`, async ({ request }) => {
      const res = await calcular(request, [{ produtoId: 'P005', quantidade: 1 }], cupom);
      const texto = await res.text();
      test.info().annotations.push({ type: 'observado', description: `HTTP ${res.status()}: ${texto.slice(0, 300)}` });
      expect(res.status(), 'não deve ser erro de servidor').toBeLessThan(500);
    });
  }
});

test.describe('POST /api/carrinho/calcular: validações', () => {
  const ITEM_OK = { produtoId: 'P001', quantidade: 1 };
  const CASOS_ERRO: { id: string; nome: string; corpo: unknown; status: number; codigo: string }[] = [
    { id: 'API-20', nome: 'itens ausente', corpo: {}, status: 422, codigo: 'ITENS_OBRIGATORIOS' },
    { id: 'API-21', nome: 'itens vazio', corpo: { itens: [] }, status: 422, codigo: 'ITENS_OBRIGATORIOS' },
    { id: 'API-21b', nome: 'itens null', corpo: { itens: null }, status: 422, codigo: 'ITENS_OBRIGATORIOS' },
    { id: 'API-22', nome: 'item é uma string', corpo: { itens: ['P001'] }, status: 422, codigo: 'ITEM_INVALIDO' },
    { id: 'API-23', nome: 'item sem produtoId', corpo: { itens: [{ quantidade: 1 }] }, status: 422, codigo: 'ITEM_INVALIDO' },
    { id: 'API-24', nome: 'produto inexistente', corpo: { itens: [{ produtoId: 'P999', quantidade: 1 }] }, status: 422, codigo: 'PRODUTO_NAO_ENCONTRADO' },
    { id: 'API-25', nome: 'produto duplicado', corpo: { itens: [ITEM_OK, { produtoId: 'P001', quantidade: 2 }] }, status: 422, codigo: 'ITEM_DUPLICADO' },
    { id: 'API-26', nome: 'quantidade 0', corpo: { itens: [{ produtoId: 'P001', quantidade: 0 }] }, status: 422, codigo: 'QUANTIDADE_INVALIDA' },
    { id: 'API-27', nome: 'quantidade -1', corpo: { itens: [{ produtoId: 'P001', quantidade: -1 }] }, status: 422, codigo: 'QUANTIDADE_INVALIDA' },
    { id: 'API-28', nome: 'quantidade 1.5', corpo: { itens: [{ produtoId: 'P001', quantidade: 1.5 }] }, status: 422, codigo: 'QUANTIDADE_INVALIDA' },
    { id: 'API-29', nome: 'quantidade como string "2"', corpo: { itens: [{ produtoId: 'P001', quantidade: '2' }] }, status: 422, codigo: 'QUANTIDADE_INVALIDA' },
    { id: 'API-30', nome: 'quantidade null', corpo: { itens: [{ produtoId: 'P001', quantidade: null }] }, status: 422, codigo: 'QUANTIDADE_INVALIDA' },
    { id: 'API-32', nome: 'quantidade 6 (acima do máximo)', corpo: { itens: [{ produtoId: 'P008', quantidade: 6 }] }, status: 422, codigo: 'QUANTIDADE_MAXIMA_EXCEDIDA' },
    { id: 'API-32b', nome: 'quantidade 100', corpo: { itens: [{ produtoId: 'P008', quantidade: 100 }] }, status: 422, codigo: 'QUANTIDADE_MAXIMA_EXCEDIDA' },
  ];
  for (const c of CASOS_ERRO) {
    test(`${c.id} ${c.nome} retorna ${c.status} ${c.codigo}`, async ({ request }) => {
      const res = await request.post('/api/carrinho/calcular', { data: c.corpo as object });
      await esperarErro(res, c.status, c.codigo);
    });
  }

  test('API-19 corpo que não é JSON retorna 400 JSON_INVALIDO', async ({ request }) => {
    const res = await postCru(request, '/api/carrinho/calcular', '{abc');
    await esperarErro(res, 400, 'JSON_INVALIDO');
  });

  test('API-31 quantidade 5 (limite) é aceita', async ({ request }) => {
    const res = await calcular(request, [{ produtoId: 'P008', quantidade: 5 }]);
    expect(res.status()).toBe(200);
  });

  test('o erro de quantidade indica o campo com problema (itens[0].quantidade)', async ({ request }) => {
    const res = await calcular(request, [{ produtoId: 'P001', quantidade: 0 }]);
    const b = await res.json();
    expect(b.erro.campo).toBe('itens[0].quantidade');
  });

  test('API (extra) GET em /api/carrinho/calcular retorna 405', async ({ request }) => {
    const res = await request.get('/api/carrinho/calcular');
    await esperarErro(res, 405, 'METODO_NAO_PERMITIDO');
  });
});
