import { IProduct } from "../../../types";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card } from "./Card";



export class CardPreview extends Card<IProduct & { buttonText: string}> {
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

        // При клике отсылаем id товара — презентер решит что делать
        this.btnElement.addEventListener('click', () => {
            this.events.emit('product:button-click', {id: this.id}) 
        })
    }
    set category(value: string) {
        this.categoryElement.textContent = value;
        this.categoryElement.className = 'card__category';
        const modifier = (categoryMap as Record<string, string>)[value.toLowerCase()];
        if (modifier) {
            this.categoryElement.classList.add(modifier);
        }
    }

    set description(value:string) {
        this.descriptionElement.textContent = value;
    }

    set image(value: string) {
        this.imageElement.src = `${CDN_URL}/${value}`;
        this.imageElement.alt = this.titleCart.textContent || 'Изображение товара';
      }


     set buttonText(value:string) {
        this.btnElement.textContent = value;
    }

    // Состояние доступности кнопки
    set buttonDisabled(value: boolean) {
        this.btnElement.disabled = value;
    }
    
}