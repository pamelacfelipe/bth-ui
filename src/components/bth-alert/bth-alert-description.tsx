import { Component, Host, h } from '@stencil/core';

/**
 * Descrição de um `bth-alert`.
 *
 * @usage-when Dentro de um `bth-alert`, para detalhar a mensagem ou orientar o próximo passo.
 * @usage-avoid Fora de um `bth-alert`; para outros textos, use um parágrafo comum.
 * @category feedback
 * @related bth-alert, bth-alert-title
 * @example
 * ```html
 * <bth-alert-description>Uma nova versão está disponível.</bth-alert-description>
 * ```
 * @status beta
 *
 * @slot - Texto da descrição.
 * @part description - Elemento da descrição.
 */
@Component({
  tag: 'bth-alert-description',
  styleUrl: 'bth-alert-description.scss',
  shadow: true,
})
export class BthAlertDescription {
  render() {
    return (
      <Host data-slot='alert-description'>
        <div class='alert-description' part='description'>
          <slot></slot>
        </div>
      </Host>
    );
  }
}
