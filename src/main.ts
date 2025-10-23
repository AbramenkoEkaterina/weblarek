import "./scss/styles.scss";

import { ApiServise } from "./components/Models/ApiServise";
import { Catalog } from "./components/Models/Catalog";
import { Gallery } from "./components/Views/Gallery";
import { CardCatalog } from "./components/Views/Card/CardCatalog";
import { EventEmitter } from "./components/base/Events";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { API_URL } from "./utils/constants";
import { IProduct } from "./types";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";
import { Header } from "./components/Views/Header";
import { Modal } from "./components/Views/Modal";
import { CardPreview } from "./components/Views/Card/CardPreview";

const events = new EventEmitter();

const api = new ApiServise(API_URL);

//модели
const catalog = new Catalog(events); //передала событие
const cart = new Cart();
const buyer = new Buyer();

//view
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const header = new Header(events, ensureElement<HTMLElement>('.header'));
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);


/* ===================== 2) Подписки на события  =============================================================== */


//подписываемся на событие изменения каталога catalog:changed модель -> презентер (1)
events.on<{items: IProduct[]}>('catalog:changed', (data) => {
  const cards = data.items.map((product : IProduct) => {
    const element = cloneTemplate<HTMLElement>('#card-catalog');
    const card = new CardCatalog(element, events);
    return card.render(product); //заполняем карточку данными о продукте
  });
  // Рендерим всё в галерею
  gallery.catalog = cards;
})

//пользователь выбирает карточку card:select (2)
events.on<{ id: string }>('card:select', ({id}) => {
  const product = catalog.getItemById(id);
  if (!product) return;

  const previewEl = cloneTemplate<HTMLElement>('#card-preview');
  const previewCard = new CardPreview(previewEl, events);
  modal.content = previewCard.render(product)
  modal.open()
})

//пользователь добавляет карточку из превью в корзину product:add-to-cart (3) и появляется еще одно событие cart:changed (3.1)
events.on<{id: string}>('product:add-to-cart', ({id}) => {
  const product = catalog.getItemById(id);
  if(!product) {
    console.warn('product:add-to-cart: товар не найден', id);
    return;
  }

  cart.addCartItem(product)// добавили в корзину
  header.counter = cart.getCartCount(); //счетчик обновила

  //произошли изменения значит новый эмит
  events.emit('cart:changed', {
    items: cart.getCartItems(),
    total: cart.getCartTotal()
  })

  //console.log(`${product.title} добавлен в корзину`)
})

//Загружаем товары с API
api.getProducts()
  .then((data) => {
    catalog.setItems(data.items); //сохранили полученные товары в модель
    })
  .catch(err => {
    console.error('Не удалось загрузить каталог', err);
  })


  //