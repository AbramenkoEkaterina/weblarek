import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export interface IForm {
    [key: string]: string;
}

export abstract class Form <T extends IForm> extends Component<T> {
    protected formElement: HTMLFormElement;
    protected submitBtn: HTMLButtonElement;
    protected errorContainer: HTMLElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.formElement = container;
        this.submitBtn = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorContainer = ensureElement<HTMLElement>('.form__errors', container);

        //// обработчик изменения в инпуте
        this.formElement.addEventListener('input', (evt: Event) => {
            const target = evt.target as HTMLInputElement;
            if (target.name) {
                this.events.emit('form:change', {field: target.name, value: target.value})
            }
        });

        this.formElement.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.events.emit('form:submit', this.getData)
        });
    }

     public getData() :T {
            const formData = new FormData(this.formElement);
            const result = {} as Record<string, string>;
            formData.forEach((value, key) => {
                result[key] =String(value);
            });
            return result as T;
        }

        // показывает текст ошибки
  setError(message: string) {
    this.errorContainer.textContent = message;
  }

  // активирует / деактивирует кнопку
  setValid(isValid: boolean) {
    this.submitBtn.disabled = !isValid;
  }

  // очистка формы
  reset() {
    this.formElement.reset();
  }
}