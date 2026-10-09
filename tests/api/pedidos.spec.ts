import { test, expect } from '@playwright/test';
import { CLIENTE, criarPedido, esperarErro, postCru } from './helpers';

const ITENS = [{ produtoId: 'P005', quantidade: 1 }];

test.describe('POST /api/pedidos: sucesso', () => {
  test('API-34 pedido válido com cupom: 201, número VZ-000000 e valores corretos', async ({ request }) => {
    const res = await criarPedido(request, ITENS, { cupom: 'BEMVINDO10' });
    expect(res.status()).toBe(201);
    const b = await res.json();
    expect(b.numero).toMatch(/^VZ-\d{6}$/);
    expect(b.criadoEm).toBeTruthy();
    expect(b.subtotal).toBe(100);
    expect(b.desconto).toBe(10);
    expect(b.frete).toBe(19.9);
    expect(b.freteGratis).toBe(false);
    expect(b.valorFaltanteFreteGratis).toBe(100);
    expect(b.total).toBe(109.9);
    expect(b.cupom).toMatchObject({ codigo: 'BEMVINDO10', aplicado: true });
    expect(b.cliente).toMatchObject({ nome: 'Maria Silva', email: 'maria@exemplo.com' });
  });

  test('API-34b CEP é devolvido normalizado (sem hífen)', async ({ request }) => {
    const res = await criarPedido(request, ITENS);
    const b = await res.json();
    expect(b.cliente.cep).toBe('01310100');
  });

  test('API-35 pedido sem cupom: total sem desconto', async ({ request }) => {
    const res = await criarPedido(request, ITENS);
    expect(res.status()).toBe(201);
    const b = await res.json();
    expect(b.desconto).toBe(0);
    expect(b.total).toBe(119.9);
  });

  test('API-41 CEP sem hífen é aceito', async ({ request }) => {
    const res = await criarPedido(request, ITENS, { cliente: { ...CLIENTE, cep: '01310100' } });
    expect(res.status()).toBe(201);
    expect((await res.json()).cliente.cep).toBe('01310100');
  });

  test('pedido com frete grátis e cupom: valores seguem a regra do CA08', async ({ request }) => {
    const res = await criarPedido(request, [{ produtoId: 'P005', quantidade: 2 }], { cupom: 'BEMVINDO10' });
    expect(res.status()).toBe(201);
    const b = await res.json();
    expect(b.desconto).toBe(20);
    expect(b.frete).toBe(0);
    expect(b.total).toBe(180);
  });

  test('números de pedidos diferentes não precisam ser iguais (formato sempre válido)', async ({ request }) => {
    for (let i = 0; i < 3; i++) {
      const b = await (await criarPedido(request, ITENS)).json();
      expect(b.numero).toMatch(/^VZ-\d{6}$/);
    }
  });
});

test.describe('POST /api/pedidos: cupom', () => {
  test('API-36 cupom inexistente retorna 422 CUPOM_INVALIDO', async ({ request }) => {
    await esperarErro(await criarPedido(request, ITENS, { cupom: 'NAOEXISTE' }), 422, 'CUPOM_INVALIDO');
  });

  test('API-37 cupom expirado retorna 422 CUPOM_EXPIRADO', async ({ request }) => {
    await esperarErro(await criarPedido(request, ITENS, { cupom: 'VERAO2026' }), 422, 'CUPOM_EXPIRADO');
  });

  test('cupom em minúsculas e com espaços é aceito no pedido (CA02)', async ({ request }) => {
    const res = await criarPedido(request, ITENS, { cupom: '  bemvindo10 ' });
    expect(res.status()).toBe(201);
    expect((await res.json()).desconto).toBe(10);
  });
});

test.describe('POST /api/pedidos: dados do cliente', () => {
  const INVALIDOS: { id: string; nome: string; cliente: Record<string, string> }[] = [
    { id: 'API-38a', nome: 'nome sem sobrenome', cliente: { ...CLIENTE, nome: 'Maria' } },
    { id: 'API-38b', nome: 'nome vazio', cliente: { ...CLIENTE, nome: '' } },
    { id: 'API-38c', nome: 'nome só com espaços', cliente: { ...CLIENTE, nome: '   ' } },
    { id: 'API-39a', nome: 'e-mail "maria@"', cliente: { ...CLIENTE, email: 'maria@' } },
    { id: 'API-39b', nome: 'e-mail "maria.com"', cliente: { ...CLIENTE, email: 'maria.com' } },
    { id: 'API-39c', nome: 'e-mail "@exemplo.com"', cliente: { ...CLIENTE, email: '@exemplo.com' } },
    { id: 'API-39d', nome: 'e-mail com espaço', cliente: { ...CLIENTE, email: 'maria @exemplo.com' } },
    { id: 'API-40a', nome: 'CEP com 7 dígitos', cliente: { ...CLIENTE, cep: '0131010' } },
    { id: 'API-40b', nome: 'CEP com 9 dígitos', cliente: { ...CLIENTE, cep: '013101000' } },
    { id: 'API-40c', nome: 'CEP com letras', cliente: { ...CLIENTE, cep: 'abcde-fgh' } },
    { id: 'API-40d', nome: 'CEP vazio', cliente: { ...CLIENTE, cep: '' } },
  ];
  for (const c of INVALIDOS) {
    test(`${c.id} ${c.nome} retorna 422 DADOS_INVALIDOS`, async ({ request }) => {
      await esperarErro(await criarPedido(request, ITENS, { cliente: c.cliente }), 422, 'DADOS_INVALIDOS');
    });
  }

  test('API-42 vários dados inválidos: os detalhes listam todos os campos', async ({ request }) => {
    const res = await criarPedido(request, ITENS, { cliente: { nome: 'Maria', email: 'x', cep: '1' } });
    await esperarErro(res, 422, 'DADOS_INVALIDOS');
    const texto = JSON.stringify(await res.json());
    expect(texto, 'detalhes devem vir em "campos"').toContain('campos');
    for (const campo of ['nome', 'email', 'cep']) {
      expect.soft(texto, `campo "${campo}" deveria aparecer nos detalhes`).toContain(campo);
    }
  });

  test('API-43 cliente ausente (registra o comportamento)', async ({ request }) => {
    const res = await request.post('/api/pedidos', { data: { itens: ITENS } });
    test.info().annotations.push({ type: 'observado', description: `HTTP ${res.status()}: ${(await res.text()).slice(0, 300)}` });
    expect(res.status()).toBe(422);
  });
});

test.describe('POST /api/pedidos: itens', () => {
  test('API-44 quantidade 6 retorna 422 QUANTIDADE_MAXIMA_EXCEDIDA', async ({ request }) => {
    await esperarErro(await criarPedido(request, [{ produtoId: 'P008', quantidade: 6 }]), 422, 'QUANTIDADE_MAXIMA_EXCEDIDA');
  });

  test('API-45 itens vazio retorna 422 ITENS_OBRIGATORIOS', async ({ request }) => {
    await esperarErro(await criarPedido(request, []), 422, 'ITENS_OBRIGATORIOS');
  });

  test('produto duplicado retorna 422 ITEM_DUPLICADO', async ({ request }) => {
    const itens = [{ produtoId: 'P001', quantidade: 1 }, { produtoId: 'P001', quantidade: 1 }];
    await esperarErro(await criarPedido(request, itens), 422, 'ITEM_DUPLICADO');
  });

  test('produto inexistente retorna 422 PRODUTO_NAO_ENCONTRADO', async ({ request }) => {
    await esperarErro(await criarPedido(request, [{ produtoId: 'P999', quantidade: 1 }]), 422, 'PRODUTO_NAO_ENCONTRADO');
  });

  test('JSON inválido retorna 400 JSON_INVALIDO', async ({ request }) => {
    await esperarErro(await postCru(request, '/api/pedidos', '{abc'), 400, 'JSON_INVALIDO');
  });

  test('API-46 erros combinados (registra qual vem primeiro)', async ({ request }) => {
    const res = await criarPedido(request, [{ produtoId: 'P008', quantidade: 6 }], { cliente: { nome: 'Maria', email: 'x', cep: '1' } });
    test.info().annotations.push({ type: 'observado', description: `HTTP ${res.status()}: ${(await res.text()).slice(0, 300)}` });
    expect(res.status()).toBe(422);
  });

  test('GET em /api/pedidos retorna 405 (não existe consulta de pedidos)', async ({ request }) => {
    await esperarErro(await request.get('/api/pedidos'), 405, 'METODO_NAO_PERMITIDO');
  });
});
