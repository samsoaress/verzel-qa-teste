import { test, expect } from '@playwright/test';
import { LojaPage } from './pages/loja.page';

/**
 * Listagem de produtos e botão "Adicionar ao carrinho".
 * Seletores baseados no HTML real: li.produto > article[aria-labelledby="nome-P00X"].
 */
const CATALOGO = [
  { id: 'P001', nome: 'Camiseta Essencial', preco: '59,90' },
  { id: 'P002', nome: 'Calça Jeans Slim', preco: '139,90' },
  { id: 'P003', nome: 'Tênis Casual Urbano', preco: '189,90' },
  { id: 'P004', nome: 'Boné Aba Curva', preco: '49,90' },
  { id: 'P005', nome: 'Mochila Urbana 20L', preco: '100,00' },
  { id: 'P006', nome: 'Kit 3 Pares de Meias', preco: '29,90' },
  { id: 'P007', nome: 'Jaqueta Corta-Vento', preco: '229,90' },
  { id: 'P008', nome: 'Garrafa Térmica 750ml', preco: '50,00' },
];

test.describe('Listagem de produtos', () => {
  let loja: LojaPage;

  test.beforeEach(async ({ page }) => {
    loja = new LojaPage(page);
    await loja.abrir();
  });

  test('CT-006 a loja exibe os 8 produtos', async () => {
    await expect(loja.cards()).toHaveCount(8);
  });

  for (const p of CATALOGO) {
    test(`CT-007 ${p.id} exibe nome e preço R$ ${p.preco}`, async () => {
      const card = loja.cardPorId(p.id);
      await expect(card).toBeVisible();
      await expect(loja.card(p.nome)).toBeVisible();
      await expect(card).toContainText(new RegExp(`R\\$\\s?${p.preco.replace(',', '\\,')}`));
    });
  }

  test('CT-010 cada card tem exatamente um botão "Adicionar ao carrinho"', async () => {
    for (const p of CATALOGO) {
      await expect(loja.botaoAdicionar(p.nome)).toHaveCount(1);
    }
  });

  test('banner informa o frete grátis a partir de R$ 200,00 (CA06)', async ({ page }) => {
    const banner = page.locator('section').filter({ hasText: 'Frete grátis a partir de R$' }).first();
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(/200,00/);
  });
});

test.describe('Adicionar ao carrinho pela listagem', () => {
  let loja: LojaPage;

  test.beforeEach(async ({ page }) => {
    loja = new LojaPage(page);
    await loja.abrir();
  });

  test('CT-012 um clique informa "1 no carrinho"', async () => {
    await loja.adicionar('Mochila Urbana 20L');
    await expect(loja.botaoAdicionar('Mochila Urbana 20L')).toHaveAccessibleDescription(/1 no carrinho/);
  });

  test('CT-012 dois cliques informam "2 no carrinho"', async () => {
    await loja.adicionar('Mochila Urbana 20L', 2);
    await expect(loja.botaoAdicionar('Mochila Urbana 20L')).toHaveAccessibleDescription(/2 no carrinho/);
  });

  test('CT-013 produtos diferentes têm contagens independentes', async () => {
    await loja.adicionar('Camiseta Essencial', 2);
    await loja.adicionar('Boné Aba Curva', 1);
    await expect(loja.botaoAdicionar('Camiseta Essencial')).toHaveAccessibleDescription(/2 no carrinho/);
    await expect(loja.botaoAdicionar('Boné Aba Curva')).toHaveAccessibleDescription(/1 no carrinho/);
  });

  test('CT-C1 chegar a 5 unidades é permitido e então o botão trava', async () => {
    const feitos = await loja.adicionar('Garrafa Térmica 750ml', 5);
    expect(feitos).toBe(5);
    await loja.esperarContador(5);
    // No limite, a loja desabilita o botão e a descrição vira o aviso de limite.
    const botao = loja.botaoAdicionar('Garrafa Térmica 750ml');
    await expect(botao).toBeDisabled();
    await expect(botao).toHaveAccessibleDescription(/Limite de 5 unidades atingido/);
  });

  test('CT-C2c [CA10] a 6ª unidade não entra: o carrinho nunca passa de 5', async () => {
    const feitos = await loja.adicionar('Garrafa Térmica 750ml', 6);
    expect(feitos, 'o botão deve travar depois de 5 cliques').toBe(5);
    await loja.esperarContador(5);
    await expect(loja.botaoAdicionar('Garrafa Térmica 750ml')).toBeDisabled();
    await expect(loja.aviso('P008')).toContainText(/Limite de 5 unidades/);
  });

  test('CT-C2c [CA10] ao atingir o limite a loja avisa ou bloqueia o botão', async () => {
    await loja.adicionar('Garrafa Térmica 750ml', 5);
    const botao = loja.botaoAdicionar('Garrafa Térmica 750ml');
    if (await botao.isEnabled()) {
      await botao.click(); // tentativa de passar do limite
      await expect(loja.aviso('P008')).not.toBeEmpty();
    } else {
      await expect(botao).toBeDisabled();
    }
  });

  test('o limite é por produto: 5 Garrafas e 5 Bonés são aceitos', async () => {
    expect(await loja.adicionar('Garrafa Térmica 750ml', 5)).toBe(5);
    expect(await loja.adicionar('Boné Aba Curva', 5)).toBe(5);
  });
});