import { Form, IForm } from "./Form";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

export interface IOrderFormData extends IForm {
  address: string;
  payment: string;
}

export class FormOrder extends Form<IOrderFormData> {
  protected addressInput: HTMLInputElement;
  protected paymentButtons: NodeListOf<HTMLButtonElement>;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
    this.paymentButtons = container.querySelectorAll('.order__buttons button');

    // обработка выбора способа оплаты
    this.paymentButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.paymentButtons.forEach((b) => b.classList.remove('button_alt-active'));
        btn.classList.add('button_alt-active');
        this.events.emit('order:payment-change', { payment: btn.name });
      });
    });
  }

  validate() {
    const valid = !!this.addressInput.value.trim();
    this.setValid(valid);
  }
}