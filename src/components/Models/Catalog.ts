import { IProduct } from "../../types";

export class Catalog {
  private items: IProduct[] = []; //по умолчанию пустой массив товаров
  private selectedItem: IProduct | null = null; //выбранный товар, инициализируем  null, тк изначально выбор отсутсвует

  // сохраняем массив товаров
  setItems(items: IProduct[]): void {
    this.items = items;
  }

  //получить все товары
  getItems(): IProduct[] {
    return this.items;
  }

  //найти товар по id
  getItemById(id: string): IProduct | undefined {
    //здесь можно вывести что товара нет или ошибка
    return this.items.find((item) => item.id === id); //find - поиска первого элемента в массиве, удовлетворяющего заданному условию (возвращается вся карточка)
  }

  //сохранить выбранный товар
  setSelectedItem(item: IProduct): void {
    this.selectedItem = item;
  }

  //получить выбранный товар
  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}
