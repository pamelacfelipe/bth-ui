import clsx from 'clsx';
import { Component, Element, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { AlertVariant } from './bth-alert.types';

/**
 * Alerta para destacar uma mensagem importante dentro do conteúdo da página.
 *
 * @usage-when Para comunicar o resultado de uma ação, como sucesso ou erro ao salvar.
 * @usage-when Para avisar sobre um estado ou uma condição que afeta o que a pessoa está fazendo.
 * @usage-avoid Para mensagens temporárias que somem sozinhas; use uma notificação do tipo toast.
 * @usage-avoid Para validação de um campo específico; mostre a mensagem junto ao campo.
 * @category feedback
 * @related bth-alert-title, bth-alert-description, bth-icon
 * @example
 * ```html
 * <bth-alert variant="info" dismissible>
 *   <bth-icon slot="icon" name="info"></bth-icon>
 *   <bth-alert-title>Informação</bth-alert-title>
 *   <bth-alert-description>Uma nova versão está disponível.</bth-alert-description>
 * </bth-alert>
 * ```
 * @status beta
 *
 * @slot - Conteúdo do alerta, normalmente `bth-alert-title` e `bth-alert-description`.
 * @slot icon - Ícone exibido à esquerda do conteúdo.
 * @part alert - Contêiner do alerta.
 * @part dismiss - Botão de fechar, presente quando `dismissible` está ativo.
 */
@Component({
  tag: 'bth-alert',
  styleUrl: 'bth-alert.scss',
  shadow: true,
})
export class BthAlert {
  @Element() el!: HTMLElement;

  /** Variante de cor, de acordo com o tipo da mensagem. */
  @Prop({ reflect: true }) variant: AlertVariant = 'default';
  /** Exibe um botão que permite fechar o alerta. */
  @Prop() dismissible: boolean = false;
  @State() hasIcon: boolean = false;
  @State() dismissed: boolean = false;

  /** Emitido quando o alerta é fechado pelo botão de fechar. */
  @Event() bthDismiss!: EventEmitter<void>;

  componentWillLoad() {
    this.updateHasIcon();
  }

  private updateHasIcon = () => {
    this.hasIcon = !!this.el.querySelector(':scope > [slot="icon"]');
  };

  private handleDismiss = () => {
    this.dismissed = true;
    this.bthDismiss.emit();
  };

  render() {
    return (
      <Host data-slot='alert' hidden={this.dismissed}>
        <div class={clsx('alert', this.hasIcon && 'alert--has-icon')} role='alert' part='alert'>
          <slot name='icon' onSlotchange={this.updateHasIcon}></slot>
          <slot></slot>
          {this.dismissible && (
            <button class='alert-dismiss' type='button' aria-label='Fechar' part='dismiss' onClick={this.handleDismiss}>
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' aria-hidden='true'>
                <path d='M4 4l8 8M12 4l-8 8' />
              </svg>
            </button>
          )}
        </div>
      </Host>
    );
  }
}
