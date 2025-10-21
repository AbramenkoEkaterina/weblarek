import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";

export interface ICard extends Partial<IProduct> { //делаем необязательными поля, т к нам не все поля нужны
  index?: number; // используется только для корзины
}

export abstract class Card extends Component<ICard> {
  protected title: HTMLElement;
  protected price: HTMLElement;
 

  constructor(container: HTMLElement) {
    super(container);

    this.title = ensureElement<HTMLElement>('.card__title', this.container);
    this.price = ensureElement<HTMLElement>('.card__price', this.container);
  }

  set titleCart(value:string) {
    this.title.textContent = String(value)
  }

  set priceCart(value: number | null) {
    if (value === null) {
      this.price.textContent = 'Бесценно';
    } else {
      this.price.textContent = `${value} синапсов`;
    }
  }
}

