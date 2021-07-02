/* ------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------- Обработчик нажатия для тачскринов после загрузки страницы ------------------------------ */
/* ------------- Actions - делегивание события click. e - event. Получаем объект при клике и обрабатываем его ------------- */
/* --------------------- isMobile.any возвращает true, если сайт просматривать с мобилки с тачскрином --------------------- */
/* ---------------- После выполнения условий, получаем ближайшего родителя и меняем классы: нажат/не нажат ---------------- */
/* ------------------ А потом пишем обработку, которая закрывает все подменю по событию клика в пустоту ------------------- */
/* ------------------------------------------------------------------------------------------------------------------------ */

window.onload = function () {
  document.addEventListener("click", documentActions);
  document.addEventListener("touchstart", deleteParallax);

  function documentActions (e) {
    const targetElement = e.target;

    if (window.innerWidth > 768 && isMobile.any()) {
      if (targetElement.classList.contains('menu__arrow')) {
        targetElement.closest('.menu__item').classList.toggle('_hover');
        // console.log('The user clicked on the arrow from a mobile device. Object "menu__item" assigned class _hover');
      }
      // проверяю на клик в пустоту. дословно : проверяю, есть ли вообще объекты с классом _hover.
      if (!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0) {
        // Если есть, то пишется функция, которая берёт коллекцию и удаляет выбранный класс у выбранных объектов из коллекции
        _removeClasses(document.querySelectorAll('.menu__item._hover'), "_hover");
      }
    }
    if (targetElement.classList.contains('search-form__icon')) {
      document.querySelector('.search-form').classList.toggle('_active');
    }
    // проверяю на клик в пустоту. снова тоже самое: если объект, по которому мы кликнули не содержит родителя .search-form, то выбираем потомка с классом _active и удаляем класс _active
    else if (!targetElement.closest('.search-form') && document.querySelector('.search-form._active')) {
      document.querySelector('.search-form').classList.remove('_active');
    }
    /* ---------------------- Отслеживаем нажатие на Show More и вызываем функцию getProducts, описанную ниже по коду --------------- */
		if (targetElement.classList.contains('products__more')) {
			getProducts(targetElement);
			e.preventDefault();
		}
    /* ---------------------- Отслеживаем нажатие на Add to cart и вызываем функцию addToCart, описанную ниже по коду --------------- */
		if (targetElement.classList.contains('actions-product__button')) {
			const productId = targetElement.closest('.item-product').dataset.pid;
			addToCart(targetElement, productId);
			e.preventDefault();
		}

    /* ---------------------- Отслеживаем нажатие на Add to cart и вызываем функцию editLabel, описанную ниже по коду --------------- */
		if (targetElement.classList.contains('actions-product__button')) {
			editLabel(targetElement);
		}
    /* ---------------------- Отслеживаем нажатие на иконку корзины/клик в пустоту/клик на кнопку add to cart.  --------------- */
    /* ---------------------- При клике на кнопку add to cart при открытой корзине, она не закроется, а обновится --------------- */
    if (targetElement.classList.contains('cart-header__icon') || targetElement.closest('.cart-header__icon')) {
      if (document.querySelector('.cart-list').children.length > 0) {
        document.querySelector('.cart-header').classList.toggle('_active');
      }
      e.preventDefault();
		} else if (!targetElement.closest('.cart-header') && !targetElement.classList.contains('actions-product__button')) {
      document.querySelector('.cart-header').classList.remove('_active');
    }
    /* ---------------------- Отслеживаем нажатие на ссылку удаления товара из корзины по клику на delete --------------- */
    // ----------- После получения cart-list__delete, обращаемся к нему и получаем родителя этого объекта с классом cart-list__item и получаем его id
    // ----------- Передаём в функцию updateCart нажатый объект и его родителя с его идентификатором. False означает, что мы не добавляем, а удаляем
    if (targetElement.classList.contains('cart-list__delete')) {
      const productId = targetElement.closest('.cart-list__item').dataset.cartPid;
      updateCart(targetElement, productId, false);
      e.preventDefault();
		}
    /* ---------------------- Отслеживаем нажатие на ссылку удаления товара из корзины по клику на Delete all items --------------- */
    // ----------- После получения cart-list__delete, обращаемся к нему и получаем родителя этого объекта с классом cart-list__item и получаем его id
    // ----------- Передаём в функцию updateCart нажатый объект и его родителя с его идентификатором. False означает, что мы не добавляем, а удаляем
    if (targetElement.classList.contains('cart-list__delete-items')) {
      const productId = targetElement.closest('.cart-list__item').dataset.cartPid;
      updateCart(targetElement, productId, false);
      e.preventDefault();
    }
  }

/* ----------------------------------------------------------------------------------------------------------------------------------------- */
/* ----------------------------- https://developer.mozilla.org/ru/docs/Web/API/Intersection_Observer_API ----------------------------------- */
/* ----------------------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------- Обработчик скролла страницы. Нужен чтобы отслеживать изменения и добавлять классы к .header ---------------------- */
/* ----- Intersection Observer наблюдает и возвращает true, когда выбранный объект ПОЛНОСТЬЮ пересекается с областью видимости браузера ---- */
/* --------------------------------- Область видимости браузера по умолчанию обозначается как root: null ----------------------------------- */
/* ------------------------------ Целевой элемент, за которым будет происходить наблюдение - headerElement. -------------------------------- */
/* -------- Для корректной работы функции, нужно задать размеры целевого объекта, в данном случае это .header { min-height: 40px; } -------- */
/* ------- При пересечении области видимости с элементом вызывается функция callback, которая добавляет класс .scroll, если его нет -------- */
/* --------------------------------------------------------- и удаляет, если есть. --------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------------------------------------------- */

const headerElement = document.querySelector ('.header');

const callback = function(entries, observer) {
  if (entries[0].isIntersecting) {
    headerElement.classList.remove ('_scroll');
  } else {
    headerElement.classList.add ('_scroll');
  }
};

const headerObserver = new IntersectionObserver(callback);
headerObserver.observe(headerElement);

// Вывод в консоль изменений состояния целевого элемента
// setInterval(function(){
//   console.log("Сейчас целевой элемент имеет классы:", headerElement.classList.value);
// }, 500);

/* ---------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* ------------ Обработчик свайпа на устройствах с тачскрином. Нужен чтобы отслеживать изменения и убирать/добавлять что-либо на мобильных устройствах ------------ */
/* ---------- Дословно: получаю коллекцию объектов с классом .slider-main__content, затем проверяю разрешение экрана на соответствие мобильному девайсу ----------- */
/* ------------------------------ После этого циклом forEach просмартиваю каждый элемент и помещаю в массив и выбираю из них атрибуты ----------------------------- */
/* ------- После этого в теле цикла создаю функцию swipeAttributes, которая из каждого элемента массива с атрибутами удаляет атрибут data-swiper-parallax-x ------- */
/* ---------------------------------------------------------------------------------------------------------------------------------------------------------------- */

  const parallaxElement = document.querySelectorAll (".slider-main__content, .slider-rooms__content");
  const parallaxArray = Array.prototype.slice.call(parallaxElement);
  console.log(parallaxArray);

    function deleteParallax () {
    if (window.innerWidth < 768 && isMobile.any()) {
/* ----------------------- Удаляю параллакс эффект, дабы не замедлять страницу на мобилках ------------------------- */
      parallaxArray
        .forEach(el => Array
        .from(el.attributes)
        .forEach(swipeAttributes => el.removeAttribute("data-swiper-parallax-y")) &
      parallaxArray
        .forEach(el => Array
        .from(el.attributes)
        .forEach(swipeAttributes => el.removeAttribute("data-swiper-parallax-x"))
      ));
    }
  }


  // if (parallaxElement.hasAttribute("data-swiper-parallax-x")) {
  //   console.log('zaebok');
    // d.setAttribute("align", "center");
  // }




//   const parallaxElement = document.querySelectorAll (".slider-main__content, .slider-rooms__content");
//   const parallaxArray = Array.prototype.slice.call(parallaxElement);
//   var parallaxAttrs = parallaxElement.hasAttributes('data-swiper-parallax-x');
//   console.log(parallaxAttrs);

//   function deleteParallax () {
//     if (window.innerWidth < 768 && isMobile.any()) {
// /* ----------------------- Удаляю параллакс эффект, дабы не замедлять страницу на мобилках ------------------------- */
//       parallaxArray
//         .forEach(el => Array
//         .from(el.attributes)
//         .forEach(swipeAttributes => el.removeAttribute("data-swiper-parallax-x"))
//       );
//     }
//   }


  function clearDataAttributes(el){
    if (el.hasAttributes()) {
        var attrs = el.attributes;
        var thisAttributeString = "";
        for(var i = attrs.length - 1; i >= 0; i--) {
            thisAttributeString = attrs[i].name + "-" + attrs[i].value;
            el.removeAttribute(thisAttributeString);
        }
    }
}

// , .slider-rooms__content
  // const str = 'Быть или не быть вот в чём вопрос.';
  // console.log(str.includes(''));       // true


/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* ----------------------------- 1. Обработчик нажатия на кнопку Show More. Получаем саму кнопку при нажатии. Этот пункт выше описан ----------------------------- */
/* ---------------------------------------------------- 2. Если у кнопки нет класса _hold, то добавляем его ------------------------------------------------------ */
/* -------- 3. Получаем путь к файлу json со всеми продуктами и их атрибутами, а дальше через fetch(file, {method: "GET"}) забираем в переменную сам файл -------- */
/* ----------------------- 4. Если файл НЕ находится в папке json и НЕ поместился в переменную response, то выводится ошибка наличия файла ----------------------- */
/* ------- 5. Если файл находится в папке json и поместился в переменную response, то помещаем содержимое response в result для работы функции loadProducts ------ */
/* ---- 6. После этого удаляем класс _hold у кнопки и дестроим саму кнопку, т.к. будет выведено содержимое json и она будет не нужна (нечего больше показать) ---- */
/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */

  async function getProducts(button) {
    if (!button.classList.contains('_hold')) {
      button.classList.add('_hold');
      const file = "json/products.json";
      let response = await fetch(file, {
        method: "GET"
      });
      if (response.ok) {
        let result = await response.json();
        loadProducts(result);
        button.classList.remove('_hold');
        button.remove();
      } else {
        alert ("Нет файла json, проверьте путь к файлу");
      }
    }

/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* ---- Загрузчик контента на страницу. Самый геморройный блок кода загрузки товаров, т.к. некоторые переменные - массивы и просто так в html не встроить -------- */
/* ------------ Для формирования шаблона карточки товара был взят оригинальный код html из article class="products__item" и разбит на составные части ------------ */
/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */

  function loadProducts(data) {
    const productsItems = document.querySelector('.products__items');

      data.products.forEach(item => {
        const productId = item.id;
        const productUrl = item.url;
        const productImage = item.image;
        const productTitle = item.title;
        const productText = item.text;
        const productPrice = item.price;
        const productOldPrice = item.priceOld;
        const productShareUrl = item.shareUrl;
        const productLikeUrl = item.likeUrl;
        const productLabels = item.labels;

        let productTemplateStart = `<article data-pid="${productId}" class="products__item item-product">`;
        let productTemplateEnd = `</article>`;

        let productTemplateLabels = '';
        if (productLabels) {
          let productTemplateLabelsStart = `<div class="item-product__labels">`;
          let productTemplateLabelsEnd = `</div>`;
          let productTemplateLabelsContent = '';

          productLabels.forEach(labelItem => {
            productTemplateLabelsContent += `<div class="item-product__label item-product__label_${labelItem.type}">${labelItem.value}</div>`;
          });

          productTemplateLabels += productTemplateLabelsStart;
          productTemplateLabels += productTemplateLabelsContent;
          productTemplateLabels += productTemplateLabelsEnd;
        }

        let productTemplateImage = `
          <a href="${productUrl}" class="item-product__image _ibg">
            <img src="img/products/${productImage}" alt="${productTitle}">
          </a>
        `;

        let productTemplateBodyStart = `<div class="item-product__body">`;
        let productTemplateBodyEnd = `</div>`;

        let productTemplateContent = `
          <div class="item-product__content">
            <h3 class="item-product__title">${productTitle}</h3>
            <div class="item-product__text">${productText}</div>
          </div>
        `;

        let productTemplatePrices = '';
        let productTemplatePricesStart = `<div class="item-product__prices">`;
        let productTemplatePricesCurrent = `<div class="item-product__price">Rp ${productPrice}</div>`;
        let productTemplatePricesOld = `<div class="item-product__price item-product__price_old">Rp ${productOldPrice}</div>`;
        let productTemplatePricesEnd = `</div>`;

        productTemplatePrices = productTemplatePricesStart;
        productTemplatePrices += productTemplatePricesCurrent;

        /* ------------ Если в карточке указана старая цена (есть в article), то оки - добавляем. Если нет - не добавляем ------------ */
        if (productOldPrice) {
          productTemplatePrices += productTemplatePricesOld;
        }
        productTemplatePrices += productTemplatePricesEnd;

        let productTemplateActions = `
          <div class="item-product__actions actions-product">
            <div class="actions-product__body">
              <a href="" class="actions-product__button btn btn_white _icon-checkmark">Add to cart</a>
              <a href="${productShareUrl}" class="actions-product__link _icon-share">Share</a>
              <a href="${productLikeUrl}" class="actions-product__link _icon-favorite">Like</a>
            </div>
          </div>
        `;

/* ------------ Сборщик карточки ------------ */
        let productTemplateBody = '';
        productTemplateBody += productTemplateBodyStart;
        productTemplateBody += productTemplateContent;
        productTemplateBody += productTemplatePrices;
        productTemplateBody += productTemplateActions;
        productTemplateBody += productTemplateBodyEnd;

        let productTemplate = '';
        productTemplate += productTemplateStart;
        productTemplate += productTemplateLabels;
        productTemplate += productTemplateImage;
        productTemplate += productTemplateBody;
        productTemplate += productTemplateEnd;

        productsItems.insertAdjacentHTML('beforeend', productTemplate);
      });
    }
  }

/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* ---- 1. Обработчик нажатия на кнопку Add to cart. Получаем саму кнопку при нажатии (код написан выше) -------------------------------- */
/* ----------------------------------------------- 2. Если у кнопки нет класса _hold, то добавляем его и класс _fly ---------------------------------------------- */
/* -------------------------- 3. Получаем иконку с корзиной. 4. Получаем конкретный товар по его $pid. 5. Получаем картинку товара $pid. ------------------------- */
/* --------- 6. Для анимации полёта картики товара в корзину получаем её из ранее созданной переменной и клонируем в новую переменную с помощью cloneNode -------- */
/* ------------ 7. Получаем геометрию и координаты оригинальной картинки и применяем параметры оригинальной картинки к клону (позиция и геометрия): -------------- */
/* ---- 7.1. Добавляем новые классы _flyImage _ibg клону productImageFly ----------------------------------------------------------------------------------------- */
/* ---- 7.2. Присваиваем CSS-свойства и их атрибуты клону productImageFly ---------------------------------------------------------------------------------------- */
/* ---- 7.3. Получаем позицию корзины ---------------------------------------------------------------------------------------------------------------------------- */
/* ---- 7.4. Присваиваем CSS-свойства и их атрибуты клону productImageFly, меняя значения ранее созданных переменных на те, что получили от иконки корзины --------*/
/* ---- 7.5. Добавляем дополнительные атрибуты и свойства width: 0px; height: 0px; opacity:0; для трансформации клона в полёте ----------------------------------- */
/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */

  function addToCart(productButton, productId) {
    if (!productButton.classList.contains('_hold')) {
      productButton.classList.add('_hold');
      productButton.classList.add('_fly');

      const cart = document.querySelector('.cart-header__icon');
      const product = document.querySelector(`[data-pid="${productId}"]`);
      const productImage = product.querySelector('.item-product__image');

      const productImageFly = productImage.cloneNode(true);

      const productImageFlyWidth = productImage.offsetWidth;
      const productImageFlyHeight = productImage.offsetHeight;
      const productImageFlyTop = productImage.getBoundingClientRect().top;
      const productImageFlyLeft = productImage.getBoundingClientRect().left;

      productImageFly.setAttribute('class', '_flyImage _ibg');
      productImageFly.style.cssText =
      `
        left: ${productImageFlyLeft}px;
        top: ${productImageFlyTop}px;
        width: ${productImageFlyWidth}px;
        height: ${productImageFlyHeight}px;
      `;

      document.body.append(productImageFly);

      const cartFlyLeft = cart.getBoundingClientRect().left;
      const cartFlyTop = cart.getBoundingClientRect().top;

      productImageFly.style.cssText =
      `
        left: ${cartFlyLeft}px;
        top: ${cartFlyTop}px;
        width: 0px;
        height: 0px;
        opacity:0;
      `;

/* ---- Проверка: если у кнопки появляется класс _fly после окончания трансформации клона --------*/
      productImageFly.addEventListener('transitionend', function () {
        if (productButton.classList.contains('_fly')) {
          productImageFly.remove();
          updateCart(productButton, productId);
          productButton.classList.remove('_fly');
        }
      });
    }
  }

/* ---- Дабы пользователь не клацал без конца на кнопку, меняю текст ссылки --------*/
  function editLabel(caption) {
    let buttonLabel = caption.target;
    if (caption.innerHTML == "Add to cart")  {
      caption.innerHTML = "Added";
    };
  }

	// function clearCart(productId, productClear = true) {
  //   const cart = document.querySelector('.cart-header');
  //   const cartIcon = cart.querySelector('.cart-header__icon');
  //   const cartQuantity = cartIcon.querySelector('span');
	// 	const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
	// 	const cartList = document.querySelector('.cart-list');

  //   if (productClear) {
  //     if (cartQuantity) {
  //       cartQuantity.innerHTML = 0;
  //     }
  //     else {
  //       cartIcon.insertAdjacentHTML('beforeend', `<span>0</span>`);
  //     }
  //   }
  // }

	function updateCart(productButton, productId, productAdd = true) {
		const cart = document.querySelector('.cart-header');
		const cartIcon = cart.querySelector('.cart-header__icon');
		const cartQuantity = cartIcon.querySelector('span');
		const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
		const cartList = document.querySelector('.cart-list');

/* ---- Добавляем спан в конец, после cart-header__icon и инкрементом увеличиваем количество при новых кликах на add to cart -------- */
		if (productAdd) {
			if (cartQuantity) {
				cartQuantity.innerHTML = ++cartQuantity.innerHTML;
			} else {
				cartIcon.insertAdjacentHTML('beforeend', `<span>1</span>`);
			}
/* ---------------------------------------------------------------------------------------------------------------------------------- */
/* ---- Проверяем, существует ли в корзине добавленный товар cartProduct и, если нет, создаём: ----- */
/* ---- 1. Задаём все необходимые константы: название товара, изображение. Содержимое карточки формируем константой cartProductContent ----- */
/* ---------------------------------------------------------------------------------------------------------------------------------- */
    if (!cartProduct) {
      const product = document.querySelector(`[data-pid="${productId}"]`);
      const cartProductImage = product.querySelector('.item-product__image').innerHTML;
      const cartProductTitle = product.querySelector('.item-product__title').innerHTML;
      const cartProductContent = `
        <a href="" class="cart-list__image _ibg">${cartProductImage}</a>
        <div class="cart-list__body">
          <a href="" class="cart-list__title">${cartProductTitle}</a>
          <div class="cart-list__quantity">Quantity: <span>1</span></div>
          <a href="" class="cart-list__delete">Delete</a>
        </div>
        <div class="cart-list__controls">
          <a href="" class="cart-list__plus-item">Add one item</a>
          <a href="" class="cart-list__delete-items">Delete all items</a>
        <div>
      `;
			cartList.insertAdjacentHTML('beforeend', `<li data-cart-pid="${productId}" class="cart-list__item">${cartProductContent}</li>`);
		}
      else { // кнопка add to cart активна после единичного клика
        const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
        cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
      }
      productButton.classList.remove('_hold');

/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* ---- Обработчик удаления товаров из корзины.  -------- */
/* ------------ 1. Получаем количество товара в корзине, присваиваем число в константу cartProductQuantity ------------ */
/* ------------ 2. Декремент уменьшает количество товара на единицу ------------ */
/* ------------ 3. Если количество товара = 0, то удаляем товар из корзины ------------ */
/* ------------ 4. После того, как удалили прошлый товар, минусуем из общего числа товаров циферку декрементом из cartQuantityValue и обновляем спан ------------ */
/* ------------ 5. Если общее количество товара = 0, то удаляем спан и класс _active, что закроет корзину ------------ */
/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */

    } else {
      const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
      cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
      if (!parseInt(cartProductQuantity.innerHTML)) {
        cartProduct.remove();
      }

      const cartQuantityValue = --cartQuantity.innerHTML;
      if (cartQuantityValue) {
        cartQuantity.innerHTML = cartQuantityValue;
      } else {
        cartQuantity.remove();
        cart.classList.remove('_active');
      }

      // const cartQuantityValue = (cartQuantity - cartProductQuantity).innerHTML;
      // if (cartQuantityValue) {
      //   cartQuantity.innerHTML = cartQuantityValue;
      // } else {
      //   cartQuantity.remove();
      //   cart.classList.remove('_active');
      // }

    }

    /* ---- Увеличение количества товара на единицу. Расскоментить после добавления всех нужных кнопочек (+ и -) --------*/
    // if const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
    // cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;

    // if (targetElement.classList.contains('.cart-list__plus-item')) {
    //   const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
    //   addToCart(targetElement, productId);
    //   e.preventDefault();
    // }

  }



}
