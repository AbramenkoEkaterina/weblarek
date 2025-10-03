export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

//тип оплаты
export type TPayment = 'card' | 'cash'; 

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

//покупатель
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

//каталог товаров который к нам приходит с сервера
export interface ICatalogResult {
  total: number;      // всего товаров
  items: IProduct[];  // список товаров
}

//заказа, который отправляем на сервер
export interface IOrder {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];   // список выбранных товаров (объекты товаров)
}

//результат оформления заказа, который возвращает сервер после успешного запроса.
export interface IOrderResult {
  id: string;
  total: number,     // итоговая сумма заказа
}