import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

//указала unknown, тк компонент не использует никаких данных и ему нечего рендерить 
export class Modal extends Component<unknown> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;
  

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this.contentElement = ensureElement<HTMLElement>('.modal__content', container);

    // обработчик кнопки закрытия
    this.closeButton.addEventListener('click', () => this.close());

    // закрытие по клику вне контента
    this.container.addEventListener('click', (evt) => {
      if (evt.target === this.container) {
        this.close();
      }
    });
  }

  // вставляем контент (любой HTML элемент)
  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  // открыть модалку
  open() {
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  // закрыть модалку
  close() {
    this.container.classList.remove('modal_active');
    this.contentElement.innerHTML = ''; // очистить контент
    this.events.emit('modal:close');
  }

  get element(): HTMLElement {
    return this.container;
  }
}