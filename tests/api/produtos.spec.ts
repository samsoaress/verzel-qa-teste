import { test, expect } from '@playwright/test';
import { postCru } from './helpers';

const CATALOGO = [
  { id: 'P001', nome: 'Camiseta Essencial', preco: 59.9 },
  { id: 'P002', nome: 'Calça Jeans Slim', preco: 139.9 },
  { id: 'P003', nome: 'Tênis Casual Urbano', preco: 189.9 },
  { id: 'P004', nome: 'Boné Aba Curva', preco: 49.9 },
  { id: 'P005', nome: 'Mochila Urbana 20L', preco: 100 },
  { id: 'P006', nome: 'Kit 3 Pares de Meias', preco: 29.9 },
  { id: 'P007', nome: 'Jaqueta Corta-Vento', preco: 229.9 },
  { id: 'P008', nome: 'Garrafa Térmica 750ml', preco: 50 },
];

test.describe('GET /api/produtos [API-01 a API-05]', () => {
  test('API-01 lista os 8 produtos com os campos da documentação', async ({ request }) => {
    const res = await request.get('/api/produtos');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type'] ?? '').toContain('application/json');
    const lista = await res.json();
    expect(lista).toHaveLength(8);
    for (const p of lista) {
      for (const campo of ['id', 'nome', 'descricao', 'categoria', 'preco']) {
        expect.soft(p, `produto ${p.id} sem o campo ${campo}`).toHaveProperty(campo);
      }
    }
  });

  for (const esperado of CATALOGO) {
    test(`API-02 produto ${esperado.id} tem nome e preço corretos`, async ({ request }) => {
      const res = await request.get(`/api/produtos/${esperado.id}`);
      expect(res.status()).toBe(200);
      const p = await res.json();
      expect(p.nome).toBe(esperado.nome);
      expect(p.preco).toBe(esperado.preco);
    });
  }

  test('API-03 id inexistente retorna 404 PRODUTO_NAO_ENCONTRADO', async ({ request }) => {
    const res = await request.get('/api/produtos/P999');
    expect(res.status()).toBe(404);
    expect((await res.json()).erro.codigo).toBe('PRODUTO_NAO_ENCONTRADO');
  });

  test('API-04 POST em /api/produtos retorna 405 METODO_NAO_PERMITIDO', async ({ request }) => {
    const res = await postCru(request, '/api/produtos', '{}');
    expect(res.status()).toBe(405);
    expect((await res.json()).erro.codigo).toBe('METODO_NAO_PERMITIDO');
  });

  test('API-05 rota inexistente retorna 404 ROTA_NAO_ENCONTRADA', async ({ request }) => {
    const res = await request.get('/api/xyz');
    expect(res.status()).toBe(404);
    expect((await res.json()).erro.codigo).toBe('ROTA_NAO_ENCONTRADA');
  });
});
