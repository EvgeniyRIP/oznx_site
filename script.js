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
    
    if (!carousel || !prevBtn || !nextBtn || !dotsContainer) return;
    
    const cards = Array.from(carousel.querySelectorAll('.service-card'));
    const cardCount = cards.length;
    let currentPage = 0;
    let cardsPerPage = getCardsPerPage();
    let totalPages = Math.ceil(cardCount / cardsPerPage);
    
    // Создаем точки навигации
    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToPage(i));
        dotsContainer.appendChild(dot);
    }
    
    // Инициализация состояния кнопок
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
    
    // Перейти на указанную страницу
    function goToPage(pageIndex) {
        currentPage = pageIndex;
        const offset = -pageIndex * cardsPerPage * (carousel.scrollWidth / cardCount);
        carousel.style.transform = `translateX(${offset}px)`;
        
        // Обновить активную точку
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === pageIndex);
        });
        
        updateButtonState();
    }
    
    // Обновить состояние кнопок
    function updateButtonState() {
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === totalPages - 1;
    }
    
    // Получить количество карточек на странице в зависимости от ширины экрана
    function getCardsPerPage() {
        const width = window.innerWidth;
        if (width <= 576) return 1;
        if (width <= 992) return 2;
        if (width <= 1200) return 3;
        return 4;
    }
    
    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
        const newCardsPerPage = getCardsPerPage();
        
        if (newCardsPerPage !== cardsPerPage) {
            cardsPerPage = newCardsPerPage;
            totalPages = Math.ceil(cardCount / cardsPerPage);
            
            // Обновить точки навигации
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToPage(i));
                dotsContainer.appendChild(dot);
            }
            
            // Сбросить текущую страницу
            currentPage = 0;
            goToPage(0);
            updateButtonState();
        }
    });
    
    // Инициализация свайпа для мобильных устройств
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

    // Создаем анимацию для фона героя
    const hero = document.querySelector('.hero');
    if (hero) {
        let particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        hero.appendChild(particlesContainer);
        
        // Создаем частицы
        for (let i = 0; i < 50; i++) {
            let particle = document.createElement('div');
            particle.className = 'particle';
            
            // Рандомные стили для частиц
            particle.style.width = Math.random() * 5 + 'px';
            particle.style.height = particle.style.width;
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = Math.random() * 100 + 'vh';
            particle.style.animationDuration = Math.random() * 15 + 5 + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            
            // Определяем цвет (фиолетовый или голубой)
            let color = Math.random() > 0.5 ? 'var(--neon-purple)' : 'var(--neon-blue)';
            particle.style.backgroundColor = color;
            particle.style.boxShadow = '0 0 10px ' + color;
            
            particlesContainer.appendChild(particle);
        }

        // Добавляем стили для частиц
        let style = document.createElement('style');
        style.innerHTML = `
        .particles-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 1;
        }
        
        .particle {
            position: absolute;
            border-radius: 50%;
            opacity: 0.5;
            pointer-events: none;
            animation: float linear infinite;
        }
        
        @keyframes float {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.5;
            }
            90% {
                opacity: 0.5;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
        `;
        document.head.appendChild(style);
    }
});
