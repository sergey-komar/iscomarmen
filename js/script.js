'use strict';

// МЕНЮ БУРГЕР

const topBlock = document.querySelector('.top-block');
const menuIcon = document.querySelector('.header__icon');
const subMenu = document.querySelector('.sub-menu');

document.addEventListener('click', function (e) {
	if (!e.target.closest('.sub-menu') && !e.target.closest('.header__icon')) {
		subMenu.classList.remove('_active');
		menuIcon.classList.remove('_active');
	}
});

document.addEventListener('scroll', function () {
	if (scrollY > topBlock.offsetHeight) {
		menuIcon.classList.add('_visible');
	} else {
		menuIcon.classList.remove('_visible');
		menuIcon.classList.remove('_active');
		subMenu.classList.remove('_active');
	}
});

if (menuIcon) {
	menuIcon.addEventListener('click', function (e) {
		menuIcon.classList.toggle('_active');
		subMenu.classList.toggle('_active');
	});
};


// Маска для Инпута
var element = document.getElementById('input-mask');
var element2 = document.getElementById('input-mask2');
var maskOptions = {
	mask: '+{7}(000)000-00-00'
};
var mask = IMask(element, maskOptions);
var mask2 = IMask(element2, maskOptions);

// прокрутка до нужного раздела при клике

const menuLinks = document.querySelectorAll('a[data-goto]');

if (menuLinks.length > 0) {
	menuLinks.forEach(menuLink => {
		menuLink.addEventListener('click', onMenuLinkClick);
	});

	function onMenuLinkClick(e) {
		const menuLink = e.target;
		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
			const gotoBlock = document.querySelector(menuLink.dataset.goto);
			const gotoBlockValue = gotoBlock.getBoundingClientRect().top + scrollY;

			if (menuIcon.classList.contains('_active')) {
				menuIcon.classList.remove('_active');
				subMenu.classList.remove('_active');
			}

			window.scrollTo({
				top: gotoBlockValue,
				behavior: 'smooth',
			});
			e.preventDefault();
		};

	}
};

// ТАБЫ

const tabItem = document.querySelectorAll('.tabs__item');
const tabBody = document.querySelectorAll('.tabs__block');

if (tabItem && tabBody) {
	for (let i = 0; i < tabItem.length; i++) {
		tabItem[i].addEventListener("click", function (e) {
			e.preventDefault();
			let activeTabAttr = e.target.getAttribute("data-tab");

			for (let j = 0; j < tabItem.length; j++) {
				let contentAttr = tabBody[j].getAttribute("data-tab-content");

				if (activeTabAttr === contentAttr) {
					tabItem[j].classList.add("_active");
					tabBody[j].classList.add("_active");
				} else {
					tabItem[j].classList.remove("_active");
					tabBody[j].classList.remove("_active");
				}
			};
		});
	};
};

// POPUP

const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding'); // фиксированные объекты
const popupBtnOrder = document.querySelector('.popup__btn_order'); // кнопка заказать в попапе
const popup = document.querySelector('.popup');

let unlock = true; // блочим повторное нажатие на ссылку попапа, пока он открывается

const timeout = 800; // таже цифра что и в транзишн

// вешаем обработчик на линк отсылающий на попап
if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener('click', function (e) {
			const currentPopup = document.querySelector('.popup');
			popupOpen(currentPopup);
			e.preventDefault();
		})
	}
};

// закрытие popup по клику на иконку закрытия
const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.popup')); // ближайший класс .popup
			e.preventDefault();
		})
	}
};

// функция открытия
function popupOpen(currentPopup) {
	if (currentPopup && unlock) {
		const popupActive = document.querySelector('.popup.open');
		// если есть открытый попап и попап находится в нем, мы оставляем бадилок
		if (popupActive) {
			popupClose(popupActive, false);
		} else {
			bodyLock();
		}
		currentPopup.classList.add('open');
		currentPopup.addEventListener('click', function (e) {
			if (!e.target.closest('.popup__content')) { // при клике на попап контент ничего не произойдет, если клик выше попап закроется
				popupClose(e.target.closest('.popup'));
			}
		});
	}
};

// функция закрытия
// если есть открытый попап и попап находится в нем, мы оставляем бадилок
function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open');
		if (doUnlock) {
			bodyUnlock();
		}
	}
}

// блокируем сролл бади при открытом попапе
function bodyLock() {
	// избегаем сдвиг контента, скрываем скролл. при открытии попапа.
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

	if (lockPadding.length > 0) {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = lockPaddingValue;
		}
	}
	body.style.paddingRight = lockPaddingValue;
	body.classList.add('lock');

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
};

// анлок бади + лок скролла на время, чтоб не дергался попап
function bodyUnlock() {
	setTimeout(function () {
		if (lockPadding.length > 0) {
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = '0px';
			}
		}
		body.style.paddingRight = '0px';
		body.classList.remove('lock');
	}, timeout);

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
};

// закрытие попапа по ескейп

document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape') {
		const popupActive = document.querySelector('.popup.open');
		popupClose(popupActive);
	}
});

// закрытие по клику на кнопку заказать

popupBtnOrder.addEventListener('click', function (e) {
	popupClose(popup);
});

// полифилы - подгоняют параметры под старые браузеры. 
(function () {
	// проверяем поддержку
	if (!Element.prototype.closest) {
		// реализуем
		Element.prototype.closest = function (css) {
			var node = this;
			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}
})();

(function () {
	// проверяем поддержку
	if (!Element.prototype.matches) {
		// определяем свойства
		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector;
	}
})();

// ДИНАМИЧЕСКИЙ ПЕРЕБРОС ЭЛЕМЕНТОВ

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max"); // min и max
da.init();

// Заявка

const connectBtn = document.querySelector('.connect__btn');
const connectOverlay = document.querySelector('.connect__overlay')
const connectForm = document.querySelector('.connect form');
const inputName = document.querySelector('.connect__name');

const footerBtn = document.querySelector('.footer__btn-mini');
const footerOverlay = document.querySelector('.footer__overlay')
const footerForm = document.querySelector('.footer form');

connectBtn.addEventListener('click', function (e) {
	e.preventDefault();
	if (inputName.value.length > 1 && element.value.length == 16) {
		connectForm.classList.add('_hidden');
		connectOverlay.classList.add('_active');
	}
});

footerBtn.addEventListener('click', function (e) {
	e.preventDefault();
	if (element2.value.length == 16) {
		footerForm.classList.add('_hidden');
		footerOverlay.classList.add('_active');
	}
});