import { ICatalogResult, IOrder, IOrderResult } from "../../types";
import { Api } from "../base/Api";

export class ApiServise extends Api {
  //Наследует функционал от базового класса Api
  constructor(baseUrl: string, options: RequestInit = {}) {
    //описано все в base.Api.ts базовый url+доп опции
    super(baseUrl, options); //вызываем родительский конструктор
  }
  getProducts(): Promise<ICatalogResult> {
    return this.get<ICatalogResult>("/product/");
  }

  postOrder(order: IOrder): Promise<IOrderResult> {
    return this.post<IOrderResult>("/order/", order);
  }
}
