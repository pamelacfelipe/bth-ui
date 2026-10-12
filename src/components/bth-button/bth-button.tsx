import { Component, Element, Host, Prop, h } from '@stencil/core';
import { ButtonVariant, ButtonSize, ButtonColor } from './bth-button.types';

/**
 * Botão para disparar ações e enviar formulários.
 *
 * @usage-when Para disparar uma ação na página atual, como salvar, confirmar ou abrir um diálogo.
 * @usage-when Para enviar ou limpar um formulário, com `type="submit"` ou `type="reset"`.
 * @usage-avoid Para navegar entre páginas; use um link.
 * @usage-avoid Com mais de um botão de destaque na mesma área; reserve a cor `primary` para a ação principal.
 * @category formulário
 * @related bth-icon, bth-alert
 * @example
 * ```html
 * <bth-button color="primary">Salvar</bth-button>
 * <bth-button variant="outline" color="danger" size="sm">Excluir</bth-button>
 * ```
 * @status beta
 *
 * @slot - Conteúdo do botão.
 */
@Component({
  tag: 'bth-button',
  styleUrl: 'bth-button.scss',
  shadow: true,
})
export class BthButton {
  @Element() el!: HTMLElement;

  /** Estilo visual: `default` é preenchido, `outline` tem só a borda e `ghost` tem só o texto. */
  @Prop({ reflect: true }) variant: ButtonVariant = 'default';
  /** Desabilita o botão e impede a interação. */
  @Prop({ reflect: true }) disabled?: boolean = false;
  /** Tamanho do botão. */
  @Prop({ reflect: true }) size: ButtonSize = 'md';
  /** Cor do botão. */
  @Prop({ reflect: true }) color: ButtonColor = 'default';
  /** Tipo do botão nativo. `submit` e `reset` atuam sobre o formulário pai. */
  @Prop() type: 'submit' | 'reset' | 'button' = 'button';

  // The native button lives in the shadow DOM, so it can't reach the form by itself
  private handleClick = () => {
    const form = this.el.closest('form');
    if (!form) return;

    if (this.type === 'submit') form.requestSubmit();
    if (this.type === 'reset') form.reset();
  };

  render() {
    return (
      <Host>
        <button class="btn" type={this.type} disabled={this.disabled} onClick={this.handleClick}>
          <slot></slot>
        </button>
      </Host>
    );
  }
}
