import { IProduct } from "../../types";
import { IEvents } from "../base/Events";
export class Cart {
  private items: IProduct[] = [];

  constructor(protected events: IEvents) {
    this.items = [];
  }

  getCartItems(): IProduct[] {
    return this.items;
  }

  addCartItem(item: IProduct): void {
    this.items.push(item);
    this.emitChange();
  }

  removeCartItem(item: IProduct): void {
    this.items = this.items.filter(p => p.id !== item.id);
    this.emitChange();
  }

  clearCart(): void {
    this.items = [];
    this.emitChange();
  }

  getCartTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getCartCount(): number {
    return this.items.length;
  }

  hasCartItem(item: IProduct): boolean {
    return this.items.some(p => p.id === item.id);
  }

  // отдельный метод, чтобы не дублировать emit
  private emitChange(): void {
    this.events.emit('cart:changed', {
      items: this.items,
      total: this.getCartTotal(),
    });
  }
}
