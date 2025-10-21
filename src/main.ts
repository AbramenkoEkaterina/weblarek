import "./scss/styles.scss";
import { Catalog } from "./components/Models/Catalog";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";
import { apiProducts } from "./utils/data";
import { ApiServise } from "./components/Models/ApiServise";
import { API_URL } from "./utils/constants";
import type { IOrder } from "./types";
//import { Header } from "./components/Views/Header";
//import { Gallery } from "./components/Views/Gallery";
import { Card } from "./components/Views/Card/Card";
import { ensureElement } from "./utils/utils";
import { CardCatalog } from "./components/Views/Card/CardCatalog";
import { EventEmitter } from "./components/base/Events";

const log = console.log;
const table = console.table;

//работаем с каталогом
log(
  "%cПроверка методов класса Catalog",
  "color: green; font-size: 20px; font-weight: bold;"
);
//создаем каталог и заполняем его

const catalog = new Catalog();
catalog.setItems(apiProducts.items);
log(
  "Все товаровы из каталога, %cметоды сохрания и получения товаров:",
  "color: purple; font-weight: bold;"
);
table(catalog.getItems()); //получили обьект из 4 массивов

const productId = apiProducts.items[1].id; //взяли id второго товара
const testProductId = catalog.getItemById(productId);
log(
  "Найденный товар по Id: %c Метод поиска по ID",
  "color: purple; font-weight: bold;"
);
table(testProductId);

const firstProduct = apiProducts.items[0];
catalog.setSelectedItem(firstProduct); //сохранили
const testSelectedProduct = catalog.getSelectedItem();
log(
  "Выбранный товар: %c Методы сохранения и получения выбранного товара",
  "color: purple; font-weight: bold;"
);
table(testSelectedProduct);

//работаем с корзиной
log(
  "%cПроверка методов класса Cart",
  "color: green; font-size: 20px; font-weight: bold;"
);

const cart = new Cart();
// 1. Проверяем добавление товара
const secondProduct = apiProducts.items[1];
cart.addCartItem(secondProduct);
cart.addCartItem(firstProduct); // первый, выше использовался
log(
  "Добавленный товар в корзину: %c Методы добавления и получения товара",
  "color: purple; font-weight: bold;"
);
table(cart.getCartItems());
log(
  "%cМетод получения колличесива товаров в корзине:",
  "color: purple; font-weight: bold;",
  cart.getCartCount()
);
log(
  "%cпроверка наличия товара в корзине по его id, полученного в параметр метода:",
  "color: purple; font-weight: bold;",
  cart.hasCartItem(firstProduct)
);
log(
  "%cМетод получение стоимости всех товаров в корзине:",
  "color: purple; font-weight: bold;",
  cart.getCartTotal()
);

// Удаляем один товар
cart.removeCartItem(firstProduct);
log(
  "%cМетод удаления, корзина после удаления первого товара:",
  "color: purple; font-weight: bold;"
);
table(cart.getCartItems());

//ищем товар по id
log(
  "%cМетод проверка наличия товара в корзине по его id",
  "color: purple; font-weight: bold;",
  cart.hasCartItem(firstProduct)
);
cart.clearCart();
log(
  "%cМетод очистки, корзина после удаления первого товара:",
  "color: purple; font-weight: bold;"
);
table(cart.getCartItems());

//работаем с покупателем
log(
  "%cПроверка методов класса Bueyr",
  "color: green; font-size: 20px; font-weight: bold;"
);

const buyer = new Buyer();
log(
  "%cМетод получение всех данных покупателя:",
  "color: purple; font-weight: bold;"
);
table(buyer.getDataBuyer());

//добавим емеил
buyer.setDataBuyer({ email: "teste@mail.ru" });
log(
  "%cМетод сохранение данных в модели, возможность сохранить только одно значение",
  "color: purple; font-weight: bold;"
);
log("%cПосле добавления email:", "color: purple; font-weight: bold;");
table(buyer.getDataBuyer());

// Добавим адрес
buyer.setDataBuyer({ address: "Таганрог, Петровская 68А" });
log("%cПосле добавления адреса:", "color: purple; font-weight: bold;");
table(buyer.getDataBuyer());

//Проверим валидацию
log("%cМетод валидации, ошибки:", "color: purple; font-weight: bold;");
table(buyer.valiDataBuyer());

// Очистим данные
buyer.clearDataBuyer();
console.log(
  "%cМетод очистики, после очистки:",
  "color: purple; font-weight: bold;"
);
table(buyer.getDataBuyer());


//работаем с сетью

const apiServise = new ApiServise(API_URL);

try{
  const catalog2 = await apiServise.getProducts()
  log("%c Каталог получен с сервера", "color: orange; font-weight: bold;")
  table(catalog2.items)
} catch (error) {
  console.error("%cОшибка работы с API:", "color: red; font-weight: bold;", error);
}


// Данные тестового заказа
const testOrder: IOrder = {
  payment: "card",
  email: "test@test.ru",
  phone: "+79280001400",
  address: "Taganrog Lenina 1",
  total: 750,
  items: ["854cef69-976d-4c2a-a18c-2aa45046c390"] //эт id первого элемента который есть на сервере
};

// Отправляем заказ
try {
  const result = await apiServise.postOrder(testOrder);
  log("%cЗаказ успешно создан:", "color: orange; font-weight: bold;");
  table(result)
} catch (error) {
  console.error("Ошибка при создании заказа:", error);
}




//------------------------------- 9спринт тесты----------------------------------//

//здесь проверила header
// class FakeEvents {
//   emit(event: string, data? :unknown) {
//     console.log(`событие вызвано: ${event}`, data)
//   }
// }

// const headerElement = document.querySelector('.header') as HTMLElement;
// const header = new Header(new FakeEvents(), headerElement);
// header.counter = 5;


//gallary
// const galleryContainer = ensureElement('.gallery') as HTMLElement;
// const gallery = new Gallery(galleryContainer);

// // создаём 2 карточки
// const card1 = document.createElement('div');
// card1.textContent = 'Карточка 1';
// const card2 = document.createElement('div');
// card2.textContent = 'Карточка 2';

// // показываем их в галерее
// gallery.catalog = [card1, card2];


// //cart
// // Так как Card — абстрактный класс, создадим временный класс для теста
// class TestCard extends Card {}

// // Создаём элемент карточки
// const cardElement = document.createElement('div');
// cardElement.classList.add('card');
// cardElement.innerHTML = `
//   <h3 class="card__title"></h3>
//   <p class="card__price"></p>
// `;

// // Добавляем карточку в страницу, чтобы её можно было увидеть
// document.body.appendChild(cardElement);

// // Создаём экземпляр класса
// const card = new TestCard(cardElement);

// // Проверяем работу сеттеров
// card.titleCart = 'HEX-леденец';
// card.priceCart = null;

// // Проверим результат в консоли
// console.log('Название:', ensureElement('.card__title')?.textContent);
// console.log('Цена:', ensureElement('.card__price')?.textContent);



