import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {
  protected descriptionElement: HTMLElement;
  protected successBtn: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.successBtn = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    // закрытие окна по кнопке
    this.successBtn.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  // обновляем текст суммы
  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}