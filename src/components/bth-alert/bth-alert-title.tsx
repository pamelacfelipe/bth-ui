import { Component, Host, h } from '@stencil/core';

/**
 * Título de um `bth-alert`.
 *
 * @usage-when Dentro de um `bth-alert`, para resumir a mensagem em poucas palavras.
 * @usage-avoid Fora de um `bth-alert`; para outros títulos, use um elemento de título comum.
 * @category feedback
 * @related bth-alert, bth-alert-description
 * @example
 * ```html
 * <bth-alert-title>Informação</bth-alert-title>
 * ```
 * @status beta
 *
 * @slot - Texto do título.
 * @part title - Elemento do título.
 */
@Component({
  tag: 'bth-alert-title',
  styleUrl: 'bth-alert-title.scss',
  shadow: true,
})
export class BthAlertTitle {
  render() {
    return (
      <Host data-slot='alert-title'>
        <h5 class='alert-title' part='title'>
          <slot></slot>
        </h5>
      </Host>
    );
  }
}
