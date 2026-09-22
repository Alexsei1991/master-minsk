// ==========================================================================
/* 1. ЛОГИКА ДИНАМИЧЕСКОГО СЛАЙДЕРА (ГОРИЗОНТАЛЬНЫЙ ТЕКСТ + ПРОЯВЛЕНИЕ ФОТО) */
// ==========================================================================
let currentSlideIndex = 0;
const textTrack = document.querySelector('.text-slider-track');
const photoSlides = document.querySelectorAll('.master-photo-slide'); // Находим фотки
const totalSlidesCount = document.querySelectorAll('.text-slide').length;
const dots = document.querySelectorAll('.dot');
let sliderTimer = setInterval(nextSlide, 10000); 

function showSlide(index) {
    if (index >= totalSlidesCount) currentSlideIndex = 0;
    if (index < 0) currentSlideIndex = totalSlidesCount - 1;

    // 1. Журнальный сдвиг текста справа налево внутри карточки
    if (textTrack) {
        textTrack.style.transform = `translateX(-${currentSlideIndex * 25}%)`;
    }

    // 2. 🌟 ПЛАВНОЕ ПРОЯВЛЕНИЕ ФОТОГРАФИИ: переключаем активный класс у картинок
    photoSlides.forEach(photo => photo.classList.remove('active'));
    if (photoSlides.length > 0) {
        photoSlides[currentSlideIndex].classList.add('active');
    }

    // 3. Обновляем точки-индикаторы
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots.length > 0) {
        dots[currentSlideIndex].classList.add('active');
    }
}

function nextSlide() {
    currentSlideIndex++;
    showSlide(currentSlideIndex);
    resetSliderTimer();
}

function prevSlide() {
    currentSlideIndex--;
    showSlide(currentSlideIndex);
    resetSliderTimer();
}

function currentSlide(index) {
    currentSlideIndex = index;
    showSlide(currentSlideIndex);
    resetSliderTimer();
}

function resetSliderTimer() {
    clearInterval(sliderTimer);
    sliderTimer = setInterval(nextSlide, 10000);
}

// ==========================================================================
/* 2. ЛОГИКА ПЛАВНЫХ ПРАЙС-ЛИСТОВ И КАЛЬКУЛЯТОРА */
// ==========================================================================
function togglePrice(id) {
    const priceList = document.getElementById(id);
    const button = window.event.target;
    priceList.classList.toggle('active');

    let activeColor = '#0066cc';
    if (id === 'price-electric') activeColor = '#0066cc';
    if (id === 'price-plumbing') activeColor = '#38bdf8';
    if (id === 'price-furniture') activeColor = '#0284c7';
    if (id === 'price-handyman') activeColor = '#0ea5e9';

    if (priceList.classList.contains('active')) {
        button.textContent = 'Скрыть прайс-лист';
        button.style.borderColor = activeColor;
        button.style.color = activeColor;
        button.style.backgroundColor = '#f0f7ff';
    } else {
        button.textContent = 'Посмотреть прайс-лист';
        button.style.borderColor = '#cbd5e1';
        button.style.color = '#0066cc';
        button.style.backgroundColor = '#ffffff';
    }
}

function calculateKitchen() {
    const wallMaterial = document.querySelector('input[name="wall-material"]:checked').value;
    const socketsCount = parseInt(document.getElementById('sockets-range').value);
    const strobeLength = parseInt(document.getElementById('strobe-range').value);

    document.getElementById('sockets-val').textContent = socketsCount + ' шт.';
    document.getElementById('strobe-val').textContent = strobeLength + ' м.';

    const boxRate = wallMaterial === 'concrete' ? 18 : 10;
    const installBoxRate = 7;
    const strobeRate = wallMaterial === 'concrete' ? 15 : 8;
    const cableRate = 4;

    const totalBoxesPrice = socketsCount * (boxRate + installBoxRate);
    const totalStrobePrice = strobeLength * strobeRate;
    const totalCablePrice = strobeLength * cableRate;
    const finalTotal = totalBoxesPrice + totalStrobePrice + totalCablePrice;

    document.getElementById('res-boxes').textContent = totalBoxesPrice + ' BYN';
    document.getElementById('res-strobe').textContent = totalStrobePrice + ' BYN';
    document.getElementById('res-cable').textContent = totalCablePrice + ' BYN';
    document.getElementById('calc-total-val').textContent = finalTotal + ' BYN';

    const wallsText = wallMaterial === 'concrete' ? 'Бетон' : 'Кирпич/Блок';
    const textMsg = `Заказ на перенос розеток: стены ${wallsText}, ${socketsCount} шт., ${strobeLength}м штробы. Смета: ${finalTotal} BYN.`;
    document.getElementById('calc-text-msg').value = textMsg;
}

function copyAndOpenTelegram() {
    const copyText = document.getElementById("calc-text-msg");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    
    const btn = document.getElementById("btn-copy-send");
    btn.textContent = "✅ Скопировано! Открываю чат...";
    btn.style.backgroundColor = "#27ae60";

    setTimeout(() => {
        btn.textContent = "📋 Скопировать смету и открыть Telegram";
        btn.style.backgroundColor = "#0088cc";
        window.open('https://t.me', '_blank');
    }, 1200);
}

function toggleCalculator() {
    const calcSection = document.querySelector('.calculator-section');
    const btn = document.getElementById('btn-toggle-calc');
    calcSection.classList.toggle('active');
    
    if (calcSection.classList.contains('active')) {
        btn.textContent = '❌ Скрыть калькулятор розеток';
        btn.style.backgroundColor = '#c0392b';
        btn.style.color = '#ffffff';
        setTimeout(() => {
            calcSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
    } else {
        btn.textContent = '⁝⁝ Калькулятор расчета переноса розеток';
        btn.style.backgroundColor = '#0066cc';
        btn.style.color = '#ffffff';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    if(document.getElementById('sockets-range')) {
        calculateKitchen();
    }
});



// ==========================================================================
// 📋 ИНТЕРАКТИВНОЕ ПЕРЕКЛЮЧЕНИЕ ОБЩЕЙ ШИРОКОЙ ПАНЕЛИ ПРАЙС-ЛИСТОВ
// ==========================================================================
function showWidePrice(serviceType) {
    const panel = document.getElementById('wide-price-panel');
    const titleElement = document.getElementById('price-panel-title');
    
    // Карта заголовков для каждого профиля
    const titles = {
        'electric': '⚡ Прайс-лист: Электромонтажные работы',
        'plumbing': '🚰 Прайс-лист: Сантехнические работы',
        'furniture': '🪚 Прайс-лист: Сборка и ремонт мебели',
        'handyman': '🔨 Прайс-лист: Мелкий бытовой ремонт'
    };

    // Если панель уже открыта и мы кликаем по ТОЙ ЖЕ услуге — закрываем её
    const currentActiveBlock = document.getElementById(`wide-price-${serviceType}`);
    if (panel.classList.contains('active') && currentActiveBlock.classList.contains('active')) {
        closeWidePrice();
        return;
    }

    // Сбрасываем активность со всех списков цен и всех карточек
    document.querySelectorAll('.price-content-block').forEach(block => block.classList.remove('active'));
    document.querySelectorAll('.service-card').forEach(card => card.classList.remove('panel-open'));

    // Меняем текст заголовка под выбранную услугу
    if (titles[serviceType]) {
        titleElement.textContent = titles[serviceType];
    }

    // Активируем нужный прайс-лист и подсвечиваем саму карточку
    const targetBlock = document.getElementById(`wide-price-${serviceType}`);
    const targetCard = document.getElementById(`card-service-${serviceType}`) || document.getElementById(`card-${serviceType}`);
    
    if (targetBlock) targetBlock.classList.add('active');
    if (targetCard) targetCard.classList.add('panel-open');

    // Плавно открываем саму общую широкую панель
    panel.classList.add('active');

    // Комфортная автопрокрутка экрана к прайсу, чтобы клиент сразу видел цены
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Функция закрытия широкой панели прайса
function closeWidePrice() {
    const panel = document.getElementById('wide-price-panel');
    if (panel) {
        panel.classList.remove('active');
    }
    // Снимаем подсветку с карточек услуг
    document.querySelectorAll('.service-card').forEach(card => card.classList.remove('panel-open'));
}





