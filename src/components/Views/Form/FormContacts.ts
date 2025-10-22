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

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);

    this.emailInput.addEventListener('input', () => this.validate());
    this.phoneInput.addEventListener('input', () => this.validate());
  }

  validate() {
    const valid = this.emailInput.value.includes('@') && this.phoneInput.value.length >= 10;
    this.setValid(valid);
  }
}