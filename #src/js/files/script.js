/* ------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------- Обработчик нажатия для тачскринов после загрузки страницы ------------------------------ */
/* ------------- Actions - делегивание события click. e - event. Получаем объект при клике и обрабатываем его ------------- */
/* --------------------- isMobile.any возвращает true, если сайт просматривать с мобилки с тачскрином --------------------- */
/* ---------------- После выполнения условий, получаем ближайшего родителя и меняем классы: нажат/не нажат ---------------- */
/* ------------------ А потом пишем обработку, которая закрывает все подменю по событию клика в пустоту ------------------- */
/* ------------------------------------------------------------------------------------------------------------------------ */

window.onload = function () {
  document.addEventListener("click", documentActions);

  function documentActions (e) {
    const targetElement = e.target;

    if (window.innerWidth > 768 && isMobile.any()) {
      if (targetElement.classList.contains('menu__arrow')) {
        targetElement.closest('.menu__item').classList.toggle('_hover');
        console.log('The user clicked on the arrow from a mobile device. Object "menu__item" assigned class _hover');
      }
      // проверяю на клик в пустоту. дословно : проверяю, есть ли вообще объекты с классом _hover.
      if (!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0) {
        // Если есть, то пишется функция, которая берёт коллекцию и удаляет выбранный класс у выбранных объектов из коллекции
        _removeClasses(document.querySelectorAll('.menu__item._hover'), "_hover");
      }
    }
    if (targetElement.classList.contains('search-form__icon')) {
      // console.log ('работает поиск');
      document.querySelector('.search-form').classList.toggle('_active');
    }
    // проверяю на клик в пустоту. снова тоже самое: если объект, по которому мы кликнули не содержит родителя .search-form, то выбираем потомка с классом _active и удаляем класс _active
    else if (!targetElement.closest('.search-form') && document.querySelector('.search-form._active')) {
      document.querySelector('.search-form').classList.remove('_active');
    }
  }
}
