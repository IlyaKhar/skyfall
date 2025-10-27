// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  // Создание анимированных облаков
  createFallingClouds();
  
  // Инициализация формы подписки
  initNewsletterForm();

  // Инициализация путеводителя
  initGuideInteractions();
  initToursShowMore();
  
  // Инициализация формы букинга на главной
  initBookingForm();
  // Инициализация калькулятора на главной
  initHomeCalc();
  // Отзывы на главной
  initHomeReviews();
  
  // Инициализация бургер-меню
  initBurgerMenu();

  // Бегущая строка галереи (если есть на странице)
  const marquee = document.querySelector('.marquee');
  if (marquee) {
    // Дублируем содержимое для бесконечного скролла
    marquee.innerHTML += marquee.innerHTML;
    const updateAnimation = () => {
      const marqueeWidth = marquee.scrollWidth / 2;
      const speed = 20; // пикселей в секунду
      const duration = marqueeWidth / speed;
      marquee.style.animationDuration = duration + 's';
    };
    updateAnimation();
    window.addEventListener('resize', updateAnimation);
  }

  // Лайк-сердечки
  document.querySelectorAll('.heart').forEach((heart) => {
    heart.addEventListener('click', () => {
      heart.classList.toggle('active');
      heart.classList.add('pulse');
      setTimeout(() => heart.classList.remove('pulse'), 300);
    });
  });

  // Формы подписки в футере
  document.querySelectorAll('.zayv2').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const container = btn.closest('.footer') || document;
      const input = container.querySelector('.zayv1');
      const email = input ? input.value.trim() : '';
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Введите корректный email');
        e.preventDefault();
        return;
      }
      alert('Вы успешно подписались на рассылку!');
    });
  });

  // Плавная прокрутка для якорных ссылок
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // reveal-on-scroll для элементов с классом .reveal
  const revealElements = Array.from(document.querySelectorAll('.reveal'));
  if (revealElements.length) {
    const onIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    };
    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(onIntersect, { threshold: 0.15 })
      : null;
    if (observer) {
      revealElements.forEach((el) => observer.observe(el));
    } else {
      // Фоллбек: сразу показать
      revealElements.forEach((el) => el.classList.add('visible'));
    }
  }

  // Инициализация анимаций для страницы "О компании"
  initAboutPageAnimations();
});

// Функция создания падающих облаков
function createFallingClouds() {
  // Создаем контейнер для облаков
  const cloudsContainer = document.createElement('div');
  cloudsContainer.className = 'clouds-container';
  document.body.appendChild(cloudsContainer);

  // Массив с разными типами облаков
  const cloudTypes = ['☁️', '⛅', '🌤️', '☁️', '⛅'];
  
  // Функция создания одного облака
  function createCloud() {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';
    cloud.textContent = cloudTypes[Math.floor(Math.random() * cloudTypes.length)];
    
    // Случайная позиция по X
    cloud.style.left = Math.random() * 100 + '%';
    
    // Случайный размер (меньше для фона)
    const size = Math.random() * 1 + 0.8; // от 0.8 до 1.8
    cloud.style.fontSize = size + 'rem';
    
    // Случайная задержка анимации
    cloud.style.animationDelay = Math.random() * 5 + 's';
    
    // Случайная скорость падения
    const duration = Math.random() * 10 + 15; // от 15 до 25 секунд
    cloud.style.animationDuration = duration + 's';
    
    cloudsContainer.appendChild(cloud);
    
    // Удаляем облако после завершения анимации
    setTimeout(() => {
      if (cloud.parentNode) {
        cloud.parentNode.removeChild(cloud);
      }
    }, duration * 1000);
  }
  
  // Создаем несколько облаков сразу для более плотного фона
  for (let i = 0; i < 8; i++) {
    setTimeout(() => createCloud(), i * 500);
  }
  
  // Создаем новые облака каждые 1-2 секунды для более плотного фона
  setInterval(() => {
    createCloud();
  }, Math.random() * 1000 + 1000);
}

// Показывать по 3 тура и кнопка "Показать ещё"
function initToursShowMore() {
  const grid = document.getElementById('toursGrid');
  const btn = document.getElementById('showMoreTours');
  if (!grid || !btn) return;

  const cards = Array.from(grid.querySelectorAll('.tour-card'));
  const initial = 3;
  let expanded = false;

  const apply = () => {
    cards.forEach((card, idx) => {
      card.style.display = expanded || idx < initial ? '' : 'none';
    });
    btn.textContent = expanded ? 'Скрыть' : 'Показать ещё';
  };

  apply();
  btn.addEventListener('click', () => {
    expanded = !expanded;
    apply();
    if (expanded) {
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

// Обработка формы букинга (главная страница)
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const data = new FormData(form);
    const name = data.get('name');
    showAlert(`Спасибо, ${name || 'гость'}! Заявка принята. Мы свяжемся с вами в ближайшее время.`);
    form.reset();
  });
}

// Калькулятор стоимости (интеграция с главной)
function initHomeCalc() {
  const form = document.getElementById('calcForm');
  const result = document.getElementById('calcResult');
  const calcBtn = document.getElementById('calcBtn');
  if (!form || !result || !calcBtn) return;

  // Интерактивные эффекты для полей
  const inputs = form.querySelectorAll('input, select');
  inputs.forEach((input) => {
    input.addEventListener('focus', () => {
      input.parentElement.style.transform = 'translateY(-2px)';
      input.parentElement.style.transition = 'transform 0.3s ease';
    });
    input.addEventListener('blur', () => {
      input.parentElement.style.transform = 'translateY(0)';
    });
  });

  calcBtn.addEventListener('click', () => {
    // Мини-анимация клика
    calcBtn.style.transform = 'scale(0.97)';
    setTimeout(() => { calcBtn.style.transform = 'scale(1)'; }, 120);

    const formData = new FormData(form);
    const days = Math.max(3, Math.min(30, Number(formData.get('days') || 7)));
    const people = Math.max(1, Math.min(10, Number(formData.get('people') || 2)));
    const city = formData.get('city');
    const cls = formData.get('class');
    const extras = formData.get('extras');

    const cityMultiplier = { tokyo: 1.2, osaka: 1.1, sapporo: 0.9, kyoto: 1.0, nara: 0.95 };
    const basePerDay = { standard: 180, comfort: 260, lux: 380, premium: 500 }[cls] || 180;
    const extrasCost = { none: 0, guide: 80, food: 60, onsen: 50, culture: 70, photography: 90 }[extras] || 0;

    const subtotal = (basePerDay + extrasCost) * days * people * (cityMultiplier[city] || 1);
    const service = Math.round(subtotal * 0.08);
    const discount = days >= 10 ? Math.round(subtotal * 0.05) : 0;
    const total = subtotal + service - discount;

    const format = (n) => n.toLocaleString('ru-RU');
    result.innerHTML = `
      <div style="margin-bottom: 16px; font-size: 22px; color: #059669; font-weight: 600;">💰 Стоимость путешествия</div>
      <div style="margin-bottom: 8px; color: #475569;">Базовая стоимость: <strong>${format(Math.round(subtotal))} USD</strong></div>
      ${discount > 0 ? `<div style="margin-bottom: 8px; color: #059669;">Скидка за длительность: <strong>-${format(discount)} USD</strong></div>` : ''}
      <div style="margin-bottom: 8px; color: #475569;">Сервисный сбор: <strong>${format(service)} USD</strong></div>
      <div style="border-top: 2px solid rgba(148, 163, 184, 0.3); padding-top: 16px; margin-top: 16px; font-size: 26px; color: #1e293b; font-weight: 700;">
        ИТОГО: <strong>${format(total)} USD</strong>
      </div>
      <div style="margin-top: 12px; font-size: 14px; color: #64748b;">*Цены могут варьироваться в зависимости от сезона</div>
    `;
    result.classList.add('show');
  });
}

// Карусель отзывов на главной
function initHomeReviews() {
  const track = document.getElementById('reviewsTrack');
  if (!track) return;
  const prev = document.getElementById('reviewsPrev');
  const next = document.getElementById('reviewsNext');

  const scrollByCard = () => {
    const card = track.querySelector('.review-card');
    if (!card) return 0;
    const style = getComputedStyle(track);
    const gap = parseInt(style.columnGap || style.gap || '24', 10);
    return card.offsetWidth + gap;
  };

  const scrollToNext = () => {
    track.scrollBy({ left: scrollByCard(), behavior: 'smooth' });
  };
  const scrollToPrev = () => {
    track.scrollBy({ left: -scrollByCard(), behavior: 'smooth' });
  };

  next && next.addEventListener('click', scrollToNext);
  prev && prev.addEventListener('click', scrollToPrev);

  // Автопрокрутка
  let autoTimer = setInterval(scrollToNext, 4500);
  const stop = () => clearInterval(autoTimer);
  const resume = () => { stop(); autoTimer = setInterval(scrollToNext, 4500); };
  track.addEventListener('mouseenter', stop);
  track.addEventListener('mouseleave', resume);
}

// Обработка формы подписки на рассылку
function initNewsletterForm() {
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = this.querySelector('input[type="email"]').value;
      
      if (email) {
        // Показываем уведомление об успешной подписке
        showAlert('Спасибо за подписку! Мы будем держать вас в курсе наших новостей и акций! 🎌');
        
        // Очищаем форму
        this.reset();
        
        // Здесь можно добавить отправку данных на сервер
        console.log('Подписка на рассылку:', email);
      }
    });
  }
}

// Инициализация интерактивности путеводителя
function initGuideInteractions() {
  // Анимация появления элементов при скролле
  initScrollAnimations();
  
  // Интерактивная карта Японии
  initInteractiveMap();
  
  // Анимации карточек
  initCardAnimations();
  
  // Параллакс эффекты
  initParallaxEffects();
  
  // Интерактивные кнопки
  initInteractiveButtons();
}

// Анимации появления при скролле
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.guide-section, .destination-card, .season-card, .transport-card, .food-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Задержка для последовательного появления
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.classList.add('animate-in');
        }, index * 100);
      }
    });
  }, { threshold: 0.1 });
  
  animatedElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });
}

// Интерактивная карта Японии
function initInteractiveMap() {
  const mapRegions = document.querySelectorAll('.map-region');
  const interactiveMap = document.querySelector('.interactive-map');
  
  mapRegions.forEach((region) => {
    region.addEventListener('mouseenter', () => {
      // Усиленная пульсация пина
      const pinInner = region.querySelector('.pin-inner');
      const pinRipple = region.querySelector('.pin-ripple');
      
      if (pinInner) {
        pinInner.style.animation = 'pinPulse 0.3s ease-in-out infinite';
        pinInner.style.transform = 'scale(1.3)';
      }
      
      if (pinRipple) {
        pinRipple.style.animation = 'pinRipple 0.5s ease-in-out infinite';
      }
      
      // Показываем информацию о регионе с анимацией
      const info = region.querySelector('.region-info');
      if (info) {
        info.style.opacity = '1';
        info.style.transform = 'translateX(-50%) translateY(-10px) scale(1.05)';
        info.style.zIndex = '100';
      }
      
      // Добавляем свечение к карте
      if (interactiveMap) {
        interactiveMap.style.boxShadow = 
          '0 25px 80px rgba(0, 0, 0, 0.2), 0 0 50px rgba(193, 101, 72, 0.3)';
      }
    });
    
    region.addEventListener('mouseleave', () => {
      const pinInner = region.querySelector('.pin-inner');
      const pinRipple = region.querySelector('.pin-ripple');
      
      if (pinInner) {
        pinInner.style.animation = 'pinPulse 2s infinite';
        pinInner.style.transform = 'scale(1)';
      }
      
      if (pinRipple) {
        pinRipple.style.animation = 'pinRipple 2s infinite';
      }
      
      const info = region.querySelector('.region-info');
      if (info) {
        info.style.opacity = '0';
        info.style.transform = 'translateX(-50%) translateY(0) scale(1)';
        info.style.zIndex = '20';
      }
      
      // Убираем свечение с карты
      if (interactiveMap) {
        interactiveMap.style.boxShadow = 
          '0 20px 60px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
      }
    });
    
    region.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Эффектная анимация клика
      const pinInner = region.querySelector('.pin-inner');
      if (pinInner) {
        pinInner.style.transform = 'scale(1.5)';
        pinInner.style.boxShadow = '0 0 30px rgba(193, 101, 72, 0.8)';
        
        setTimeout(() => {
          pinInner.style.transform = 'scale(1.2)';
          pinInner.style.boxShadow = '';
        }, 150);
      }
      
      // Создаем эффект волны
      createMapRipple(e, region);
      
      // Показываем уведомление
      const regionName = region.getAttribute('data-region');
      const regionTitle = region.querySelector('h3')?.textContent || regionName;
      showAlert(`Вы выбрали ${regionTitle}! 🎌`);
      
      // Прокрутка к соответствующей секции
      const targetSection = document.querySelector(`[data-city="${regionName}"]`);
      if (targetSection) {
        setTimeout(() => {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
      }
    });
  });
  
  // Клик по карте для общего эффекта
  if (interactiveMap) {
    interactiveMap.addEventListener('click', (e) => {
      if (e.target === interactiveMap || e.target.classList.contains('japan-map-image')) {
        createMapRipple(e, interactiveMap);
        showAlert('Исследуйте регионы Японии! 🗾');
      }
    });
  }
}

// Создание эффекта волны на карте
function createMapRipple(event, element) {
  const ripple = document.createElement('div');
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: radial-gradient(circle, rgba(193, 101, 72, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    transform: scale(0);
    animation: mapRippleEffect 0.6s ease-out;
    pointer-events: none;
    z-index: 5;
  `;
  
  element.appendChild(ripple);
  
  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple);
    }
  }, 600);
}

// Анимации карточек
function initCardAnimations() {
  const cards = document.querySelectorAll('.destination-card, .season-card, .transport-card, .food-card');
  
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      // Добавляем эффект свечения
      card.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 30px rgba(193, 101, 72, 0.2)';
      
      // Анимация иконок внутри карточки
      const icons = card.querySelectorAll('.season-icon, .transport-icon, .section-icon');
      icons.forEach((icon) => {
        icon.style.transform = 'scale(1.2) rotate(5deg)';
        icon.style.transition = 'all 0.3s ease';
      });
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
      
      const icons = card.querySelectorAll('.season-icon, .transport-icon, .section-icon');
      icons.forEach((icon) => {
        icon.style.transform = '';
      });
    });
  });
}

// Параллакс эффекты
function initParallaxEffects() {
  const heroVideo = document.querySelector('.hero-video');
  const heroContent = document.querySelector('.hero-content');
  
  if (heroVideo && heroContent) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      if (heroVideo) {
        heroVideo.style.transform = `translateY(${rate}px)`;
      }
      
      if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    });
  }
}

// Интерактивные кнопки
function initInteractiveButtons() {
  const ctaButtons = document.querySelectorAll('.cta-btn');
  
  ctaButtons.forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-3px) scale(1.05)';
      btn.style.transition = 'all 0.3s ease';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
    
    btn.addEventListener('click', (e) => {
      // Эффект волны при клике
      const ripple = document.createElement('span');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      btn.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Функция показа уведомлений
function showAlert(message) {
  // Создаем красивое уведомление
  const alert = document.createElement('div');
  alert.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(193, 101, 72, 0.9);
    backdrop-filter: blur(20px);
    color: white;
    padding: 20px 30px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    font-family: 'Forum', sans-serif;
    font-size: 16px;
    max-width: 400px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  alert.textContent = message;
  
  document.body.appendChild(alert);
  
  // Анимация появления
  setTimeout(() => {
    alert.style.transform = 'translateX(0)';
  }, 100);
  
  // Автоматическое скрытие
  setTimeout(() => {
    alert.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (alert.parentNode) {
        alert.parentNode.removeChild(alert);
      }
    }, 300);
  }, 3000);
}

// ===== АНИМАЦИИ ДЛЯ СТРАНИЦЫ "О КОМПАНИИ" =====

// Инициализация всех анимаций страницы "О компании"
function initAboutPageAnimations() {
  // Анимация временной шкалы
  initTimelineAnimations();
  
  // Интерактивные hover эффекты
  initInteractiveHoverEffects();
  
  // Анимация появления элементов при скролле
  initScrollRevealAnimations();
  
  // Анимация hero секции
  initHeroAnimations();
}

// Анимация счетчиков статистики
function initCounterAnimations() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 20);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach((stat) => {
    observer.observe(stat);
  });
}

// Анимация частиц
function initParticleAnimations() {
  const particleContainer = document.querySelector('.particle-container');
  if (!particleContainer) return;

  // Создаем дополнительные частицы при движении мыши
  document.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.1) { // 10% шанс создания частицы
      createTrailParticle(e.clientX, e.clientY);
    }
  });

  function createTrailParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'trail-particle';
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 3px;
      height: 3px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
      animation: trailFade 1s ease-out forwards;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 1000);
  }
}

// Параллакс эффекты для glass карточек
function initGlassCardParallax() {
  const glassCards = document.querySelectorAll('.glass-card');
  
  glassCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });
}

// Анимация временной шкалы
function initTimelineAnimations() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const item = entry.target;
        const year = item.querySelector('.timeline-year');
        const content = item.querySelector('.timeline-content');
        const image = item.querySelector('.timeline-image');
        
        // Анимация появления года
        setTimeout(() => {
          year.style.transform = 'scale(1.1)';
          year.style.boxShadow = '0 15px 40px rgba(193, 101, 72, 0.4)';
          setTimeout(() => {
            year.style.transform = 'scale(1)';
          }, 300);
        }, 200);
        
        // Анимация появления контента
        setTimeout(() => {
          content.style.opacity = '1';
          content.style.transform = 'translateY(0)';
        }, 400);
        
        // Анимация появления изображения
        setTimeout(() => {
          image.style.opacity = '1';
          image.style.transform = 'translateY(0)';
        }, 600);
        
        observer.unobserve(item);
      }
    });
  }, { threshold: 0.3 });

  timelineItems.forEach((item) => {
    const year = item.querySelector('.timeline-year');
    const content = item.querySelector('.timeline-content');
    const image = item.querySelector('.timeline-image');
    
    // Начальное состояние
    year.style.transition = 'all 0.3s ease';
    content.style.opacity = '0';
    content.style.transform = 'translateY(30px)';
    content.style.transition = 'all 0.6s ease';
    image.style.opacity = '0';
    image.style.transform = 'translateY(30px)';
    image.style.transition = 'all 0.6s ease';
    
    observer.observe(item);
  });
}

// Интерактивные hover эффекты
function initInteractiveHoverEffects() {
  // Эффект для season карточек (ценности)
  const seasonCards = document.querySelectorAll('.season-card');
  
  seasonCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.season-icon');
      icon.style.transform = 'scale(1.2) rotate(10deg)';
      icon.style.transition = 'all 0.3s ease';
    });
    
    card.addEventListener('mouseleave', () => {
      const icon = card.querySelector('.season-icon');
      icon.style.transform = 'scale(1) rotate(0deg)';
    });
  });

  // Эффект для destination карточек (команда)
  const destinationCards = document.querySelectorAll('.destination-card');
  
  destinationCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px) scale(1.02)';
      card.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
      card.style.boxShadow = '';
    });
  });

  // Эффект для transport карточек (статистика)
  const transportCards = document.querySelectorAll('.transport-card');
  
  transportCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.transport-icon');
      icon.style.transform = 'scale(1.3) translateY(-5px)';
      icon.style.transition = 'all 0.3s ease';
    });
    
    card.addEventListener('mouseleave', () => {
      const icon = card.querySelector('.transport-icon');
      icon.style.transform = 'scale(1) translateY(0)';
    });
  });
}

// Анимация hero секции
function initHeroAnimations() {
  // Анимация hero статистики
  const heroStats = document.querySelectorAll('.hero-stats .stat');
  heroStats.forEach((stat, index) => {
    const number = stat.querySelector('.stat-number');
    if (number) {
      const target = parseInt(number.textContent);
      if (!isNaN(target)) {
        animateNumber(number, target, 2000 + index * 200);
      }
    }
  });

  // Анимация плавающих форм
  const shapes = document.querySelectorAll('.shape');
  shapes.forEach((shape, index) => {
    shape.style.animationDelay = `${index * 2}s`;
  });

}

// Функция анимации чисел
function animateNumber(element, target, duration) {
  let start = 0;
  const increment = target / (duration / 16);
  
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    
    let displayValue = Math.floor(start);
    if (target >= 1000) {
      displayValue = Math.floor(start / 1000) + 'K+';
    } else if (target >= 100) {
      displayValue = Math.floor(start / 100) + '00+';
    } else {
      displayValue = Math.floor(start) + '+';
    }
    
    element.textContent = displayValue;
  }, 16);
}


// Анимация появления элементов при скролле
function initScrollRevealAnimations() {
  const revealElements = document.querySelectorAll('.about-section, .timeline-item, .season-card, .destination-card, .transport-card, .mission-grid, .mission-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.classList.add('animate-in');
          
          // Специальная анимация для mission карточек
          if (entry.target.classList.contains('mission-card')) {
            const icon = entry.target.querySelector('.card-icon');
            if (icon) {
              setTimeout(() => {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                setTimeout(() => {
                  icon.style.transform = 'scale(1) rotate(0deg)';
                }, 300);
              }, 200);
            }
          }
        }, index * 150);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
  });
}

// Добавляем CSS для trail частиц
const style = document.createElement('style');
style.textContent = `
  @keyframes trailFade {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(0.3) translateY(-20px);
    }
  }
  
  .animate-in {
    animation: slideInUp 0.6s ease-out forwards;
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// ===== БУРГЕР-МЕНЮ =====

// Инициализация бургер-меню
function initBurgerMenu() {
  const burgerIcon = document.querySelector('.burger-icon');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuOverlay = document.querySelector('.menu-overlay');
  
  if (!burgerIcon || !mobileMenu || !menuOverlay) return;
  
  // Обработчик клика по бургер-иконке
  burgerIcon.addEventListener('click', () => {
    burgerIcon.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });
  
  // Обработчик клика по оверлею
  menuOverlay.addEventListener('click', () => {
    burgerIcon.classList.remove('active');
    mobileMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  // Обработчик клика по ссылкам в мобильном меню
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      burgerIcon.classList.remove('active');
      mobileMenu.classList.remove('active');
      menuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // Обработчик изменения размера окна
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      burgerIcon.classList.remove('active');
      mobileMenu.classList.remove('active');
      menuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Инициализация бургер-меню
function initBurgerMenu() {
  const burgerMenu = document.getElementById('burgerMenu');
  const burgerIcon = document.getElementById('burgerIcon');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  
  if (!burgerMenu || !burgerIcon || !mobileMenu || !menuOverlay) return;
  
  let isMenuOpen = false;
  
  // Функция открытия/закрытия меню
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
      burgerIcon.classList.add('active');
      mobileMenu.classList.add('active');
      menuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      burgerIcon.classList.remove('active');
      mobileMenu.classList.remove('active');
      menuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  // Обработчики событий
  burgerMenu.addEventListener('click', toggleMenu);
  menuOverlay.addEventListener('click', toggleMenu);
  
  // Закрытие меню при клике на ссылку
  const menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (isMenuOpen) {
        toggleMenu();
      }
    });
  });
  
  // Закрытие меню при изменении размера экрана
  window.addEventListener('resize', () => {
    if (window.innerWidth > 480 && isMenuOpen) {
      toggleMenu();
    }
  });
}


