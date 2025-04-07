// Улучшения для мобильных устройств

// Обработка прелоадера
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Улучшенное мобильное меню
    const menuBtn = document.querySelector('.menu-btn');
    const menu = document.querySelector('.menu');
    const body = document.body;
    const menuLinks = menu.querySelectorAll('a');
    
    // Функция для открытия/закрытия меню
    function toggleMenu() {
        menu.classList.toggle('active');
        
        // Блокируем прокрутку страницы когда меню открыто
        if (menu.classList.contains('active')) {
            body.style.overflow = 'hidden';
            menuBtn.innerHTML = '<i class="fas fa-times"></i>'; // Меняем иконку на крестик
        } else {
            body.style.overflow = '';
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>'; // Меняем иконку обратно на бургер
        }
    }
    
    // Обработчик клика по кнопке меню
    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Закрываем меню при клике на ссылку внутри меню
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (menu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Закрываем меню при клике вне меню
    document.addEventListener('click', function(e) {
        if (menu.classList.contains('active') && 
            !menu.contains(e.target) && 
            !menuBtn.contains(e.target)) {
            toggleMenu();
        }
    });
    
    // Закрываем меню при нажатии клавиши Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            toggleMenu();
        }
    });
    
    // Добавляем обработку свайпа для закрытия мобильного меню
    let touchStartX = 0;
    let touchEndX = 0;
    
    menu.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    menu.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        if (menu.classList.contains('active') && touchStartX > touchEndX + 70) {
            // Свайп влево - закрываем меню
            toggleMenu();
        }
    }
    
    // Улучшение отображения галереи на мобильных устройствах
    if (window.innerWidth <= 768) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        // Делаем описание видимым сразу на мобильных устройствах
        galleryItems.forEach(item => {
            const overlay = item.querySelector('.gallery-overlay');
            if (overlay) {
                overlay.style.transform = 'translateY(0)';
                overlay.style.background = 'linear-gradient(to top, rgba(8, 8, 16, 0.9) 40%, transparent)';
            }
        });
    }
    
    // Добавляем плавную прокрутку при клике на ссылки навигации
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Плавная прокрутка с учетом высоты шапки
                const headerHeight = document.querySelector('header').offsetHeight;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition - headerHeight;
                
                window.scrollBy({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Фикс для лучшего отображения карточек сервисов на мобильных
    if (window.innerWidth <= 576) {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            // Устанавливаем минимальную высоту для мобильных устройств
            card.style.minHeight = '280px';
        });
    }
    
    // Оптимизируем частицы для мобильных устройств
    if (window.innerWidth <= 768) {
        const particles = document.querySelectorAll('.particle');
        
        // Уменьшаем количество частиц для производительности
        particles.forEach((particle, index) => {
            if (index > 20) {
                particle.remove();
            }
        });
    }
    
    // Улучшение доступности для сенсорных устройств
    if ('ontouchstart' in window) {
        const interactiveElements = document.querySelectorAll('.btn, .service-link, .menu li a, .footer-links a');
        
        interactiveElements.forEach(element => {
            // Добавляем паддинг для увеличения площади касания
            element.style.padding = element.style.padding || '8px';
        });
    }
    
    // Создаем кастомное уведомление для замены стандартного alert
    function showCustomAlert(message) {
        // Проверяем, не существует ли уже уведомление
        let existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Создаем контейнер для уведомления
        const alertElement = document.createElement('div');
        alertElement.classList.add('custom-alert');
        
        // Добавляем стили для уведомления
        alertElement.style.position = 'fixed';
        alertElement.style.bottom = '20px';
        alertElement.style.left = '50%';
        alertElement.style.transform = 'translateX(-50%)';
        alertElement.style.backgroundColor = 'rgba(8, 8, 16, 0.9)';
        alertElement.style.color = '#fff';
        alertElement.style.padding = '15px 20px';
        alertElement.style.borderRadius = '8px';
        alertElement.style.boxShadow = '0 0 15px var(--neon-purple)';
        alertElement.style.zIndex = '9999';
        alertElement.style.maxWidth = '80%';
        alertElement.style.textAlign = 'center';
        alertElement.style.fontSize = '16px';
        alertElement.style.border = '1px solid var(--neon-purple)';
        
        // Добавляем сообщение
        alertElement.textContent = message;
        
        // Добавляем уведомление на страницу
        document.body.appendChild(alertElement);
        
        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            alertElement.style.opacity = '0';
            alertElement.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                alertElement.remove();
            }, 500);
        }, 3000);
    }
    
    // Заменяем стандартный alert в обработчике формы
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Простая валидация формы
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            if (nameInput.value.trim() === '' || emailInput.value.trim() === '' || messageInput.value.trim() === '') {
                showCustomAlert('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            // Показываем загрузку
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
            
            // Имитация отправки формы
            setTimeout(() => {
                showCustomAlert('Спасибо! Ваше сообщение успешно отправлено.');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 1500);
        }, { capture: true }); // Используем capture для перехвата события раньше других обработчиков
    }
});
