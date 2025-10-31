import "./scss/styles.scss";

import { ApiServise } from "./components/Models/ApiServise";
import { Catalog } from "./components/Models/Catalog";
import { Gallery } from "./components/Views/Gallery";
import { CardCatalog } from "./components/Views/Card/CardCatalog";
import { EventEmitter } from "./components/base/Events";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { API_URL } from "./utils/constants";
import { IOrder, IProduct } from "./types";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";
import { Header } from "./components/Views/Header";
import { Modal } from "./components/Views/Modal";
import { CardPreview } from "./components/Views/Card/CardPreview";
import { Basket } from "./components/Views/Basket";
import { FormOrder } from "./components/Views/Form/FormOrder";
import { FormContacts } from "./components/Views/Form/FormContacts";
import { Success } from "./components/Views/Success";

const events = new EventEmitter();
const api = new ApiServise(API_URL);
//модели
const catalog = new Catalog(events); //передала событие
const buyer = new Buyer();
//view
const cart = new Cart(events);
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const header = new Header(events, ensureElement<HTMLElement>('.header'));
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);


  const templateCardCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
  const templateCardPreview = ensureElement<HTMLTemplateElement>('#card-preview');
  const templateBasket = ensureElement<HTMLTemplateElement>('#basket');
  const templateFormOrder = ensureElement<HTMLTemplateElement>('#order');
  const templateFormContacts = ensureElement<HTMLTemplateElement>('#contacts');
  const templateSuccess = ensureElement<HTMLTemplateElement>('#success');
  const basketView = new Basket(cloneTemplate(templateBasket), events);

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

  const previewEl = cloneTemplate(templateCardPreview);
  const previewCard = new CardPreview(previewEl, events);

  //есть ли товар в корзине?
  const inCart =cart.hasCartItem(product);
  let buttonText;
  if (product.price) {
    buttonText = inCart ? 'Удалить из корзины' : 'Купить';
  } else {
    buttonText = 'Недоступно';
  }
  modal.content = previewCard.render({...product, buttonText});
  modal.open()
});

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
  const modalContent = document.querySelector('.card_full');
  if (modalContent) {
    const button = modalContent.querySelector<HTMLButtonElement>('.card__button');
    if (button) {
      button.textContent = inCart ? 'Купить' : 'Удалить из корзины';
    }
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
  basketView.basket = {
    items: cart.getCartItems(),
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
    basketView.basket = {
      items: cart.getCartItems(),
      total: cart.getCartTotal(),
    };
    modal.content = basketView.render()
  }
  })

// Оформление заказа
//клик по кнопке оформить в корине
events.on("basket:checkout", () => {
  const orderForm = new FormOrder(cloneTemplate(templateFormOrder), events);
  modal.content = orderForm.render();
});


// Переход на форму контактов
events.on("order:stepNext", () => {
  const contactsForm = new FormContacts(cloneTemplate(templateFormContacts), events);
  modal.content = contactsForm.render();
});


//Реакция на ввод в формах

events.on<{ field: string; value: string | null }>('form:change', ({ field, value }) => {
  // сохраняем данные в модель
  buyer.setDataBuyer({ [field]: value } as any);

  // находим текущую открытую форму
  const formEl = document.querySelector('form');
  if (!formEl) return;

  const isOrderForm = formEl.getAttribute('name') === 'order';
  const activeForm = isOrderForm
    ? new FormOrder(formEl as HTMLFormElement, events)
    : new FormContacts(formEl as HTMLFormElement, events);

  // проверяем все ошибки
  const errors = buyer.valiDataBuyer();

  // если форма заказа — проверяем только address и payment
  if (isOrderForm) {
    const hasAddressError = !!errors.address;
    const hasPaymentError = !!errors.payment;

    const isValid = !hasAddressError && !hasPaymentError;
    activeForm.setValid(isValid);
    activeForm.setErrors(isValid ? null : 'Укажите адрес и способ оплаты');
  }

  // если форма контактов — проверяем только email и phone
  if (!isOrderForm) {
    const hasEmailError = !!errors.email;
    const hasPhoneError = !!errors.phone;

    const isValid = !hasEmailError && !hasPhoneError;
    activeForm.setValid(isValid);
    activeForm.setErrors(isValid ? null : 'Укажите email и телефон');
  }
});

//  Отправка формы (контакты)
events.on('form:submit', () => {
  const formEl = document.querySelector('form');
  if (!formEl) return;

  const isOrderForm = formEl.getAttribute('name') === 'order';
  const isContactsForm = formEl.getAttribute('name') === 'contacts';

  // === Шаг 1. Форма заказа (способ оплаты + адрес)
  if (isOrderForm) {
    const activeForm = new FormOrder(formEl as HTMLFormElement, events);
    activeForm.setErrors(null); // очищаем ошибки

    const { address, payment } = buyer.getDataBuyer();

    if (address && payment) {
      events.emit('order:stepNext'); // переход на форму контактов
    } else {
      activeForm.setErrors('Укажите адрес и способ оплаты');
    }
    return;
  }

  // === Шаг 2. Форма контактов (email + телефон)
  if (isContactsForm) {
    const activeForm = new FormContacts(formEl as HTMLFormElement, events);
    activeForm.setErrors(null); // очищаем ошибки

    const { email, phone } = buyer.getDataBuyer();

    if (!email || !phone) {
      activeForm.setErrors('Укажите email и телефон');
      activeForm.setValid(false);
      return;
    }

    activeForm.setValid(true);

    const order: IOrder = {
      ...buyer.getDataBuyer(),
      total: cart.getCartTotal(),
      items: cart.getCartItems().map(p => p.id),
    };

    // === Отправляем заказ на сервер ===
    api.postOrder(order)
      .then(() => {
        const successEl = cloneTemplate(templateSuccess);
        const success = new Success(successEl, events);
        success.total = order.total; // отображаем сумму списания

         (modal as any).currentView = "success";
        modal.content = success.render();
        modal.open();

        // очищаем корзину и покупателя
        cart.clearCart();
        buyer.clearDataBuyer();
        header.counter = 0;
      })
      .catch((err) => {
        activeForm.setErrors('Ошибка при отправке заказа');
        console.error('Ошибка при оформлении заказа:', err);
      });
  }
});


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


