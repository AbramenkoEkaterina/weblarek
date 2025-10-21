import { Card, ICard } from "./Card";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";



export class CardBasket extends Card<ICard> {
    protected itemIndex: HTMLElement;
    protected btnDelete: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container)
        this.itemIndex = ensureElement<HTMLElement>('.basket__item-index', this.container)
        this.btnDelete = ensureElement<HTMLButtonElement>('.basket__item-delete card__button', this.container)
    }

    set index(value: number) {
        this.itemIndex.textContent = String(value);
    }
}