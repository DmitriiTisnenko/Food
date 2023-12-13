'use strict';

window.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsParent = document.querySelector('.tabheader__items'),
        tabContent = document.querySelectorAll('.tabcontent');

        // Tabs
    function hideTabsContent () {
        tabContent.forEach((item, i) => {
            item.style.display = 'none';
            tabs[i].classList.remove('tabheader__item_active');
        });
    }

    function showTabsContent (i = 0) {
        tabs[i].classList.add('tabheader__item_active');
        tabContent[i].style.display = 'block';
    }

    hideTabsContent();
    showTabsContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target; 

        if(target && target.matches('.tabheader__item')) {
            tabs.forEach((item, i) => {
                if(target == item) {
                    hideTabsContent();
                    showTabsContent(i);
                }
            });
        }
    });

    // Timer
    const deadline = '2023-03-22'; // deadline time
    // расчет оставшегося времени
    function getTimeRemaining(endtime) {
        let days, hours, minutes, seconds;
        const timeDifference = Date.parse(endtime) - Date.parse(new Date());
        if(timeDifference <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else { 
            days = Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
            hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24),//остаток рез-та '/' общего кол-ва часов на 24
            minutes = Math.floor((timeDifference / (1000 * 60)) % 60),
            seconds = Math.floor((timeDifference / 1000) % 60);

        }
            return {
               'total': timeDifference,
               'days': days,
               'hours': hours,
               'minutes': minutes,
               'seconds': seconds
            };
    }

    // функция для добавления нуля, если значение в таймере < 10
    function getZero(num) {
        if(num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }
    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timerInterval = setInterval(updateClock, 1000);
//first call of updateClock to cancel 1 sec delay from timerInterval - can see basic countdown numbers from index.html
        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);
            
            if(t.total <= 0) {
                clearInterval(timerInterval);
            }
        }

    }
    setClock('.timer', deadline);

    // Modal
    const modalBtns = document.querySelectorAll('[data-modal]'),
        modalClose = document.querySelector('[data-close]'),
        modalWindow = document.querySelector('.modal');

    function showModal() {
        modalWindow.classList.add('modal__active');
        document.querySelector('body').style.overflow = 'hidden';
        clearInterval(modalTimerID);
    }
    // show modal by timer
    const modalTimerID = setTimeout(showModal, 3000000);
    // show modal then user achieved end of the page (- 1 'px' for some browsers bugs, which can break script)
    function showModalByScroll() {
        if(window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            showModal();
            window.removeEventListener('scroll', showModalByScroll); //clear listener after a single use
        } 
    }
    window.addEventListener('scroll', showModalByScroll);

    modalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            showModal();
        });    
    });
    // function to remove active class and clean overflow - it affords to relive scroll, when modal is closed
    function closeModal() {
        modalWindow.classList.remove('modal__active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    // close modal by click to overlay
    modalWindow.addEventListener('click', (e) => {
        if(e.target === modalWindow) {
            closeModal();
        }
    });
    // close modal window by press ESC
    document.addEventListener('keydown', (e) => {
        if(e.code === 'Escape' && modalWindow.classList.contains('modal__active')) {
            closeModal();
        }
    });
    // Создаем карточки меню при помощи классов
    
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.classes = classes
            this.changePrice()
        }
        changePrice() {
            this.price = this.price * 80
        }
        render() {
            const div = document.createElement('div')
            if(this.classes.length === 0) {
                div.classList.add('menu__item')
            } else {
                this.classes.forEach(someClass => {
                    div.classList.add(someClass)
                })
            }
            div.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div>
            `;
            this.parent.append(div);
        };
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        8,
        ".menu .container"
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        20,
        ".menu .container"
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        12,
        ".menu .container"
    ).render();
});

