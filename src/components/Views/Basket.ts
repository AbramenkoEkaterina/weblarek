import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Component } from "../base/Component";

interface BasketData {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<BasketData> {
  protected titleEl: HTMLElement;
  protected listEl: HTMLElement;
  protected buttonEl: HTMLButtonElement;
  protected priceEl: HTMLElement;
  protected templateCardBasket: HTMLTemplateElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    // ищем шаблон карточки товара в корзине внутри документа
    this.templateCardBasket = ensureElement<HTMLTemplateElement>("#card-basket");

    this.titleEl = ensureElement<HTMLElement>(".modal__title", this.container);
    this.listEl = ensureElement<HTMLElement>(".basket__list", this.container);
    this.buttonEl = ensureElement<HTMLButtonElement>(".basket__button", this.container);
    this.priceEl = ensureElement<HTMLElement>(".basket__price", this.container);

    // обработчик кнопки "Оформить"
    this.buttonEl.addEventListener("click", () => {
      this.events.emit("basket:checkout");
    });
  }

  /** Отрисовка корзины */
  set basket({ items, total }: BasketData) {
    this.listEl.replaceChildren(); // очищаем список
    //this.total = total;

    if (items.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "Корзина пуста";
      this.listEl.append(empty);
      this.buttonEl.disabled = true;
    } else {
      this.buttonEl.disabled = false;
      this.listEl.append(...items);

      // items.forEach((product, index) => {
      //   const itemEl = cloneTemplate(this.templateCardBasket);
      //   const card = new CardBasket(itemEl, this.events);
      //   const rendered = card.render({ ...product, index: index + 1 });
      //   this.listEl.append(rendered);
      // });
    }

    this.total = total;
  }

  set total(value: number) {
    this.priceEl.textContent = `${value} синапсов`;
  }

  render(): HTMLElement {
    return this.container
  }
}
