import { Form, IForm } from "./Form";
import { IEvents } from "../../base/Events";
import { ensureAllElements, ensureElement } from "../../../utils/utils";
import { TPayment } from "../../../types";

export interface IOrderFormData extends IForm {
  address: string;
  payment: TPayment | null;
}

export class FormOrder extends Form<IOrderFormData> {
  protected addressInput: HTMLInputElement;
  protected paymentButtons: HTMLButtonElement[];

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    this.paymentButtons = ensureAllElements<HTMLButtonElement>('.order__buttons button', this.container);

    // Ввод адреса → одно событие на изменение формы
    this.addressInput.addEventListener('input', () => {
      this.inputChange('address', this.addressInput.value.trim());
    });

    // Клик по способу оплаты
    this.paymentButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.paymentButtons.forEach((b) =>
          b.classList.remove('button_alt-active')
        );
        btn.classList.add('button_alt-active');
        this.inputChange('payment', btn.name as TPayment);
      });
    });
  }

  // Обновление визуала кнопок
  set payment(payment: TPayment | null) {
    this.paymentButtons.forEach((btn) => {
      btn.classList.toggle('button_alt-active', btn.name === payment);
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
