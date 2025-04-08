document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const menuBtn = document.querySelector('.menu-btn');
    const menu = document.querySelector('.menu');
    
    menuBtn.addEventListener('click', function() {
        menu.classList.toggle('active');
    });

// Функция инициализации карусели сервисов
function initServiceCarousel() {
    const carousel = document.querySelector('.services-carousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!carousel || !dotsContainer) return;
    
    const cards = Array.from(carousel.querySelectorAll('.service-card'));
    const cardCount = cards.length;
    let currentPage = 0;
    let cardsPerPage = getCardsPerPage();
    let totalPages = Math.ceil(cardCount / cardsPerPage);
    
    // Настраиваем размеры карточек для мобильных устройств
    function setupMobileCardSizes() {
        if (window.innerWidth <= 768) {
            // Ширина видимой области карусели
            const containerWidth = carousel.parentElement.clientWidth;
            
            // Настраиваем ширину каждой карточки
            cards.forEach(card => {
                // Используем 90% от ширины контейнера для карточки, чтобы избежать показа следующей
                const cardWidth = containerWidth - 40; // 20px padding с каждой стороны
                card.style.minWidth = `${cardWidth}px`;
                card.style.width = `${cardWidth}px`;
            });
        } else {
            // Сбрасываем стили для десктопа
            cards.forEach(card => {
                card.style.minWidth = '';
                card.style.width = '';
            });
        }
    }
    
    // Вызываем функцию настройки сразу
    setupMobileCardSizes();
    
    // Создаем точки навигации
    createDots();
    
    // Инициализация состояния кнопок
    if (prevBtn && nextBtn) {
        updateButtonState();
        
        // Слушатели событий для кнопок
        prevBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                goToPage(currentPage - 1);
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages - 1) {
                goToPage(currentPage + 1);
            }
        });
    }
    
    // Функция создания точек навигации
    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToPage(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Перейти на указанную страницу
    function goToPage(pageIndex) {
        currentPage = pageIndex;
        
        // Для мобильных устройств используем прокрутку
        if (window.innerWidth <= 768) {
            const card = carousel.querySelectorAll('.service-card')[pageIndex];
            if (!card) return;
            
            // Прокручиваем до точного положения карточки
            const cardOffset = card.offsetLeft - 20; // Компенсируем левый отступ
            
            carousel.scrollTo({
                left: cardOffset,
                behavior: 'smooth'
            });
        } else {
            // Для десктопов используем transform
            const offset = -pageIndex * cardsPerPage * (carousel.scrollWidth / cardCount);
            carousel.style.transform = `translateX(${offset}px)`;
        }
        
        // Обновить активную точку
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === pageIndex);
        });
        
        if (prevBtn && nextBtn) {
            updateButtonState();
        }
    }
    
    // Обновить состояние кнопок
    function updateButtonState() {
        if (prevBtn) prevBtn.disabled = currentPage === 0;
        if (nextBtn) nextBtn.disabled = currentPage === totalPages - 1;
    }
    
    // Получить количество карточек на странице в зависимости от ширины экрана
    function getCardsPerPage() {
        const width = window.innerWidth;
        if (width <= 768) return 1; // Всегда только 1 карточка на мобильном
        if (width <= 992) return 2;
        if (width <= 1200) return 3;
        return 4;
    }
    
    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
        const newCardsPerPage = getCardsPerPage();
        
        // Настраиваем размеры карточек при изменении размера окна
        setupMobileCardSizes();
        
        if (newCardsPerPage !== cardsPerPage) {
            cardsPerPage = newCardsPerPage;
            totalPages = Math.ceil(cardCount / cardsPerPage);
            
            // Обновить точки навигации
            createDots();
            
            // Сбросить текущую страницу
            currentPage = 0;
            goToPage(0);
        }
    });
    
    // Инициализация скролла для мобильных устройств
    if (window.innerWidth <= 768) {
        // Отслеживаем скролл карусели для мобильных
        let isScrolling;
        carousel.addEventListener('scroll', () => {
            clearTimeout(isScrolling);
            
            // Определяем текущую страницу на основе скролла
            isScrolling = setTimeout(() => {
                const scrollPosition = carousel.scrollLeft;
                
                // Находим ближайшую карточку к текущей позиции скролла
                let minDistance = Infinity;
                let newPage = currentPage;
                
                cards.forEach((card, index) => {
                    const cardPosition = card.offsetLeft - 20; // Компенсируем левый отступ
                    const distance = Math.abs(scrollPosition - cardPosition);
                    
                    if (distance < minDistance) {
                        minDistance = distance;
                        newPage = index;
                    }
                });
                
                if (newPage !== currentPage && newPage >= 0 && newPage < totalPages) {
                    currentPage = newPage;
                    
                    // После завершения скролла выравниваем до ближайшей карточки
                    const card = cards[newPage];
                    const cardOffset = card.offsetLeft - 20;
                    
                    // Только если отклонение значительное
                    if (Math.abs(scrollPosition - cardOffset) > 10) {
                        carousel.scrollTo({
                            left: cardOffset,
                            behavior: 'smooth'
                        });
                    }
                    
                    // Обновить точки навигации
                    document.querySelectorAll('.dot').forEach((dot, index) => {
                        dot.classList.toggle('active', index === currentPage);
                    });
                }
            }, 100); // Немного увеличиваем задержку для более надежного определения
        });
    } else {
        // Инициализация свайпа для планшетов
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            const swipeThreshold = 50; // Минимальное расстояние для свайпа
            
            if (touchEndX < touchStartX - swipeThreshold) {
                // Свайп влево -> следующая страница
                if (currentPage < totalPages - 1) {
                    goToPage(currentPage + 1);
                }
            }
            
            if (touchEndX > touchStartX + swipeThreshold) {
                // Свайп вправо -> предыдущая страница
                if (currentPage > 0) {
                    goToPage(currentPage - 1);
                }
            }
        }
    }
}
    
    // Инициализация карусели сервисов
    initServiceCarousel();
    
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            menu.classList.remove('active');
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Добавляем класс к шапке при прокрутке
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Обработка отправки формы
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Простая валидация формы
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            if (nameInput.value.trim() === '' || emailInput.value.trim() === '' || messageInput.value.trim() === '') {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            // Имитация отправки формы
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
            
            setTimeout(() => {
                alert('Спасибо! Ваше сообщение успешно отправлено.');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 1500);
        });
    }
    
    // Анимация элементов при прокрутке
    const animateElements = document.querySelectorAll('.service-card, .gallery-item, .about-content');
    
    const checkVisibility = () => {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('fade-in');
            }
        });
    };
    
    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Проверяем при загрузке

    // Добавляем эффект неонового свечения для кнопок и элементов
    const glowElements = document.querySelectorAll('.glow-btn, .neon-card, .neon-border');
    
    glowElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.boxShadow = '0 0 20px var(--neon-purple), 0 0 40px var(--neon-purple)';
        });
        
        element.addEventListener('mouseleave', () => {
            // Возвращаем стандартные стили из CSS
            element.style.boxShadow = '';
        });
    });

    // Анимация для логотипа
    const logo = document.querySelector('.logo img');
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            logo.style.filter = 'drop-shadow(0 0 10px var(--neon-purple)) drop-shadow(0 0 20px var(--neon-purple))';
            logo.style.transform = 'scale(1.05)';
        });
        
        logo.addEventListener('mouseleave', () => {
            logo.style.filter = '';
            logo.style.transform = '';
        });
    }
});
