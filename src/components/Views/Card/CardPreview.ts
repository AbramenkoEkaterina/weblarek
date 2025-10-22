import { IProduct } from "../../../types";
import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card, ICard } from "./Card";



export class CardPreview extends Card<IProduct> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected btnElement: HTMLButtonElement;
    protected descriptionElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.btnElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);

        this.btnElement.addEventListener('click', () => {
            this.events.emit('product: add-to-cart', {id: this.id})
        })
    }
    set category(value: string) {
        this.categoryElement.textContent = value;
        this.categoryElement.className = 'card__category';
        const modifier = (categoryMap as Record<string, string>)[value.toLowerCase()];
        if (modifier) {
            this.categoryElement.classList.add(modifier)
        }
    }

    set description(value:string) {
        this.descriptionElement.textContent = value;
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.title)
    }

    set price(value: number | null) {
        if (value === null) {
            this.btnElement.textContent = 'Недоступно';
            this.btnElement.disabled = true;
        } else {
            this.btnElement.textContent = "В корзину"ж
            this.btnElement.disabled = false
        }
        super.price = value;
    }

    render(data: IProduct) {
    this.id = data.id;
    this.title = data.title;
    this.category = data.category;
    this.image = data.image;
    this.description = data.description;
    this.price = data.price;
    return this.container;
  }

    
}