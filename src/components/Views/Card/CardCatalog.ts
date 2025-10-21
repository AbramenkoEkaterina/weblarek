import { IProduct } from "../../../types";
import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card} from "./Card";




export class CardCatalog extends Card<IProduct> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected btnBig: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container)

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.btnBig = ensureElement<HTMLButtonElement>('.card', this.container);

        //клик по карточке, событие card:select
        this.btnBig.addEventListener('click', () => {
            this.events.emit('card:select', {id: this.id})
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

    set image(value: string) {
        this.setImage(this.imageElement, value, this.title)
    }

    // переопределяем render
  render(data: IProduct) {
    this.id = data.id;
    this.title = data.title;
    this.price = data.price;
    this.category = data.category;
    this.image = data.image;
    return this.container;
  }
}