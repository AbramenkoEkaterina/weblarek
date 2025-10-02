import { IProduct } from "../../types";

export class Cart {
    private items: IProduct[] = []; //товары в корзине, изначально пусто

    //получить товары в корзине
    getCartItems(): IProduct[] {
        return this.items;
    }

    //добавление товара, который был получен в параметре, в массив корзины
    addCartItem(item: IProduct): void {
        this.items.push(item);
    }

    //удаление товара, полученного в параметре из массива корзины;
    removeCartItem(item: IProduct): void {
        this.items = this.items.filter((p) => p.id !== item.id);
    }

    //очистка корзины;
    clearCArt(): void {
        this.items = [];
    }

    //получение стоимости всех товаров в корзине;
    getCartTotal() : number {
        return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    //получение количества товаров в корзине;
    getCartCount() : number {
        return this.items.length;
    }

    //проверка наличия товара в корзине по его id, полученного в параметр метода.
    hasCartItem(item: IProduct): boolean {
        return this.items.some((p) => p.id === item.id);
    }
}