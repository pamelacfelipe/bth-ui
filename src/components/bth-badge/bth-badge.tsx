import { Component, Host, Prop, h } from '@stencil/core';
import { BadgeColor, BadgeSize, BadgeVariant } from './bth-badge.types';

/**
 * Etiqueta curta para destacar um status, uma categoria ou uma contagem.
 *
 * @usage-when Para indicar o status de um item, como "Ativo", "Pendente" ou "Novo".
 * @usage-when Para rotular ou categorizar um conteúdo, inclusive ao lado de um título.
 * @usage-avoid Para ações clicáveis; use um `bth-button`.
 * @usage-avoid Para mensagens longas ou que exigem atenção imediata; use um `bth-alert`.
 * @category dados
 * @related bth-button, bth-alert, bth-icon
 * @example
 * ```html
 * <bth-badge variant="solid" color="primary">solid</bth-badge>
 * <bth-badge variant="subtle" color="primary">subtle</bth-badge>
 * <bth-badge variant="outline" color="primary">outline</bth-badge>
 * ```
 * @status beta
 *
 * @slot - Conteúdo do badge.
 * @part badge - Elemento do badge.
 */
@Component({
  tag: 'bth-badge',
  styleUrl: 'bth-badge.scss',
  shadow: true,
})
export class BthBadge {
  /** Estilo visual: `solid` é preenchido, `subtle` tem um fundo suave e `outline` tem só a borda. */
  @Prop({ reflect: true }) variant: BadgeVariant = 'solid';
  /** Cor do badge. */
  @Prop({ reflect: true }) color: BadgeColor = 'default';
  /** Tamanho do badge, proporcional ao tamanho da fonte do contexto onde ele está. */
  @Prop({ reflect: true }) size: BadgeSize = 'md';

  render() {
    return (
      <Host data-slot='badge'>
        <span class='badge' part='badge'>
          <slot></slot>
        </span>
      </Host>
    );
  }
}
