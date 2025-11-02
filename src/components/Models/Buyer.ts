import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
    private payment: TPayment | null = null;
    private address: string = "";
    private phone: string = "";
    private email: string = "";

    //сохранение данных в модели, возможность сохранить только одно значение, например, только адрес или только телефон,
    // не удалив при этом значения других полей, которые уже могут храниться в классе;
    constructor(private events: IEvents) {};

    setDataBuyer(data: Partial<IBuyer>) :void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.address !== undefined) this.address = data.address;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.email !== undefined) this.email = data.email;

        // Сообщаем системе, что данные покупателя изменились
        this.events.emit('buyer:changed', this.getDataBuyer());
    }

    //получение всех данных покупателя;

    getDataBuyer() :IBuyer {
        return {
            payment: this.payment as TPayment,
            address: this.address,
            phone: this.phone,
            email: this.email,
        };
    }

    //очистка данных покупателя;

    clearDataBuyer() :void {
        this.payment = null;
        this.address = "";
        this.phone = "";
        this.email = "";
        this.events.emit('buyer:changed', this.getDataBuyer());
    }

    //валидация данных
    valiDataBuyer(): Record<string, string> {
        const errors: Record<string,string> = {};

        if (!this.payment) errors.payment = "Не выбран вид оплаты";
        if (!this.address) errors.address = "Укажите адрес";
        if (!this.phone) errors.phone = "Укажите номер телефона";
        if (!this.email) errors.email = "Укажите email";
        return errors;
        
    }

}