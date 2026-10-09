import { test, expect } from '@playwright/test';
import { LojaPage, SEL } from './pages/loja.page';

/**
 * Testes de interface: carrinho, cupom, frete e checkout.
 * Seletores em pages/loja.page.ts (resumo do pedido confirmado pelo snapshot real da loja).
 * O limite de 5 unidades também é testado na listagem, em produtos.spec.ts.
 */
test.describe('Cupom de desconto', () => {
  let loja: LojaPage;

  test.beforeEach(async ({ page }) => {
    loja = new LojaPage(page);
    await loja.abrir();
    await loja.adicionar('Mochila Urbana 20L');
    await loja.abrirCarrinho();
  });

  test('CT-A1 [CA01] BEMVINDO10 aplica 10% sobre o subtotal', async () => {
    await loja.aplicarCupom('BEMVINDO10');
    await loja.esperarLinha('Subtotal', 100);
    await loja.esperarLinha('Desconto', 10);
    await loja.esperarLinha('Frete', 19.9);
    await loja.esperarLinha('Total', 109.9);
  });

  for (const codigo of ['bemvindo10', 'BemVindo10', '  BEMVINDO10', 'BEMVINDO10  ', ' BEMVINDO10']) {
    test(`CT-A2 [CA02] aceita o cupom "${codigo}"`, async () => {
      await loja.aplicarCupom(codigo);
      await loja.esperarLinha('Desconto', 10);
      await loja.esperarLinha('Total', 109.9);
    });
  }

  test('CT-A3 [CA03] cupom inexistente mostra "Cupom inválido." e não aplica desconto', async ({ page }) => {
    await loja.aplicarCupom('NAOEXISTE');
    await expect(page.getByText('Cupom inválido.')).toBeVisible();
    await loja.esperarLinha('Total', 119.9);
  });

  test('CT-A4 [CA04] cupom expirado mostra "Cupom expirado." e não aplica desconto', async ({ page }) => {
    await loja.aplicarCupom('VERAO2026');
    await expect(page.getByText('Cupom expirado.')).toBeVisible();
    await loja.esperarLinha('Total', 119.9);
  });

  test('CT-A5 [CA05] com cupom aplicado o campo some e só resta "Remover cupom"', async ({ page }) => {
    await loja.aplicarCupom('BEMVINDO10');
    await expect(page.getByText(/Cupom\s+BEMVINDO10\s+aplicado/)).toBeVisible();
    await expect(page.getByRole('button', { name: SEL.cupomRemover })).toBeVisible();
    // Não dá para aplicar um segundo cupom sem remover o atual.
    await expect(loja.cupomCampo()).toBeHidden();
  });

  test('CT-020 remover o cupom devolve o total sem desconto', async () => {
    await loja.aplicarCupom('BEMVINDO10');
    await loja.esperarLinha('Total', 109.9);
    await loja.removerCupom();
    await loja.esperarLinha('Total', 119.9);
  });

  test('CT-A7 aplicar com o campo vazio não quebra a tela (registra o comportamento)', async ({ page }) => {
    await page.getByRole('button', { name: SEL.cupomAplicar }).click();
    await loja.esperarLinha('Total', 119.9);
    await expect(page.getByRole('button', { name: SEL.cupomAplicar })).toBeVisible();
  });
});

test.describe('Frete grátis', () => {
  let loja: LojaPage;

  test.beforeEach(async ({ page }) => {
    loja = new LojaPage(page);
    await loja.abrir();
  });

  test('CT-B1a [CA06] subtotal exato de R$ 200,00 tem frete grátis', { annotation: { type: 'bug', description: 'Candidato a BUG-001: frete cobrado com subtotal exato de R$ 200,00 (CA06)' } }, async () => {
    await loja.adicionar('Mochila Urbana 20L', 2);
    await loja.abrirCarrinho();
    await loja.esperarLinha('Subtotal', 200);
    await loja.esperarFreteGratis();
    await loja.esperarLinha('Total', 200);
  });

  test('CT-B1b [CA06] R$ 200,00 formado por 4 Garrafas', { annotation: { type: 'bug', description: 'Candidato a BUG-001: frete cobrado com subtotal exato de R$ 200,00 (CA06)' } }, async () => {
    await loja.adicionar('Garrafa Térmica 750ml', 4);
    await loja.abrirCarrinho();
    await loja.esperarLinha('Subtotal', 200);
    await loja.esperarFreteGratis();
  });

  test('CT-B2 [CA07] R$ 199,80 cobra frete e informa faltante de R$ 0,20', async () => {
    await loja.adicionar('Camiseta Essencial');
    await loja.adicionar('Calça Jeans Slim');
    await loja.abrirCarrinho();
    await loja.esperarLinha('Subtotal', 199.8);
    await loja.esperarLinha('Frete', 19.9);
    await loja.esperarFaltante(0.2);
    await loja.esperarLinha('Total', 219.7);
  });

  test('CT-B3 [CA07] R$ 100,00 informa que faltam R$ 100,00', async () => {
    await loja.adicionar('Mochila Urbana 20L');
    await loja.abrirCarrinho();
    await loja.esperarLinha('Frete', 19.9);
    await loja.esperarFaltante(100);
  });

  test('CT-B4 [CA08] frete grátis considera o subtotal antes do cupom', { annotation: { type: 'bug', description: 'Candidato a BUG-001: frete cobrado com subtotal exato de R$ 200,00 (CA06)' } }, async () => {
    await loja.adicionar('Mochila Urbana 20L', 2);
    await loja.abrirCarrinho();
    await loja.aplicarCupom('BEMVINDO10');
    await loja.esperarLinha('Desconto', 20);
    await loja.esperarFreteGratis();
    await loja.esperarLinha('Total', 180);
  });

  test('CT-B9 [CA08] subtotal acima de R$ 200 que cai abaixo com o cupom mantém frete grátis', async () => {
    // Tênis (189,90) + Meias (29,90) = 219,80; com 10% o valor pago fica abaixo de 200, mas o frete usa o subtotal ANTES do cupom.
    await loja.adicionar('Tênis Casual Urbano');
    await loja.adicionar('Kit 3 Pares de Meias');
    await loja.abrirCarrinho();
    await loja.aplicarCupom('BEMVINDO10');
    await loja.esperarLinha('Subtotal', 219.8);
    await loja.esperarLinha('Desconto', 21.98);
    await loja.esperarFreteGratis();
    await loja.esperarLinha('Total', 197.82);
  });

  test('CT-B5 [CA09] desconto não incide sobre o frete', async () => {
    await loja.adicionar('Camiseta Essencial');
    await loja.adicionar('Calça Jeans Slim');
    await loja.abrirCarrinho();
    await loja.aplicarCupom('BEMVINDO10');
    await loja.esperarLinha('Desconto', 19.98);
    await loja.esperarLinha('Frete', 19.9);
    await loja.esperarLinha('Total', 199.72);
  });

  test('CT-B6 [CA06] Jaqueta (R$ 229,90) tem frete grátis', async () => {
    await loja.adicionar('Jaqueta Corta-Vento');
    await loja.abrirCarrinho();
    await loja.esperarFreteGratis();
    await loja.esperarLinha('Total', 229.9);
  });

  test('CT-D1 [CA11] 3 Camisetas com cupom: total R$ 181,63', async () => {
    await loja.adicionar('Camiseta Essencial', 3);
    await loja.abrirCarrinho();
    await loja.aplicarCupom('BEMVINDO10');
    await loja.esperarLinha('Desconto', 17.97);
    await loja.esperarLinha('Total', 181.63);
  });
});

test.describe('Carrinho', () => {
  let loja: LojaPage;

  test.beforeEach(async ({ page }) => {
    loja = new LojaPage(page);
    await loja.abrir();
  });

  test('CT-014 o contador do cabeçalho soma as unidades', async () => {
    await loja.esperarContador(0);
    await loja.adicionar('Camiseta Essencial', 2);
    await loja.adicionar('Boné Aba Curva');
    await loja.esperarContador(3);
  });

  test('CT-017 remover um item recalcula o subtotal', async () => {
    await loja.adicionar('Camiseta Essencial');
    await loja.adicionar('Boné Aba Curva');
    await loja.abrirCarrinho();
    await loja.removerItem('Boné Aba Curva').click();
    await expect(loja.removerItem('Boné Aba Curva')).toHaveCount(0);
    await loja.esperarLinha('Subtotal', 59.9);
    await loja.esperarContador(1);
  });

  test('CT-018 esvaziar o carrinho mostra o estado vazio', async ({ page }) => {
    await loja.adicionar('Camiseta Essencial');
    await loja.abrirCarrinho();
    await loja.removerItem('Camiseta Essencial').click();
    await expect(page.getByText(SEL.carrinhoVazio)).toBeVisible();
    await expect(page.getByRole('link', { name: SEL.verProdutos })).toBeVisible();
    await loja.esperarContador(0);
  });

  test('CT-022 "Ver produtos" volta para a listagem', async ({ page }) => {
    await loja.abrirCarrinho();
    await page.getByRole('link', { name: SEL.verProdutos }).click();
    await expect(loja.cards()).toHaveCount(8);
  });

  test('CT-023 o carrinho sobrevive ao recarregar a página (F5)', async ({ page }) => {
    await loja.adicionar('Camiseta Essencial');
    await loja.abrirCarrinho();
    await page.reload();
    await loja.esperarContador(1);
    await expect(loja.removerItem('Camiseta Essencial')).toBeVisible();
  });

  test('CT-024 outra aba começa com o carrinho vazio (comportamento esperado)', async ({ context }) => {
    await loja.adicionar('Camiseta Essencial');
    await loja.esperarContador(1);
    const outra = await context.newPage();
    await outra.goto('/');
    await expect(outra.getByRole('link', { name: SEL.carrinho })).toHaveAccessibleName(/Carrinho 0 itens? no carrinho/);
  });

  test('CT-028 links "Documentação" e "Produtos" do menu funcionam', async ({ page }) => {
    await page.getByRole('link', { name: 'Documentação', exact: true }).click();
    await expect(page).toHaveURL(/documentacao/);
    await page.getByRole('link', { name: 'Produtos', exact: true }).click();
    await expect(loja.cards()).toHaveCount(8);
  });
});

test.describe('Checkout', () => {
  let loja: LojaPage;

  test.beforeEach(async ({ page }) => {
    loja = new LojaPage(page);
    await loja.abrir();
    await loja.adicionar('Mochila Urbana 20L');
    await loja.abrirCarrinho();
  });

  test('CT-E1 pedido válido sem cupom gera número VZ-000000', async ({ page }) => {
    await loja.irParaCheckout();
    await loja.preencherCheckout({ nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '01310-100' });
    await loja.confirmarPedido();
    await expect(page.getByText(/VZ-\d{6}/)).toBeVisible();
    await expect(page.getByText(/119,90/).first()).toBeVisible();
  });

  test('CT-E2 pedido válido com cupom mantém desconto, frete e total', async ({ page }) => {
    await loja.aplicarCupom('BEMVINDO10');
    await loja.irParaCheckout();
    await loja.preencherCheckout({ nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '01310-100' });
    await loja.confirmarPedido();
    await expect(page.getByText(/VZ-\d{6}/)).toBeVisible();
    await expect(page.getByText(/109,90/).first()).toBeVisible();
  });

  test('CT-E8 CEP sem hífen é aceito', async ({ page }) => {
    await loja.irParaCheckout();
    await loja.preencherCheckout({ nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '01310100' });
    await loja.confirmarPedido();
    await expect(page.getByText(/VZ-\d{6}/)).toBeVisible();
  });

  test('CT-E3 nome sem sobrenome é rejeitado', async ({ page }) => {
    await loja.irParaCheckout();
    await loja.preencherCheckout({ nome: 'Maria', email: 'maria@exemplo.com', cep: '01310-100' });
    await loja.confirmarPedido();
    await expect(page.getByText(/VZ-\d{6}/)).toHaveCount(0);
    await expect(page.getByText(/sobrenome/i).first()).toBeVisible(); // [PALPITE] texto da mensagem
  });

  for (const email of ['maria@', 'maria.com', '@exemplo.com']) {
    test(`CT-E6 e-mail "${email}" é rejeitado`, async ({ page }) => {
      await loja.irParaCheckout();
      await loja.preencherCheckout({ nome: 'Maria Silva', email, cep: '01310-100' });
      await loja.confirmarPedido();
      await expect(page.getByText(/VZ-\d{6}/)).toHaveCount(0);
    });
  }

  for (const cep of ['0131010', '013101000', 'abcde-fgh']) {
    test(`CT-E9 CEP "${cep}" é rejeitado`, async ({ page }) => {
      await loja.irParaCheckout();
      await loja.preencherCheckout({ nome: 'Maria Silva', email: 'maria@exemplo.com', cep });
      await loja.confirmarPedido();
      await expect(page.getByText(/VZ-\d{6}/)).toHaveCount(0);
    });
  }

  test('CT-E10 formulário vazio não confirma o pedido e mantém o checkout', async ({ page }) => {
    await loja.irParaCheckout();
    await loja.confirmarPedido();
    await expect(page.getByText(/VZ-\d{6}/)).toHaveCount(0);
    await expect(page.getByRole('link', { name: SEL.voltarAoCarrinho })).toBeVisible();
  });

  test('CT-E11 não existe etapa de pagamento online', async ({ page }) => {
    await loja.irParaCheckout();
    await expect(page.getByText(/cart[aã]o de cr[eé]dito|n[úu]mero do cart[aã]o|pix|boleto/i)).toHaveCount(0);
  });

  test('"Voltar ao carrinho" mantém os itens', async ({ page }) => {
    await loja.irParaCheckout();
    await page.getByRole('link', { name: SEL.voltarAoCarrinho }).click();
    await expect(loja.removerItem('Mochila Urbana 20L')).toBeVisible();
  });
});

test.describe('Quantidade no carrinho', () => {
  let loja: LojaPage;

  test.beforeEach(async ({ page }) => {
    loja = new LojaPage(page);
    await loja.abrir();
  });

  test('CT-004 aumentar e diminuir atualiza quantidade e totais', async () => {
    await loja.adicionar('Mochila Urbana 20L');
    await loja.abrirCarrinho();
    await expect(loja.quantidade('Mochila Urbana 20L')).toHaveText('1');
    await loja.aumentar('Mochila Urbana 20L').click();
    await expect(loja.quantidade('Mochila Urbana 20L')).toHaveText('2');
    await loja.esperarLinha('Subtotal', 200);
    await loja.diminuir('Mochila Urbana 20L').click();
    await expect(loja.quantidade('Mochila Urbana 20L')).toHaveText('1');
    await loja.esperarLinha('Subtotal', 100);
    await loja.esperarLinha('Frete', 19.9);
    await loja.esperarContador(1);
  });

  test('CT-A6 [CA01] o desconto do cupom é recalculado ao mudar a quantidade', async () => {
    await loja.adicionar('Mochila Urbana 20L');
    await loja.abrirCarrinho();
    await loja.aplicarCupom('BEMVINDO10');
    await loja.esperarLinha('Desconto', 10);
    await loja.aumentar('Mochila Urbana 20L').click();
    await loja.esperarLinha('Subtotal', 200);
    await loja.esperarLinha('Desconto', 20);
    // O frete e o total em R$ 200,00 são verificados em CT-B1a e CT-B4 (CA06/CA08).
  });

  test('CT-C4 com 1 unidade o botão de diminuir fica desabilitado', async () => {
    await loja.adicionar('Mochila Urbana 20L');
    await loja.abrirCarrinho();
    await expect(loja.diminuir('Mochila Urbana 20L')).toBeDisabled();
    await expect(loja.quantidade('Mochila Urbana 20L')).toHaveText('1');
  });

  test('CT-C2a [CA10] pelo botão + a quantidade para em 5', async () => {
    await loja.adicionar('Garrafa Térmica 750ml');
    await loja.abrirCarrinho();
    for (let i = 0; i < 4; i++) await loja.aumentar('Garrafa Térmica 750ml').click();
    await expect(loja.quantidade('Garrafa Térmica 750ml')).toHaveText('5');
    await loja.esperarLinha('Subtotal', 250);

    // 6ª unidade: o botão deve estar desabilitado (ou o clique ser ignorado).
    const mais = loja.aumentar('Garrafa Térmica 750ml');
    if (await mais.isEnabled()) await mais.click();
    await expect(loja.quantidade('Garrafa Térmica 750ml')).toHaveText('5');
    await loja.esperarLinha('Subtotal', 250);
  });

  test('CT-C2a [CA10] vindo da listagem com 5 unidades, o botão + não passa de 5', async () => {
    await loja.adicionar('Garrafa Térmica 750ml', 5);
    await loja.abrirCarrinho();
    const mais = loja.aumentar('Garrafa Térmica 750ml');
    if (await mais.isEnabled()) await mais.click();
    await expect(loja.quantidade('Garrafa Térmica 750ml')).toHaveText('5');
  });

  test('"Esvaziar carrinho" remove todos os itens', async ({ page }) => {
    await loja.adicionar('Camiseta Essencial');
    await loja.adicionar('Boné Aba Curva', 2);
    await loja.abrirCarrinho();
    await loja.esvaziar().click();
    await expect(page.getByText(SEL.carrinhoVazio)).toBeVisible();
    await loja.esperarContador(0);
  });
});