import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils"; //гарантирует то что элемент точно будет найден, иначе будет ошибка и выполнение кода остановится
import { IEvents } from "../base/Events";


interface IHeader {
    counter: number;
}

export class Header extends Component<IHeader> {
    protected counterElement: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container)

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        })
    }

    set counter(value: number) {
        this.counterElement.textContent = String(value);
    }
}


