import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export const CLIENTE = {
  nome: 'Maria Silva',
  email: 'maria@exemplo.com',
  cep: '01310-100',
};

export type Esperado = {
  subtotal: number;
  desconto: number;
  frete: number;
  freteGratis: boolean;
  faltante: number;
  total: number;
};

/** POST /api/carrinho/calcular. O campo cupom só é enviado quando informado. */
export function calcular(request: APIRequestContext, itens: unknown, cupom?: unknown) {
  const data = cupom === undefined ? { itens } : { itens, cupom };
  return request.post('/api/carrinho/calcular', { data });
}

/** POST /api/pedidos com o cliente padrão, a menos que outro seja informado. */
export function criarPedido(
  request: APIRequestContext,
  itens: unknown,
  opcoes: { cupom?: unknown; cliente?: unknown } = {},
) {
  const data: Record<string, unknown> = {
    cliente: 'cliente' in opcoes ? opcoes.cliente : CLIENTE,
    itens,
  };
  if (opcoes.cupom !== undefined) data.cupom = opcoes.cupom;
  return request.post('/api/pedidos', { data });
}

/** Envia um corpo cru (string) para simular JSON malformado. */
export function postCru(request: APIRequestContext, caminho: string, corpo: string) {
  return request.post(caminho, { data: corpo, headers: { 'Content-Type': 'application/json' } });
}

/** Número com no máximo 2 casas decimais (detecta ruído como 179.70000000000002). */
export const duasCasas = (n: number) => /^-?\d+(\.\d{1,2})?$/.test(String(n));

/** Confere status, formato do erro e código, conforme a documentação. */
export async function esperarErro(res: APIResponse, status: number, codigo: string) {
  expect(res.status(), `corpo: ${await res.text()}`).toBe(status);
  expect(res.headers()['content-type'] ?? '').toContain('application/json');
  const body = await res.json();
  expect(body.erro, 'resposta de erro deve ter o objeto "erro"').toBeTruthy();
  expect(body.erro.codigo).toBe(codigo);
  expect(typeof body.erro.mensagem).toBe('string');
  expect(body.erro.mensagem.length).toBeGreaterThan(0);
}

/** Confere os valores monetários e a fórmula total = subtotal - desconto + frete. */
export function conferirValores(b: any, e: Esperado) {
  expect.soft(b.subtotal, 'subtotal').toBe(e.subtotal);
  expect.soft(b.desconto, 'desconto').toBe(e.desconto);
  expect.soft(b.frete, 'frete').toBe(e.frete);
  expect.soft(b.freteGratis, 'freteGratis').toBe(e.freteGratis);
  expect.soft(b.valorFaltanteFreteGratis, 'valorFaltanteFreteGratis').toBe(e.faltante);
  expect.soft(b.total, 'total').toBe(e.total);
  for (const campo of ['subtotal', 'desconto', 'frete', 'valorFaltanteFreteGratis', 'total']) {
    expect.soft(duasCasas(b[campo]), `${campo} com no máximo 2 casas (veio ${b[campo]})`).toBe(true);
  }
}
