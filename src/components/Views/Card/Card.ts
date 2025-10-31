import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";

export interface ICard extends Partial<IProduct> { //делаем необязательными поля, т к нам не все поля нужны
  index?: number; // используется только для корзины
}

export abstract class Card<T extends  Partial <IProduct>> extends Component<T> { // либо IProduct, либо интерфейс, расширяющий IProduct
  protected titleCart: HTMLElement;
  protected priceCart: HTMLElement;
  protected id?: string;
 

  constructor(container: HTMLElement) {
    super(container);

    this.titleCart = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceCart = ensureElement<HTMLElement>('.card__price', this.container);
  }

  set title(value:string) {
    this.titleCart.textContent = String(value)
  }

  set price(value: number | null) {
    if (value === null) {
      this.priceCart.textContent = 'Бесценно';
    } else {
      this.priceCart.textContent = `${value} синапсов`;
    }
  }

  

}

