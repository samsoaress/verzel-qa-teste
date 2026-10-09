import { Locator, Page, expect } from '@playwright/test';

/**
 * Seletores da loja.
 *
 * CONFIRMADOS pelo codegen e pelo HTML real:
 *   - listagem: li.produto > article[aria-labelledby="nome-P00X"]; botão "Adicionar ao carrinho"
 *     com descrição acessível "N no carrinho"; aviso em #aviso-P00X
 *   - cabeçalho: link "Carrinho N itens no carrinho" (N = total de unidades), links "Produtos" e "Documentação"
 *   - carrinho: botão "Remover <produto> do carrinho", campo "Cupom de desconto", botões
 *     "Aplicar cupom" e "Remover cupom", link "Finalizar compra", carrinho vazio com
 *     "Escolha um produto na vitrine" e link "Ver produtos"
 *   - checkout: campos "Nome completo", "E-mail" e "CEP"; botão "Confirmar pedido"; link "Voltar ao carrinho"
 *
 * Carrinho (snapshot real): região "Resumo do pedido" com pares <dt>/<dd> (Subtotal, "Desconto (CUPOM)",
 * Frete, Total) e o parágrafo "Faltam R$ X para o frete grátis."; botões "Aumentar/Diminuir quantidade de
 * <produto>" (o "-" fica desabilitado em 1), status "Quantidade de <produto>" e botão "Esvaziar carrinho".
 * Com cupom aplicado, o campo de cupom some e aparece "Cupom X aplicado." + "Remover cupom".
 *
 * AINDA NÃO CONFIRMADOS [PALPITE]: as mensagens de erro do checkout e a tela de confirmação do pedido.
 */
export const SEL = {
  adicionar: 'Adicionar ao carrinho',
  carrinho: /^Carrinho/,
  cupomCampo: 'Cupom de desconto',
  cupomAplicar: 'Aplicar cupom',
  cupomRemover: 'Remover cupom',
  finalizarCompra: 'Finalizar compra',
  voltarAoCarrinho: 'Voltar ao carrinho',
  verProdutos: 'Ver produtos',
  carrinhoVazio: 'Escolha um produto na vitrine',
  checkoutNome: 'Nome completo',
  checkoutEmail: 'E-mail',
  checkoutCep: 'CEP',
  confirmarPedido: 'Confirmar pedido',
};

const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const fmt = (n: number) => n.toFixed(2).replace('.', ',');

export class LojaPage {
  constructor(readonly page: Page) { }

  async abrir() {
    await this.page.goto('/');
  }

  // ---------- listagem ----------
  cards(): Locator {
    return this.page.locator('li.produto');
  }

  card(nomeProduto: string): Locator {
    return this.page.getByRole('article', { name: nomeProduto });
  }

  cardPorId(id: string): Locator {
    return this.page.locator(`article[aria-labelledby="nome-${id}"]`);
  }

  aviso(id: string): Locator {
    return this.page.locator(`#aviso-${id}`);
  }

  botaoAdicionar(nomeProduto: string): Locator {
    return this.card(nomeProduto).getByRole('button', { name: SEL.adicionar });
  }

  /** Clica em "Adicionar ao carrinho" até `vezes` vezes; para se o botão ficar desabilitado. */
  async adicionar(nomeProduto: string, vezes = 1): Promise<number> {
    const botao = this.botaoAdicionar(nomeProduto);
    let feitos = 0;
    for (let i = 0; i < vezes; i++) {
      if (!(await botao.isEnabled())) break;
      await botao.click();
      feitos++;
    }
    return feitos;
  }

  // ---------- cabeçalho e carrinho ----------
  linkCarrinho(): Locator {
    return this.page.getByRole('link', { name: SEL.carrinho });
  }

  /** Confere o contador do cabeçalho (total de unidades). */
  async esperarContador(unidades: number) {
    await expect(this.linkCarrinho()).toHaveAccessibleName(new RegExp(`Carrinho ${unidades} itens? no carrinho`));
  }

  async abrirCarrinho() {
    await this.linkCarrinho().click();
    await this.page.waitForLoadState();
  }

  removerItem(nomeProduto: string): Locator {
    return this.page.getByRole('button', { name: new RegExp(`^Remover ${esc(nomeProduto)}`) });
  }

  cupomCampo(): Locator {
    return this.page.getByRole('textbox', { name: SEL.cupomCampo });
  }

  async aplicarCupom(codigo: string) {
    await this.cupomCampo().fill(codigo);
    await this.page.getByRole('button', { name: SEL.cupomAplicar }).click();
  }

  async removerCupom() {
    await this.page.getByRole('button', { name: SEL.cupomRemover }).click();
  }

  // ---------- quantidade no carrinho ----------
  quantidade(nomeProduto: string): Locator {
    return this.page.getByRole('status', { name: `Quantidade de ${nomeProduto}` });
  }

  aumentar(nomeProduto: string): Locator {
    return this.page.getByRole('button', { name: `Aumentar quantidade de ${nomeProduto}` });
  }

  diminuir(nomeProduto: string): Locator {
    return this.page.getByRole('button', { name: `Diminuir quantidade de ${nomeProduto}` });
  }

  esvaziar(): Locator {
    return this.page.getByRole('button', { name: 'Esvaziar carrinho' });
  }

  // ---------- resumo do pedido ----------
resumo(): Locator {
  return this.page.getByRole('region', { name: 'Resumo do pedido' });
}

valorDa(rotulo: string): Locator {
  return this.resumo()
    .locator('dt')
    .filter({ hasText: new RegExp(`^\\s*${esc(rotulo)}`) })
    .locator('xpath=following-sibling::dd[1]');
}

async esperarLinha(rotulo: string, valor: number) {
  await expect(this.valorDa(rotulo)).toHaveText(new RegExp(`^(-\\s*)?R\\$\\s*${esc(fmt(valor))}$`));
}
  /** Frete grátis pode aparecer como "Grátis" ou como "R$ 0,00". */
  async esperarFreteGratis() {
    await expect(this.valorDa('Frete')).toHaveText(/gr[aá]tis|R\$\s*0,00/i);
  }

  /** Confere "Faltam R$ X para o frete grátis." */
  async esperarFaltante(valor: number) {
    await expect(this.resumo()).toContainText(new RegExp(`Faltam\\s+R\\$\\s*${esc(fmt(valor))}`));
  }

  // ---------- checkout ----------
  async irParaCheckout() {
    await this.page.getByRole('link', { name: SEL.finalizarCompra }).click();
  }

  async preencherCheckout(dados: { nome: string; email: string; cep: string }) {
    await this.page.getByRole('textbox', { name: SEL.checkoutNome }).fill(dados.nome);
    await this.page.getByRole('textbox', { name: SEL.checkoutEmail }).fill(dados.email);
    await this.page.getByRole('textbox', { name: SEL.checkoutCep }).fill(dados.cep);
  }

  async confirmarPedido() {
    await this.page.getByRole('button', { name: SEL.confirmarPedido }).click();
  }
}