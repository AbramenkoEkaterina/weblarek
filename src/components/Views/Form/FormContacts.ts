import { Form, IForm } from "./Form";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

export interface IContactsFormData extends IForm {
  email: string;
  phone: string;
}

export class FormContacts extends Form<IContactsFormData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    // Находим поля ввода
    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    // Подписываемся на изменения email
    this.emailInput.addEventListener('input', () => {
      this.inputChange('email', this.emailInput.value.trim());
    });

    // Подписываемся на изменения телефона
    this.phoneInput.addEventListener('input', () => {
      this.inputChange('phone', this.phoneInput.value.trim());
    });
  }
}
