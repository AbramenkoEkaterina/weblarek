import { IBuyer } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export interface IForm {
    valid: boolean;
    error: string | null;
    setErrors?: (message: string | null) => void;
}

export abstract class Form <IForm> extends Component<IForm> {
    protected submitBtn: HTMLButtonElement;
    protected errorContainer: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.submitBtn = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorContainer = ensureElement<HTMLElement>('.form__errors', container); 
        
        // Отправка формы
        container.addEventListener('submit', (event) => {
          event.preventDefault();
          this.events.emit(`${this.container.getAttribute('name')}:submit`);
        });
    }

    //Вызывается внутри конкретной формы, когда пользователь что-то вводит.
    protected inputChange(field: keyof IBuyer, value: string | null) {
      this.events.emit('form:change', {
        field, value,
      })
    }

    // состояние кнопки
    setValid(isValid: boolean) {
      this.submitBtn.disabled = !isValid;
    }

    //получение ошибок
    setErrors(message: string | null) {
      this.errorContainer.textContent = message ?? '';
    }

}