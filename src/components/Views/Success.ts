import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

//указала unknown, тк компонент не использует никаких данных и ему нечего рендерить
export class Success extends Component<unknown> {
  protected titleElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.order-success__title', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);

    // закрытие окна по кнопке
    this.closeButton.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  // обновляем текст суммы
  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}