import "./scss/styles.scss";
import { Catalog } from "./components/Models/Catalog";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";
import { apiProducts } from "./utils/data";

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
cart.clearCArt();
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
