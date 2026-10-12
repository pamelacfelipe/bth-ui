import { Component, Prop, h } from '@stencil/core';

/**
 * Ícone da fonte Material Symbols Outlined.
 *
 * @usage-when Para reforçar visualmente o significado de um texto, como o título de um alerta ou o rótulo de um botão.
 * @usage-when Para preencher o slot `icon` de outros componentes.
 * @usage-avoid Como único conteúdo de um controle interativo sem um rótulo acessível.
 * @usage-avoid Para ilustrações ou imagens decorativas grandes; use uma imagem.
 * @category mídia
 * @related bth-alert, bth-button
 * @example
 * ```html
 * <bth-icon name="info"></bth-icon>
 * ```
 * @status beta
 */
@Component({
  tag: 'bth-icon',
  styleUrl: 'bth-icon.scss',
  shadow: false,
})
export class BthIcon {
  /** Nome do ícone na fonte Material Symbols Outlined, como `info` ou `check_circle`. */
  @Prop() name?: string;

  render() {
    return (
      <span class='material-symbols-outlined'>{this.name}</span>
    );
  }
}
