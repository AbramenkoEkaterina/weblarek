import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils"; //гарантирует то что элемент точно будет найден, иначе будет ошибка и выполнение кода остановится
import { IEvents } from "../base/Events";

interface IGallery {
    catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
    protected catalogElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        //this.catalogElement = ensureElement<HTMLElement>('.gallery', this.container);
        this.catalogElement = container;
    }

    set catalog(items: HTMLElement[]) {
        this.catalogElement.replaceChildren(...items); //полностью очищает содержимое контейнера .gallery и вставляет туда переданные карточки.
    }
}