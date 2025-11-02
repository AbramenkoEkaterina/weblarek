import "./scss/styles.scss";

import { ApiServise } from "./components/Models/ApiServise";
import { Catalog } from "./components/Models/Catalog";
import { Gallery } from "./components/Views/Gallery";
import { CardCatalog } from "./components/Views/Card/CardCatalog";
import { EventEmitter } from "./components/base/Events";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { API_URL } from "./utils/constants";
import { IBuyer, IOrder, IProduct } from "./types";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";
import { Header } from "./components/Views/Header";
import { Modal } from "./components/Views/Modal";
import { CardPreview } from "./components/Views/Card/CardPreview";
import { Basket } from "./components/Views/Basket";
import { FormOrder } from "./components/Views/Form/FormOrder";
import { FormContacts } from "./components/Views/Form/FormContacts";
import { Success } from "./components/Views/Success";
import { CardBasket } from "./components/Views/Card/CardBasket";

const events = new EventEmitter();
const api = new ApiServise(API_URL);
//модели
const catalog = new Catalog(events); //передала событие
const buyer = new Buyer(events);
//view
const cart = new Cart(events);
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const header = new Header(events, ensureElement<HTMLElement>('.header'));
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);


  const templateCardCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
  const templateCardPreview = ensureElement<HTMLTemplateElement>('#card-preview');
  const templateCardBasket = ensureElement<HTMLTemplateElement>('#card-basket');
  const templateBasket = ensureElement<HTMLTemplateElement>('#basket');
  const templateFormOrder = ensureElement<HTMLTemplateElement>('#order');
  const templateFormContacts = ensureElement<HTMLTemplateElement>('#contacts');
  const templateSuccess = ensureElement<HTMLTemplateElement>('#success');
  const basketView = new Basket(cloneTemplate(templateBasket), events);
  const previewView = new CardPreview(cloneTemplate(templateCardPreview), events);
  const orderFormView = new FormOrder(cloneTemplate(templateFormOrder), events);
  const contactsFormView = new FormContacts(cloneTemplate(templateFormContacts), events);
  const successView = new Success(cloneTemplate(templateSuccess), events);


  //КАТАЛОГ-----------------------------------------------------------------------------------------//

  //catalog:changed каталог загружается (инициализация) (1)
  events.on<{ items: IProduct[] }>('catalog:changed', ({ items }) => {
  const cards = items.map((product) => {
    const card = new CardCatalog(cloneTemplate(templateCardCatalog), events);
    return card.render(product);
  });
  gallery.catalog = cards;
});

//пользователь выбирает карточку, сохраняется выбранный товар как “текущий”.card:select (2)
events.on<{ id: string }>('card:select', ({id}) => {
  const product = catalog.getItemById(id);
  if (!product) return;
  catalog.setSelectedItem(product)
})

//Открытие превью карточки catalog:item-selected' 
events.on('catalog:item-selected', () => {
  const product = catalog.getSelectedItem();
  if(!product) return;

  //есть ли товар в корзине?
  const inCart =cart.hasCartItem(product);
  let buttonText = '';
  let buttonDisabled = false;
  if (product.price) {
    buttonText = inCart ? 'Удалить из корзины' : 'Купить';
  } else {
    buttonText = 'Недоступно';
    buttonDisabled = true;
  }
  modal.content = previewView.render({...product, buttonText});
  previewView.buttonDisabled = buttonDisabled; //состояние кнопки
  modal.open();
  (modal as any).currentView = "preview";
});

//КОРЗИНА----------------------------------------------------------------------------------------//

//Логика кнопки “Купить / Удалить из корзины” 'product:button-click' (4)
events.on<{ id: string }>('product:button-click', ({ id }) => {
  const product = catalog.getItemById(id);
  if (!product) return;

  const inCart = cart.hasCartItem(product);

  if (inCart) {
    cart.removeCartItem(product);
  } else {
    cart.addCartItem(product);
  }

  // находим открытую карточку превью
  if ((modal as any).currentView === "preview") {
    previewView.buttonText = inCart ? 'Купить' : 'Удалить из корзины';
    previewView.buttonDisabled = !product.price; //елси нет цены нельзя купить
  }
});

//Удаление товара из корзины cart:remove 
events.on<{ id: string }>('cart:remove', ({ id }) => {
  const product = cart.getCartItems().find(item => item.id === id);
  if (!product) return;
  cart.removeCartItem(product);
});


//Открытие корзины basket:open 
events.on('basket:open', () => {
  const basketItems = cart.getCartItems().map((product, index) =>{
    const itemEl = cloneTemplate(templateCardBasket);
    const card = new CardBasket(itemEl, events);
    return card.render({...product, index: index + 1});
  })
  basketView.basket = {
    items: basketItems,
    total: cart.getCartTotal(),
  }

  modal.content = basketView.render()
  modal.open();
  // Помечаем, что сейчас открыта корзина (чтобы обновлять live)
  (modal as any).currentView = "basket";
})

//Когда корзина изменилась
events.on('cart:changed', () => {
  header.counter = cart.getCartCount();

  if ((modal as any).currentView === "basket") {
    const basketItems = cart.getCartItems().map((product, index) => {
      const itemEl = cloneTemplate(templateCardBasket);
      const card = new CardBasket(itemEl, events);
      return card.render({ ...product, index: index + 1 });
    });
    basketView.basket = {
      items: basketItems,
      total: cart.getCartTotal(),
    };
    modal.content = basketView.render()
  }
  })

// Оформление заказа
//клик по кнопке оформить в корине
events.on("basket:checkout", () => {
  modal.content = orderFormView.render();
  modal.open();
  (modal as any).currentView = "order";
});


// Переход на форму контактов
events.on("order:submit", () => {
  modal.content = contactsFormView.render();
  modal.open();
  (modal as any).currentView = "contacts";
});


//ФОРМЫ
//Реакция на ввод в формах
events.on<{ field: keyof IBuyer; value: string | null }>("form:change", ({ field, value }) => {
  buyer.setDataBuyer({ [field]: value ?? "" });
});

  // модель покупателя изменилась
events.on<IBuyer>("buyer:changed", (data) => {
  const errors = buyer.valiDataBuyer();

  // форма заказа
  
    orderFormView.address = data.address;
  orderFormView.payment = data.payment;
  const orderValid = !errors.address && !errors.payment;
  // показываем ошибки только если пользователь хоть что-то ввёл
  const orderTouched = !!data.address || !!data.payment;
  orderFormView.setValid(orderValid);
  orderFormView.setErrors(
    orderTouched && !orderValid
      ? [errors.address, errors.payment].filter(Boolean).join(", ")
      : null
  );
  

  // форма контактов
  
    contactsFormView.email = data.email;
  contactsFormView.phone = data.phone;
  const contactsValid = !errors.email && !errors.phone;
  // показываем ошибки только если хоть одно поле заполнено
  const contactsTouched = !!data.email || !!data.phone;
  contactsFormView.setValid(contactsValid);
  contactsFormView.setErrors(
    contactsTouched && !contactsValid
      ? [errors.email, errors.phone].filter(Boolean).join(", ")
      : null
  );
});

//  Отправка формы (контакты)
events.on("contacts:submit", () => {
    const order: IOrder = {
      ...buyer.getDataBuyer(),
      total: cart.getCartTotal(),
      items: cart.getCartItems().map(p => p.id),
    };

    // === Отправляем заказ на сервер ===
    api.postOrder(order)
      .then((response) => {
        successView.total = response.total;
        (modal as any).currentView = "success";
        modal.content = successView.render();
        modal.open();

        // очищаем корзину и покупателя
        cart.clearCart();
        buyer.clearDataBuyer();
        //header.counter = 0;
      })
      .catch((err) => {
        contactsFormView?.setErrors('Ошибка при отправке заказа');
        console.error('Ошибка при оформлении заказа:', err);
      });
  }
);


// ==========================
// 🔹 Обработка кнопки «За новыми покупками!»
// ==========================
events.on('success:close', () => {
  modal.close();          // закрываем модалку
  gallery.catalog = [];   // очищаем витрину (если нужно перерисовать)
  api.getProducts().then((data) => {
    const updated = data.items.map(item => ({
      ...item,
      image: item.image ? item.image.replace(/\.svg$/i, '.png') : item.image
    }));
    catalog.setItems(updated); // заново подгружаем каталог
  });
});

// === Загружаем товары из API ===
api.getProducts()
  .then((data) => {
    // Меняем расширение .svg → .png для всех товаров
    const updatedItems = data.items.map(item => ({
      ...item,
      image: item.image ? item.image.replace(/\.svg$/i, '.png') : item.image
    }));

    catalog.setItems(updatedItems);
  })
  .catch((err) => {
    console.error('Не удалось загрузить каталог:', err);
  });


