import { Card, ICard } from "./Card";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";




export class CardBasket extends Card<ICard> {
  protected itemIndex: HTMLElement;
  protected btnDelete: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    // находим элементы
    this.itemIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.btnDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    // вешаем обработчик на кнопку
    this.btnDelete.addEventListener('click', () => {
      this.events.emit('cart:remove', { id: this.id });
});
  }

  // сеттер для порядкового номера
  set index(value: number) {
    this.itemIndex.textContent = String(value);
  }

  render(data: ICard) {
    this.id = data.id;
    return super.render(data);
  }
}