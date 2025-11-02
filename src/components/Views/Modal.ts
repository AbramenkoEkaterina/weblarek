import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export enum ModalView {
  Preview = 'preview',
  Basket = 'basket',
  Order = 'order',
  Contacts = 'contacts',
  Success = 'success'
}

export class Modal extends Component<unknown> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;
  protected _currentView: string | null = null;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this.contentElement = ensureElement<HTMLElement>('.modal__content', container);

    // закрытие по кнопке
    this.closeButton.addEventListener('click', () => this.close());

    // закрытие по клику вне контента
    this.container.addEventListener('click', (evt) => {
      if (evt.target === this.container) {
        this.close();
      }
    });
  }

  // --- Контент ---
  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  // --- Текущий экран ---
  set currentView(value: string | null) {
    this._currentView = value;
  }

  get currentView(): string | null {
    return this._currentView;
  }

  // --- Методы управления ---
  open() {
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.contentElement.innerHTML = '';
    this._currentView = null; // сбрасываем состояние при закрытии
    this.events.emit('modal:close');
  }

  get element(): HTMLElement {
    return this.container;
  }
}
