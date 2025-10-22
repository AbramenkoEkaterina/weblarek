import "./scss/styles.scss";
import { ApiServise } from "./components/Models/ApiServise";
import { Catalog } from "./components/Models/Catalog";
import { Gallery } from "./components/Views/Gallery";
import { CardCatalog } from "./components/Views/Card/CardCatalog";
import { EventEmitter } from "./components/base/Events";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { API_URL } from "./utils/constants";
import { IProduct } from "./types";

const events = new EventEmitter();
const api = new ApiServise(API_URL);
const catalog = new Catalog();

const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));

//Загружаем товары с API
api.getProducts()
  .then((data) => {
    catalog.setItems(data.items); //сохранили полученные товары в модель

  const cards = data.items.map((product : IProduct) => {
    const element = cloneTemplate<HTMLElement>('#card-catalog');
    const card = new CardCatalog(element, events);
    return card.render(product); //заполняем карточку данными о продукте
  });

  // 4️⃣ Рендерим всё в галерею
  gallery.catalog = cards;
  })

  .catch(err => {
    console.error('Не удалось загрузить каталог', err);
  })
