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











// ==========================================================================
// ⚡ ЭЛЕКТРИКА: ЧАСТЬ 1 ИЗ 4 (БАЗА ЩИТКА С ПОЛНЫМ КАЛЬКУЛЯТОРОМ)
// ==========================================================================
const electricInfoData = {
    'panel-build': {
        mainTitle: "⚡ ИНДИВИДУАЛЬНАЯ КАРТА УСЛУГИ: СБОРКА И МОНТАЖ ЭЛЕКТРОЩИТА",
        stepsHTML: `
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЙ ПОШАГОВЫЙ ПРОЦЕСС РАБОТЫ -->
            <div style="width: 100% !important; margin-bottom: 50px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ Что входит в стоимость сборки под ключ:</h5>
                <div class="horizontal-infographic-row">
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-panel-design" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details"><h4>Проектирование</h4><p>Рассчитываю мощность приборов, делю потребителей на группы и фиксирую бокс.</p></div>
                    </div>
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-panel-din" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details"><h4>Модули защиты</h4><p>Монтирую DIN-рейки, реле контроля напряжения от скачков 380В, блоки УЗО и автоматы.</p></div>
                    </div>
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-panel-wire" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details"><h4>Коммутация</h4><p>Прессую жилы наконечниками НШВИ, собираю схему гребенками и маркирую линии.</p></div>
                    </div>
                </div>
            </div>

            <!-- ЗОНА 2: ИНТЕРАКТИВНЫЙ ИНЖЕНЕРНЫЙ КАЛЬКУЛЯТОР БЕЗОПАСНОСТИ -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 20px !important; padding: 30px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 2px solid #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 900 !important; color: #0f172a !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important; text-align:center !important;">🧮 Интерактивный подбор защиты электросети</h5>
                <p style="font-size: 14px !important; color: #475569 !important; text-align: center !important; margin: 0 0 25px 0 !important;">Выберите тип сети и подключаемой бытовой техники, чтобы узнать правила её безопасной защиты:</p>
                
                <!-- 🎯 ШАГ 1. Переключатель 220В / 380В -->
                <div style="display: flex !important; justify-content: center !important; gap: 10px !important; margin-bottom: 25px !important;">
                    <button class="phase-calc-btn active-phase" onclick="switchNetworkPhase(220, this)" style="padding: 8px 18px !important; font-size: 13.5px !important; font-weight: 800 !important; border: 2px solid #0066cc !important; border-radius: 6px !important; background: #0066cc !important; color: #ffffff !important; cursor: pointer !important;">🏠 Квартира (220В / 1 фаза)</button>
                    <button class="phase-calc-btn" onclick="switchNetworkPhase(380, this)" style="padding: 8px 18px !important; font-size: 13.5px !important; font-weight: 800 !important; border: 2px solid #cbd5e1 !important; border-radius: 6px !important; background: #ffffff !important; color: #334155 !important; cursor: pointer !important;">🏡 Частный дом (380В / 3 фазы)</button>
                </div>

                <!-- Кнопки выбора бытовой техники (🎯 Иконка плиты заменена на ⚡) -->
                <div style="display: flex !important; justify-content: center !important; gap: 15px !important; margin-bottom: 30px !important; flex-wrap: wrap !important;">
                    <button class="cable-calc-btn" onclick="updateCableWidget(1.5, this)" style="padding: 12px 25px !important; font-size: 15px !important; font-weight: 800 !important; border: 2px solid #0066cc !important; border-radius: 10px !important; background: #0066cc !important; color: #ffffff !important; cursor: pointer !important;">💡 Свет, ТВ и Электроника</button>
                    <button class="cable-calc-btn" onclick="updateCableWidget(2.5, this)" style="padding: 12px 25px !important; font-size: 15px !important; font-weight: 800 !important; border: 2px solid #cbd5e1 !important; border-radius: 10px !important; background: #ffffff !important; color: #334155 !important; cursor: pointer !important;">🧺 Стиралка, Бойлер, СВЧ</button>
                    <button class="cable-calc-btn" onclick="updateCableWidget(4.0, this)" style="padding: 12px 25px !important; font-size: 15px !important; font-weight: 800 !important; border: 2px solid #cbd5e1 !important; border-radius: 10px !important; background: #ffffff !important; color: #334155 !important; cursor: pointer !important;">⚡ Варочная плита и Духовка</button>
                </div>
                
                <div id="cable-result-box" style="background: #ffffff !important; border-radius: 14px !important; padding: 25px !important; border: 1px solid #e2e8f0 !important;">
                    <h6 style="font-size: 16px !important; font-weight: 800 !important; color: #0066cc !important; margin: 0 0 15px 0 !important; text-transform:uppercase !important;">💡 Линия освещения квартиры и деликатной электроники</h6>
                    <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14.5px !important; color: #334155 !important; line-height: 1.7 !important;">
                        <li style="margin-bottom: 8px !important;"><strong>Номинал автомата защиты:</strong> строго 10 Ампер. Превышение номинала до 16А приведет к тому, что кабель расплавится в стене, а автомат даже не отключится!</li>
                        <li style="margin-bottom: 8px !important;"><strong>Необходимый медный кабель:</strong> сечение строго 1.5 мм² (например, ВВГнг-Ls).</li>
                        <li style="margin-bottom: 8px !important;"><strong>🛡️ Защита от скачков (Реле напряжения):</strong> Обязательно к установке! Спасает нежные платы телевизоров, компьютеров и блоки питания светодиодов от выгорания, если в подъезде отгорит ноль и пойдет перенапряжение 380В.</li>
                        <li style="margin-bottom: 0 !important;"><strong>🚟 Защита человека (УЗО):</strong> Рекомендуется групповое УЗО на 30 мА для защиты от удара током при замене перегоревших лампочек.</li>
                    </ul>
                </div>
            </div>

            <!-- ЗОНА 3: УВАЖИТЕЛЬНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ (СТА) -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Нужен надежный и безопасный электрощит?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Если вы хотите быть уверены в безопасности своего дома, доверьте сборку щита профессионалу. Я рассчитаю все нагрузки с лазерной точностью, аккуратно соберу щит любой сложности в Минске со всей защитной автоматикой и предоставлю понятную маркировку каждой линии!
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
        `
    },


// ==========================================================================
// ⚡ ЭЛЕКТРИКА: ЧАСТЬ 2 ИЗ 4 (БАЗА: ВАРОЧНЫЕ ПАНЕЛИ И РОЗЕТКИ)
// ==========================================================================
    'hob': {
        mainTitle: "🍳 ПРОФЕССИОНАЛЬНОЕ ПОДКЛЮЧЕНИЕ ВАРОЧНЫХ ПАНЕЛЕЙ И ДУХОВЫХ ШКАФОВ",
        stepsHTML: `
            <div style="width: 100% !important; margin-bottom: 50px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ ЭТАПЫ БЕЗОПАСНОГО ПОДКЛЮЧЕНИЯ СИЛОВОЙ ТЕХНИКИ:</h5>
                <div class="horizontal-infographic-row">
                    <div class="info-step-card">
                        <!-- 🎯 ИСПРАВЛЕНО: Заменили класс на точный tile-img-hob-audit -->
                        <div class="step-sticker-icon tile-img-hob-audit" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details"><h4>Ревизия силовой линии</h4><p>Проверяю сечение кабеля (минимум 4-6 мм²) и номинал автомата защиты в щитке на соответствие высокой мощности плиты.</p></div>
                    </div>
                    <div class="info-step-card">
                        <!-- 🎯 ИСПРАВЛЕНО: Заменили класс на точный tile-img-hob-socket -->
                        <div class="step-sticker-icon tile-img-hob-socket" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details"><h4>Монтаж розетки или КлК</h4><p>Устанавливаю специальную силовую розетку (32А-40А), либо собираю прямое надежное подключение через клеммник КлК-5С.</p></div>
                    </div>
                    <div class="info-step-card">
                        <!-- 🎯 ИСПРАВЛЕНО: Заменили класс на точный tile-img-hob-phase -->
                        <div class="step-sticker-icon tile-img-hob-phase" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details"><h4>Коммутация по схеме</h4><p>Выставляю перемычки на колодке плиты строго по инструкции завода-изготовителя (на 1, 2 или 3 фазы) и запускаю конфорки.</p></div>
                    </div>
                </div>
            </div>
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📐 ВАЖНАЯ ПАМЯТКА: ПОЧЕМУ МОЩНУЮ ПЛИТУ НЕЛЬЗЯ ВКЛЮЧАТЬ В ОБЫЧНУЮ РОЗЕТКУ</h5>
                <p style="font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important; margin: 0;">
                    Современная варочная панель при включении всех зон нагрева потребляет от <b>7 до 7.5 кВт</b>. Обычная бытовая розетка рассчитана максимум на 3.5 кВт (16А). Если включить плиту через неё, пластик расплавится за пару минут, что гарантированно приведет к короткому замыканию и пожару. Для такой техники всегда монтируется отдельная силовая фурнитура.
                </p>
            </div>
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Купили новую варочную панель или духовку?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Не рискуйте дорогой кухонной техникой и надежностью проводки. Я оперативно приеду в Минске, правильно распределю нагрузку по фазам и выполню чистовое подключение!
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
        `
    },


      'socket': {
        mainTitle: "🔌 ПРОФЕССИОНАЛЬНАЯ ЗАМЕНА, РЕМОНТ И ПЕРЕНОС РОЗЕТОК",
        stepsHTML: `
            <!-- ЗОНА 1: ТРИ ШАГА РАБОТЫ -->
            <div style="width: 100% !important; margin-bottom: 50px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ ЭТАПЫ РАБОТ ПРИ ПЕРЕНОСЕ И ДОБАВЛЕНИИ ТОЧЕК:</h5>
                <div class="horizontal-infographic-row">
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-socket-drill" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details"><h4>Алмазное бурение</h4><p>Размечаю новые места по лазеру строго под мебель. Высверливаю гнезда под подрозетники в бетоне или кирпиче без лишней пыли.</p></div>
                    </div>
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-socket-calc" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details"><h4>Прокладка штробы</h4><p>Прорезаю ровные штробы штроборезом с пылесосом, укладываю новый медный кабель ВВГнг-Ls и вмазываю коробки на гипс.</p></div>
                    </div>
                    <!-- Шаг 3 -->
                    <!-- Шаг 3 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-socket-final" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4>Чистовой монтаж</h4>
                            <p>Подключаю провода к механизмам, ровно выставляю розетки по лазерному уровню, защелкиваю внешние декоративные рамки и проверяю работу приборов тестером.</p>
                        </div>
                    </div>

                </div>
            </div>

            <!-- ЗОНА 2: ВМОНТИРОВАННЫЙ ИНТЕРАКТИВНЫЙ КАЛЬКУЛЯТОР CITIZEN -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 20px !important; padding: 30px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 2px solid #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 900 !important; color: #0f172a !important; margin: 0 0 25px 0 !important; text-transform: uppercase !important; text-align:center !important;">🧮 ИНТЕРАКТИВНЫЙ РАСЧЕТ СМЕТЫ НА ПЕРЕНОС РОЗЕТОК</h5>
                
                <div style="display: flex !important; flex-wrap: wrap !important; gap: 30px !important; justify-content: space-between !important;">
                    <!-- Левая часть: Ползунки и параметры (Берем из оригинальной верстки Citizen) -->
                    <div style="flex: 1 !important; min-width: 280px !important;">
                        <label style="font-size: 14px !important; font-weight: 700 !important; color: #334155 !important; display: block !important; margin-bottom: 10px !important;">Материал стен вашей квартиры:</label>
                        <div style="display: flex !important; gap: 15px !important; margin-bottom: 25px !important;">
                            <label style="background: #ffffff !important; border: 1px solid #cbd5e1 !important; padding: 10px 15px !important; border-radius: 8px !important; cursor: pointer !important; font-size: 13.5px !important; font-weight: 600 !important;"><input type="radio" name="wall-type-inter" value="concrete" checked style="margin-right: 8px !important;"> Бетон (Панель)</label>
                            <label style="background: #ffffff !important; border: 1px solid #cbd5e1 !important; padding: 10px 15px !important; border-radius: 8px !important; cursor: pointer !important; font-size: 13.5px !important; font-weight: 600 !important;"><input type="radio" name="wall-type-inter" value="brick" style="margin-right: 8px !important;"> Кирпич / Блоки</label>
                        </div>
                        
                        <div style="margin-bottom: 25px !important;">
                            <div style="display: flex !important; justify-content: space-between !important; margin-bottom: 8px !important;"><span style="font-size: 13.5px !important; font-weight: 700 !important;">Количество новых розеток/точек:</span><b id="dots-val-inter" style="color: #0066cc !important;">5 шт.</b></div>
                            <input type="range" min="1" max="30" value="5" style="width: 100% !important; cursor: pointer !important;">
                        </div>
                        
                        <div style="margin-bottom: 10px !important;">
                            <div style="display: flex !important; justify-content: space-between !important; margin-bottom: 8px !important;"><span style="font-size: 13.5px !important; font-weight: 700 !important;">Примерная длина штробы (метров):</span><b id="meters-val-inter" style="color: #0066cc !important;">4 м.</b></div>
                            <input type="range" min="1" max="50" value="4" style="width: 100% !important; cursor: pointer !important;">
                        </div>
                    </div>
                    
                    <!-- Правая часть: Результаты сметы -->
                    <div style="flex: 1 !important; min-width: 280px !important; background: #ffffff !important; border-radius: 14px !important; padding: 25px !important; border: 1px solid #e2e8f0 !important; display: flex !important; flex-direction: column !important; justify-content: center !important;">
                        <div style="display: flex !important; justify-content: space-between !important; font-size: 14px !important; margin-bottom: 12px !important; border-bottom: 1px solid #f1f5f9 !important; padding-bottom: 8px !important;"><span>Монтаж подрозетников:</span><strong id="price-dots-inter">125 BYN</strong></div>
                        <div style="display: flex !important; justify-content: space-between !important; font-size: 14px !important; margin-bottom: 12px !important; border-bottom: 1px solid #f1f5f9 !important; padding-bottom: 8px !important;"><span>Штробление стен под кабель:</span><strong id="price-sh-inter">60 BYN</strong></div>
                        <div style="display: flex !important; justify-content: space-between !important; font-size: 14px !important; margin-bottom: 20px !important; padding-bottom: 8px !important;"><span>Прокладка силового кабеля:</span><strong id="price-cab-inter">15 BYN</strong></div>
                        <div style="background: #0066cc !important; color: #ffffff !important; border-radius: 10px !important; padding: 15px !important; text-align: center !important;">
                            <span style="font-size: 13px !important; text-transform: uppercase !important; font-weight: 600 !important; display: block !important; margin-bottom: 4px !important; opacity: 0.9 !important;">Итого за работу мастера:</span>
                            <strong id="total-price-inter" style="font-size: 24px !important; font-weight: 900 !important;">200 BYN</strong>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ЗОНА 3: СКРОМНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Нужен перенос розеток?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Перенесу или добавлю розетки в удобных для вас местах. Делаю работу аккуратно, быстро и надежно. Приеду со своим инструментом в любой район Минска.
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>

        `
    },


// ==========================================================================
// ⚡ ЭЛЕКТРИКА: ЧАСТЬ 3 ИЗ 4 (БАЗА: ЛЮСТРЫ, ДИАГНОСТИКА, АВТОМАТЫ)
// ==========================================================================
    'chandelier': {
        mainTitle: "💡 МОНТАЖ И ПОДКЛЮЧЕНИЕ ЛЮСТР, СВЕТИЛЬНИКОВ И БРА",
        stepsHTML: `
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЕ ШАГИ РАБОТЫ (ТЕКСТ СОКРАЩЕН, ЧТОБЫ ВЕРНУЛАСЬ ЛИНИЯ) -->
            <div style="width: 100% !important; margin-bottom: 40px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ ЭТАПЫ УСТАНОВКИ ОСВЕЩЕНИЯ:</h5>
                <div class="horizontal-infographic-row">
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-light-frame" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4>Сборка каркаса</h4>
                            <p>Собираю корпус прибора, фиксирую рожки, плафоны и проверяю заводскую проводку.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <!-- 🎯 ИСПРАВЛЕНО: Привязали точный класс иконки к CSS, чтобы ушла кастрюля -->
                        <div class="step-sticker-icon tile-img-light-mount" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4>Крепление к потолку</h4>
                            <p>Монтирую прочную планку или крюк на металлические анкеры с учетом веса люстры.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-light-wire" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4>Подключение</h4>
                            <p>Обесточиваю линию, коммутирую жилы через клеммы Wago и собираю декоративный стакан.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- 🎯 ДОБАВЛЕНО: БЛОК С ПОЛЕЗНЫМИ СОВЕТАМИ МАСТЕРА -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📋 Полезные советы: Что нужно знать перед покупкой люстры</h5>
                <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Тип потолка:</strong> Если у вас натяжной потолок, люстра должна крепиться строго на заранее подготовленную закладную платформу.</li>
                    <li style="margin-bottom: 8px !important;"><strong>Высота прибора:</strong> Для стандартных потолков 2.5–2.7 метра лучше выбирать припотолочные светильники, чтобы не задевать их головой.</li>
                    <li style="margin-bottom: 0 !important;"><strong>Режимы света:</strong> Если люстра тяжелая или имеет много рожков, лучше сразу разделить её включение на две клавиши выключателя для экономии энергии.</li>
                </ul>
            </div>

            <!-- ЗОНА 3: СКРОМНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Нужно повесить люстру или светильник?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Соберу и надежно закреплю освещение любой сложности на бетонный или натяжной потолок. Приеду со своим инструментом и стремянкой в любой район Минска.
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
        `
    },


    'diagnostic': {
        mainTitle: "🔍 ПОИСК НЕИСПРАВНОСТЕЙ И ДИАГНОСТИКА ПРОВОДКИ",
        stepsHTML: `
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЕ ШАГИ РАБОТЫ (УБРАЛИ ЛИШНИЕ СЛОВА) -->
            <div style="width: 100% !important; margin-bottom: 40px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ ЭТАПЫ ПОИСКА НЕИСПРАВНОСТИ:</h5>
                <div class="horizontal-infographic-row">
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-diag-short" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4>Поиск замыкания</h4>
                            <!-- 🎯 ИСПРАВЛЕНО: Вычеркнули "в стенах" -->
                            <p>Проверяю линии тестером и нахожу точное место короткого замыкания или обрыва кабеля.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-diag-breaker" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4>Проверка автоматов</h4>
                            <!-- 🎯 ИСПРАВЛЕНО: Полностью вычеркнули "замеряю токи утечки УЗО и" -->
                            <p>Проверяю щиток и тестирую установленные автоматы на корректное срабатывание.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-diag-repair" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4>Локальный ремонт</h4>
                            <p>Заменяю поврежденный кусок провода, восстанавливаю контакт в коробке и безопасно запускаю сеть.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ЗОНА 2: БЛОК С ПОЛЕЗНЫМИ СОВЕТАМИ МАСТЕРА -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📋 Полезные советы: Что делать, если выбило автомат или пропал свет</h5>
                <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Отключите приборы:</strong> Выключите из розеток технику в той комнате, где погас свет, перед тем как пробовать включать автомат.</li>
                    <li style="margin-bottom: 8px !important;"><strong>Не держите рычаг:</strong> Если автомат при включении мгновенно падает обратно — не пытайтесь удерживать его силой, в сети замыкание.</li>
                    <li style="margin-bottom: 0 !important;"><strong>Запах гари:</strong> При появлении запаха паленой пластмассы из розетки или щитка — немедленно выключайте вводной автомат.</li>
                </ul>
            </div>

            <!-- ЗОНА 3: СКРОМНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Пропал свет или искрит розетка?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Оперативно выеду на замеры по Минску со специальным диагностическим инструментом. Найду точную причину аварии и безопасно устраню поломку.
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
        `
    },




 'breaker': {
        mainTitle: "🔌 ПРОФЕССИОНАЛЬНАЯ ЗАМЕНА АВТОМАТОВ И УЗО В ЩИТКЕ",
        stepsHTML: `
            <!-- ЗОНА 1: ТРИ ШАГА РАБОТЫ -->
            <div style="width: 100% !important; margin-bottom: 50px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ ЭТАПЫ РАБОТ ПРИ ЗАМЕНЕ АВТОМАТА:</h5>
                <div class="horizontal-infographic-row">
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-breaker-old" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details"><h4>Демонтаж старого</h4><p>Полностью обесточиваю щит, проверяю отсутствие напряжения указателем, отсоединяю провода и снимаю отработавший автомат.</p></div>
                    </div>
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-breaker-din" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details"><h4>Монтаж на рейку</h4><p>Закрепляю новый брендовый выключатель на стальную DIN-рейку и проверяю надежность его фиксации защелками.</p></div>
                    </div>
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-breaker-screw" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details"><h4>Протяжка клемм</h4><p>Зачищаю жилы, завожу в зажимы и плотно протягиваю винты, чтобы контакты никогда не грелись и не искрили.</p></div>
                    </div>
                </div>
            </div>

            <!-- ЗОНА 2: ИНТЕРАКТИВНЫЙ СПРАВОЧНИК НОМИНАЛОВ АВТОМАТОВ -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 20px !important; padding: 30px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 2px solid #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 900 !important; color: #0f172a !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important; text-align:center !important;">🧮 ИНТЕРАКТИВНЫЙ ПОДБОР НОМИНАЛА АВТОМАТА</h5>
                <p style="font-size: 14px !important; color: #475569 !important; text-align: center !important; margin: 0 0 25px 0 !important;">Нажимайте на номиналы автоматов, чтобы узнать, для какой техники и кабеля они применяются:</p>
                
                <!-- Кнопки выбора номинала (Вызывают функцию updateBreakerWidget) -->
                 <!-- 🎯 ИСПРАВЛЕНО: Добавлен полный ряд кнопок автоматов C6-C32 и Диф -->
                <div style="display: flex !important; justify-content: center !important; gap: 10px !important; margin-bottom: 30px !important; flex-wrap: wrap !important;">
                    <button class="breaker-calc-btn" onclick="updateBreakerWidget('C6', this)" style="padding: 10px 18px !important; font-size: 14px !important; font-weight: 800 !important; border: 2px solid #cbd5e1 !important; border-radius: 8px !important; background: #ffffff !important; color: #334155 !important; cursor: pointer !important;">C6</button>
                    <button class="breaker-calc-btn" onclick="updateBreakerWidget('C10', this)" style="padding: 10px 18px !important; font-size: 14px !important; font-weight: 800 !important; border: 2px solid #0066cc !important; border-radius: 8px !important; background: #0066cc !important; color: #ffffff !important; cursor: pointer !important;">C10</button>
                    <button class="breaker-calc-btn" onclick="updateBreakerWidget('C16', this)" style="padding: 10px 18px !important; font-size: 14px !important; font-weight: 800 !important; border: 2px solid #cbd5e1 !important; border-radius: 8px !important; background: #ffffff !important; color: #334155 !important; cursor: pointer !important;">C16</button>
                    <button class="breaker-calc-btn" onclick="updateBreakerWidget('C20', this)" style="padding: 10px 18px !important; font-size: 14px !important; font-weight: 800 !important; border: 2px solid #cbd5e1 !important; border-radius: 8px !important; background: #ffffff !important; color: #334155 !important; cursor: pointer !important;">C20</button>
                    <button class="breaker-calc-btn" onclick="updateBreakerWidget('C25', this)" style="padding: 10px 18px !important; font-size: 14px !important; font-weight: 800 !important; border: 2px solid #cbd5e1 !important; border-radius: 8px !important; background: #ffffff !important; color: #334155 !important; cursor: pointer !important;">C25</button>
                    <button class="breaker-calc-btn" onclick="updateBreakerWidget('C32', this)" style="padding: 10px 18px !important; font-size: 14px !important; font-weight: 800 !important; border: 2px solid #cbd5e1 !important; border-radius: 8px !important; background: #ffffff !important; color: #334155 !important; cursor: pointer !important;">C32</button>
                    <button class="breaker-calc-btn" onclick="updateBreakerWidget('RCBO', this)" style="padding: 10px 18px !important; font-size: 14px !important; font-weight: 800 !important; border: 2px solid #cbd5e1 !important; border-radius: 8px !important; background: #ffffff !important; color: #334155 !important; cursor: pointer !important;">🛡️ Диф / УЗО</button>
                </div>

                
                <!-- Окно вывода результатов -->
                <div id="breaker-result-box" style="background: #ffffff !important; border-radius: 14px !important; padding: 25px !important; border: 1px solid #e2e8f0 !important;">
                    <h6 style="font-size: 16px !important; font-weight: 800 !important; color: #0066cc !important; margin: 0 0 15px 0 !important; text-transform:uppercase !important;">💡 Выключатель автоматический C10 (10 Ампер)</h6>
                    <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14.5px !important; color: #334155 !important; line-height: 1.7 !important;">
                        <li style="margin-bottom: 8px !important;"><strong>Назначение линии:</strong> Защита цепей освещения квартиры.</li>
                        <li style="margin-bottom: 8px !important;"><strong>Сечение медного кабеля:</strong> строго <b>1.5 мм²</b>.</li>
                        <li style="margin-bottom: 8px !important;"><strong>Допустимая нагрузка:</strong> до <b>2.2 кВт</b>.</li>
                        <li style="margin-bottom: 0 !important;"><strong>Что подключается:</strong> Люстры, точечные светильники, споты, бра, блоки питания светодиодных LED-лент.</li>
                    </ul>
                </div>
            </div>

            <!-- ЗОНА 3: СКРОМНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Старый автомат искрит или выбивает без причины?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Заменю неисправные или устаревшие автоматы, пробки и УЗО в вашем щитке. Поставлю качественную защиту, надежно затяну контакты и промаркирую линии. Работаю по всему Минску.
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
        `
    },
// ==========================================================================
// ⚡ ЭЛЕКТРИКА: ЧАСТЬ 4-А ИЗ 5 (ВЫКЛЮЧАТЕЛИ, LED-ЛЕНТА И ФУНКЦИИ ОТКРЫТИЯ)
// ==========================================================================
    'switches': {
        mainTitle: "🎛️ ЧИСТОВОЙ МОНТАЖ ВЫКЛЮЧАТЕЛЕЙ И ДИММЕРОВ",
        stepsHTML: `
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЕ ШАГИ РАБОТЫ -->
            <div style="width: 100% !important; margin-bottom: 40px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ ЭТАПЫ УСТАНОВКИ ФУРНИТУРЫ:</h5>
                <div class="horizontal-infographic-row">
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-switch-wire" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4>Разводка жил</h4>
                            <p>Зачищаю кабель, распределяю фазные жилы в коробке и надежно зажимаю контакты в клеммах механизма.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-switch-level" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4>Выравнивание</h4>
                            <p>Выставляю стальной металлический суппорт строго горизонтально по лазерному уровню и жестко фиксирую винтами.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-switch-final" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4>Чистовая сборка</h4>
                            <p>Закрепляю декоративную рамку, защелкиваю клавиши или диммер и тестирую переключение всех режимов света.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ЗОНА 2: БЛОК С ПОЛЕЗНЫМИ СОВЕТАМИ МАСТЕРА -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📋 Полезные советы: Чем отличаются проходные выключатели и диммеры</h5>
                <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Проходные системы:</strong> Позволяют управлять одной люстрой из двух разных мест (например, включить свет на входе в коридор, а выключить в конце у спальни). Замена обычного выключателя на проходной требует специальной схемы проводки.</li>
                    <li style="margin-bottom: 8px !important;"><strong>Диммеры (регуляторы):</strong> Позволяют плавно менять яркость освещения от интимного полумрака до яркого света. Подходят для ламп накаливания и специальных диммируемых светодиодных ламп (обычные LED-лампы при подключении диммера начнут мерцать).</li>
                </ul>
            </div>

            <!-- ЗОНА 3: СКРОМНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Нужна установка выключателей или диммеров?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Соберу проходные системы управления светом, установлю регуляторы яркости и аккуратно смонтирую рамки любой многопостовой сложности. Быстро, ровно по лазеру и в любом районе Минска.
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
        `
    },



    'led-strip': {
        mainTitle: "✨ ПРОФЕССИОНАЛЬНЫЙ МОНТАЖ И ПАЙКА СВЕТОДИОДНОЙ ЛЕНТЫ",
        stepsHTML: `
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЕ ШАГИ РАБОТЫ -->
            <div style="width: 100% !important; margin-bottom: 40px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ ЭТАПЫ МОНТАЖА СВЕТОДИОДНОЙ ПОДСВЕТКИ:</h5>
                <div class="horizontal-infographic-row">
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-led-profile" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4>Монтаж профиля</h4>
                            <p>Отрезаю алюминиевый профиль в размер по лазеру, жестко креплю его к нише, обезжириваю и готовлю к наклейке.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-led-solder" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4>Пайка и укладка</h4>
                            <p>Качественно паяю контакты ленты, изолирую термоусадкой, ровно вклеиваю в профиль и закрываю матовым рассеивателем.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-led-power" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4>Подключение блока</h4>
                            <p>Монтирую блок питания и контроллер в вентилируемую нишу, подключаю к сети 220В и тестирую равномерность свечения.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ЗОНА 2: БЛОК С ПОЛЕЗНЫМИ СОВЕТАМИ МАСТЕРА -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📋 Полезные советы: Как избежать перегрева и перегорания LED-ленты</h5>
                <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Алюминиевый профиль:</strong> Мощную светодиодную ленту (особенно подсветку рабочей зоны кухни) категорически нельзя клеить напрямую на мебель или гипсокартон. Алюминиевый профиль работает как радиатор охлаждения, без него диоды деградируют и тускнеют за несколько месяцев.</li>
                    <li style="margin-bottom: 8px !important;"><strong>Надежность контактов:</strong> Накладные пластиковые коннекторы со временем окисляются, и лента начинает моргать или гаснуть. Качественная пайка соединений оловом — единственный способ сделать подсветку долговечной.</li>
                    <li style="margin-bottom: 0 !important;"><strong>Вентиляция блоков:</strong> Блоки питания и диммеры ощутимо греются под нагрузкой. Их нельзя замуровывать наглухо под потолком, к ним обязательно должен быть доступ воздуха через скрытые лючки.</li>
                </ul>
            </div>

            <!-- ЗОНА 3: СКРОМНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Нужна стильная подсветка интерьера?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Профессионально смонтирую и спаяю светодиодную LED-ленту любой длины: подсветка кухни, парящие потолки, плинтусы и ниши. Сделаю работу чисто и надежно в Минске.
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
        `
    },

};

// СЛУЖЕБНЫЕ УПРАВЛЯЮЩИЕ ФУНКЦИИ ОТКРЫТИЯ ПАНЕЛЕЙ
function openPlumbingInfo(type) {
    const dropdown = document.getElementById('tile-info-dropdown-plumbing');
    const titleZone = document.getElementById('tile-info-title-plumbing');
    const textZone = document.getElementById('tile-info-text-plumbing');
    if (!dropdown || !titleZone || !textZone) return;
    
    titleZone.innerHTML = plumbingInfoData[type].mainTitle;
    textZone.innerHTML = plumbingInfoData[type].stepsHTML;
    dropdown.classList.add('active-info');
    
    const badArrows = textZone.querySelectorAll('.infographic-arrow, a:not([href*="t.me"])');
    badArrows.forEach(function(arrow) { arrow.style.setProperty('display', 'none', 'important'); });
    
    const lineRow = textZone.querySelector('.horizontal-infographic-row');
    if (lineRow && window.innerWidth > 900) {
        lineRow.style.setProperty('position', 'relative', 'important');
        lineRow.style.setProperty('background', 'linear-gradient(to right, transparent 15%, #0066cc 15%, #0066cc 85%, transparent 85%) no-repeat center 150px / 100% 2px', 'important');
    }
    setTimeout(function() { dropdown.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 60);
}

function openElectricInfo(type) {
    const dropdown = document.getElementById('tile-info-dropdown-electric');
    const titleZone = document.getElementById('tile-info-title-electric');
    const textZone = document.getElementById('tile-info-text-electric');
    if (!dropdown || !titleZone || !textZone) return;
    
    titleZone.innerHTML = electricInfoData[type].mainTitle;
    textZone.innerHTML = electricInfoData[type].stepsHTML;
    dropdown.classList.add('active-info');
    
    // 🎯 ИСПРАВЛЕНО: Убрали кавычки и опасный фильтр, ломавший калькулятор!
    const badArrows = textZone.querySelectorAll('.infographic-arrow');
    badArrows.forEach(function(arrow) { arrow.style.setProperty('display', 'none', 'important'); });
    
    const lineRow = textZone.querySelector('.horizontal-infographic-row');
    if (lineRow && window.innerWidth > 900) {
        lineRow.style.setProperty('position', 'relative', 'important');
        lineRow.style.setProperty('background', 'linear-gradient(to right, transparent 15%, #0066cc 15%, #0066cc 85%, transparent 85%) no-repeat center 150px / 100% 2px', 'important');
    }
    setTimeout(function() { dropdown.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 60);
}

function closeTileInfo(category) {
    const currentCategory = category || 'plumbing';
    const dropdown = document.getElementById(`tile-info-dropdown-${currentCategory}`);
    if (dropdown) dropdown.classList.remove('active-info');
}
// ==========================================================================
// 🎯 ЭЛЕКТРИКА: ЧАСТЬ 5 ИЗ 5 (МОЗГ ИНТЕРТАКТИВНОГО КАЛЬКУЛЯТОРА С УЗО И ДИФАМИ)
// ==========================================================================
// 🎯 МОЗГ КАЛЬКУЛЯТОРА: Меняет тексты на лету при клике на кнопки сечений
function updateCableWidget(square, btnElement) {
    const resultBox = document.getElementById('cable-result-box');
    if (!resultBox) return;
    
    // Подсветка нажатой кнопки (переключение синего фона)
    const allButtons = document.querySelectorAll('.cable-calc-btn');
    allButtons.forEach(function(btn) {
        btn.style.setProperty('background', '#ffffff', 'important');
        btn.style.setProperty('color', '#334155', 'important');
        btn.style.setProperty('border', '2px solid #cbd5e1', 'important');
    });
    
    btnElement.style.setProperty('background', '#0066cc', 'important');
    btnElement.style.setProperty('color', '#ffffff', 'important');
    btnElement.style.setProperty('border', '2px solid #0066cc', 'important');
    
    // 🫵 ВОТ ТУТ МЫ НАМЕРТВО ЗАФИКСИРОВАЛИ ТЕКСТЫ, КОТОРЫЕ БУДУТ ПОЯВЛЯТЬСЯ ПРИ КЛИКАХ:
    if (square === 1.5) {
        resultBox.innerHTML = `
            <h6 style="font-size: 16px !important; font-weight: 800 !important; color: #0066cc !important; margin: 0 0 15px 0 !important; text-transform:uppercase !important;">💡 Линия освещения квартиры (Кабель 1.5 мм²)</h6>
            <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14.5px !important; color: #334155 !important; line-height: 1.7 !important;">
                <li style="margin-bottom: 8px !important;"><strong>Номинал автомата защиты:</strong> строго 10 Ампер. Превышение номинала до 16А приведет к тому, что кабель расплавится в стене, а автомат даже не отключится!</li>
                <li style="margin-bottom: 8px !important;"><strong>Максимальная нагрузка:</strong> до 2.2 кВт. Подходит для люстр, LED-лент, спотов и бра.</li>
                <li style="margin-bottom: 8px !important;"><strong>🛡️ Реле напряжения:</strong> Защищает блоки питания светодиодов. Если отгорит ноль и пойдет 380В, реле за 0.02 секунды отключит квартиру и спасет технику от выгорания.</li>
                <li style="margin-bottom: 0 !important;"><strong>🚟 Защита человека (УЗО):</strong> Рекомендуется общее УЗО на 30 мА, чтобы вас не ударило током, если вы решите заменить перегоревшую лампочку при включенном выключателе.</li>
            </ul>`;
    } else if (square === 2.5) {
        resultBox.innerHTML = `
            <h6 style="font-size: 16px !important; font-weight: 800 !important; color: #0066cc !important; margin: 0 0 15px 0 !important; text-transform:uppercase !important;">🔌 Стандартная розеточная группа (Кабель 2.5 мм²)</h6>
            <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14.5px !important; color: #334155 !important; line-height: 1.7 !important;">
                <li style="margin-bottom: 8px !important;"><strong>Номинал автомата защиты:</strong> строго 16 Ампер. Категорически запрещено завышать до 20А или 25А! Обычная бытовая розетка физически плавится при токе выше 16А.</li>
                <li style="margin-bottom: 8px !important;"><strong>Максимальная нагрузка:</strong> до 3.5 кВт. Линия для телевизоров, компьютеров, стиральных машин и холодильников.</li>
                <li style="margin-bottom: 8px !important;"><strong>⚖️ Что выбрать: УЗО или Дифавтомат?</strong> 
                    <br>• УЗО — ловит только утечку тока и спасает человека, но НЕ защищает от короткого замыкания (ставится в паре с обычным автоматом).
                    <br>• Дифавтомат — это два в одном. Защищает и человека от удара током, и кабель от короткого замыкания.</li>
                <li style="margin-bottom: 0 !important;"><strong>⚠️ Требование ПУЭ:</strong> Розетки в ванной (стиралка, фен) и рабочей зоны кухни обязаны быть защищены УЗО или Дифавтоматом с током утечки строго 30 мА.</li>
            </ul>`;
    } else if (square === 4.0) {
        resultBox.innerHTML = `
            <h6 style="font-size: 16px !important; font-weight: 800 !important; color: #0066cc !important; margin: 0 0 15px 0 !important; text-transform:uppercase !important;">🍳 Линия мощной кухонной техники (Кабель 4.0 мм²)</h6>
            <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14.5px !important; color: #334155 !important; line-height: 1.7 !important;">
                <li style="margin-bottom: 8px !important;"><strong>Номинал автомата защиты:</strong> строго 25 Ампер. Обеспечивает надежную отсечку толстой жилы от перегрева при сверхнагрузках.</li>
                <li style="margin-bottom: 8px !important;"><strong>Максимальная нагрузка:</strong> до 5.5 кВт мощности. Подключаются индукционные варочные панели, мощные духовые шкафы, бойлеры.</li>
                <li style="margin-bottom: 8px !important;"><strong>🛑 Реле напряжения:</strong> Дорогие индукционные плиты напичканы умными платами. При скачке напряжения в сети они сгорают первыми. Цифровое реле в щитке полностью решает эту проблему.</li>
                <li style="margin-bottom: 0 !important;"><strong>🧯 Какая защита обязательна:</strong> Для варочной панели рекомендуется выделенный Дифавтомат (25А / 30 мА), чтобы малейшее повреждение плиты обесточило только её саму, а не вырубило свет во всей квартире.</li>
            </ul>`;
    }
}






// ==========================================================================
// 🧠 МОЗГ ДЛЯ ВСТРОЕННОГО КАЛЬКУЛЯТОРА РОЗЕТОК (РАСЧЕТ НА ЛЕТУ)
// ==========================================================================
// ==========================================================================
// 🎯 ЖЕЛЕЗНЫЙ МОЗГ КАЛЬКУЛЯТОРА РОЗЕТОК (ПРЯМОЙ РАСЧЕТ БЕЗ СБОЕВ)
// ==========================================================================
function initInteractiveSocketCalc() {
    // Ищем ползунки напрямую по порядку их расположения на странице
    const ranges = document.querySelectorAll('#tile-info-dropdown-electric input[type="range"]');
    const dotsSlider = ranges[0];
    const metersSlider = ranges[1];
    
    if (!dotsSlider || !metersSlider) {
        console.warn("Калькулятор розеток: Ползунки не найдены в разметке.");
        return;
    }

    function recalculate() {
        const dots = parseInt(dotsSlider.value);
        const meters = parseInt(metersSlider.value);
        
        // Проверяем тип стен (бетон или кирпич)
        const wallRadio = document.querySelector('input[name="wall-type-inter"]:checked');
        const wallType = wallRadio ? wallRadio.value : 'concrete';

        // 🎯 ТВОИ ТАРИФЫ В BYN:
        const dotPrice = (wallType === 'concrete') ? 25 : 20; // 25 BYN бетон, 20 BYN кирпич
        const shPrice = 15;  // 15 BYN за метр штробы
        const cabPrice = 3;  // 3 BYN за метр прокладки кабеля

        // Математика сметы
        const totalDots = dots * dotPrice;
        const totalSh = meters * shPrice;
        const totalCab = meters * cabPrice;
        const grandTotal = totalDots + totalSh + totalCab;

        // Мгновенно выводим новые цифры на экран клиента
        const dVal = document.getElementById('dots-val-inter');
        const mVal = document.getElementById('meters-val-inter');
        const pDots = document.getElementById('price-dots-inter');
        const pSh = document.getElementById('price-sh-inter');
        const pCab = document.getElementById('price-cab-inter');
        const pTotal = document.getElementById('total-price-inter');

        if (dVal) dVal.innerText = dots + ' шт.';
        if (mVal) mVal.innerText = meters + ' м.';
        if (pDots) pDots.innerText = totalDots + ' BYN';
        if (pSh) pSh.innerText = totalSh + ' BYN';
        if (pCab) pCab.innerText = totalCab + ' BYN';
        if (pTotal) pTotal.innerText = grandTotal + ' BYN';
    }

    // Привязываем пересчет к движениям ползунков
    dotsSlider.removeEventListener('input', recalculate);
    dotsSlider.addEventListener('input', recalculate);
    
    metersSlider.removeEventListener('input', recalculate);
    metersSlider.addEventListener('input', recalculate);

    // Привязываем пересчет к кнопкам выбора стен (бетон/кирпич)
    const radios = document.querySelectorAll('input[name="wall-type-inter"]');
    radios.forEach(function(radio) {
        radio.removeEventListener('change', recalculate);
        radio.addEventListener('change', recalculate);
    });

    // Запускаем первый стартовый расчет при открытии карточки
    recalculate();
}





// ==========================================================================
// 🗺️ ИНТЕРАКТИВНАЯ ИНФОГРАФИКА: ЧАСТЬ 1 ИЗ 3 (БАЗА ДАННЫХ: УСЛУГИ 1-4)
// ==========================================================================
const plumbingInfoData = {
     'filter': {
        mainTitle: "💧 ИНДИВИДУАЛЬНАЯ КАРТА УСЛУГИ: ЗАМЕНА ФИЛЬТРОВ ДЛЯ ВОДЫ",
        stepsHTML: `
            <!-- ========================================== -->
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЙ ПОШАГОВЫЙ ПРОЦЕСС РАБОТЫ -->
            <!-- ========================================== -->
            <div style="width: 100% !important; margin-bottom: 50px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ Что входит в стоимость работы под ключ:</h5>
                
                <!-- 🎯 Этот специальный класс заставит шаги встать горизонтально -->
                <div class="horizontal-infographic-row">
                    
                    <!-- Шаг 1 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-shutoff" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Подготовка и безопасность</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Перекрываю входные краны водоснабжения, сбрасываю остаточное давление в системе и аккуратно подготавливаю рабочую зону под мойкой.</p>
                        </div>
                    </div>
                    
                    <!-- Шаг 2 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-filter-change" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Замена и обслуживание</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Спецключом откручиваю колбы, утилизирую старые забитые картриджи, провожу полную промывку корпусов от слизи/ржавчины и устанавливаю новые фильтры.</p>
                        </div>
                    </div>
                    
                    <!-- Шаг 3 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-filter-launch" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Запуск и тест резинок</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Смазываю или меняю уплотнительные кольца, плавно запускаю воду, выполняю общую промывку угольной пыли и проверяю систему на протечки под давлением.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ========================================== -->
            <!-- ЗОНА 2: ИНФОРМАЦИОННАЯ ШПАРГАЛКА (НИЖЕ ШАГОВ НА ВСЮ ШИРИНУ) -->
            <!-- ========================================== -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📅 Памятка владельца: Типы фильтров и сроки замены</h5>
                
                <p style="font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important; margin: 0 0 15px 0 !important;">
                    В современных квартирах Минска чаще всего устанавливаются **трехступенчатые проточные фильтры** или **системы обратного осмоса** под кухонную мойку. Чтобы пить чистую воду без вреда для здоровья, меняйте элементы вовремя:
                </p>
                

    <ul style="margin: 0 0 20px 20px !important; padding: 0 !important; font-size: 14px !important; color: #475569 !important; line-height: 1.6 !important;">
        <li style="margin-bottom: 8px !important;"><strong>1-я ступень (Механика):</strong> замена каждые <strong>3–6 месяцев</strong> (грубая очистка от ржавчины, песка и окалин из водопровода).</li>
        <li style="margin-bottom: 8px !important;"><strong>2-я ступень (Ионообменное умягчение или Уголь):</strong> замена каждые <strong>6–12 месяцев</strong> (смола убирает накипь в чайнике, а уголь очищает от запахов и хлора).</li>
        <li style="margin-bottom: 8px !important;"><strong>3-я ступень (Финишный Карбон-блок или Мембрана):</strong> замена раз в <strong>12–24 месяца</strong> (глубокое финишное кондиционирование воды или ультрафильтрация).</li>
    </ul>

                
                <p style="font-size: 13.5px !important; color: #ef4444 !important; font-weight: bold !important; margin: 0 !important; background: rgba(239, 68, 68, 0.05) !important; padding: 10px !important; border-radius: 8px !important; border-left: 4px solid #ef4444 !important;">
                    ⚠️ Главные сигналы к срочной замене: напор питьевой воды из маленького крана заметно ослаб, на чайнике начала появляться белая накипь, либо у воды изменился привкус. При обнаружении этих признаков картриджи забились и больше не очищают воду!
                </p>
            </div>

            <!-- ========================================== -->
            <!-- ЗОНА 3: СОЧНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ (СТА) -->
            <!-- ========================================== -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; box-shadow: 0 10px 20px rgba(0, 102, 204, 0.04) !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important;"> Нужна профессиональная замена фильтров без протечек?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Не рискуйте затопить кухонный гарнитур и соседей снизу из-за перекоса колб или закусывания старых прокладок. Я приеду со своим специнструментом, профессионально обслужу систему!
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important; box-shadow: 0 5px 15px rgba(0, 102, 204, 0.3) !important; transition: transform 0.2s ease, background 0.2s ease !important;" onmouseover="this.style.transform='scale(1.05)'; this.style.background='#0052a3';" onmouseout="this.style.transform='scale(1)'; this.style.background='#0066cc';">
                    📲 Связаться с мастером в Telegram
                </a>
            </div>
        `
    },


 
    'mixer': {
        mainTitle: "ИНДИВИДУАЛЬНАЯ КАРТА УСЛУГИ: УСТАНОВКА И ЗАМЕНА СМЕСИТЕЛЯ",
        stepsHTML: `
            <!-- ========================================== -->
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЙ ПОШАГОВЫЙ ПРОЦЕСС РАБОТЫ -->
            <!-- ========================================== -->
            <div style="width: 100% !important; margin-bottom: 50px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ Что входит в стоимость работы под ключ:</h5>
                
                <div class="horizontal-infographic-row">
                    
                    <!-- Шаг 1 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-mixer-demolish" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Демонтаж и очистка</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Перекрываю воду, аккуратно демонтирую старый прикипевший смеситель без повреждения плитки и тщательно вычищаю водорозетки от старого льна, ржавчины и налета.</p>
                        </div>
                    </div>
                    
                    <!-- Шаг 2 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-eccentric-align" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Ювелирная центровка</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Пакую латунные эксцентрики нитью. Выставляю их строго по межосевому расстоянию (150 мм), чтобы исключить перекос прибора.</p>
                        </div>
                    </div>
                    
                    <!-- Шаг 3 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-mixer-final" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Сборка и пуск без царапин</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Накручиваю гайки через мягкие прокладки  (ноль царапин на хроме!). Ставлю декоративные чашки, запускаю воду и проверяю давлением.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ========================================== -->
            <!-- ЗОНА 2: ПОЛЕЗНАЯ ИНФОРМАЦИЯ ДЛЯ ЗАКАЗЧИКА -->
            <!-- ========================================== -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📐 Гид покупателя: Как выбрать надежный смеситель</h5>
                
                <p style="font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important; margin: 0 0 15px 0 !important;">
                    Чтобы купленный смеситель для кухни или ванной комнаты не лопнул среди ночи и не затопил квартиру, держите 3 железных правила от мастера при походе в магазин:
                </p>
                
                <ul style="margin: 0 0 20px 20px !important; padding: 0 !important; font-size: 14px !important; color: #475569 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Материал — только Латунь или Нержавейка:</strong> Хороший смеситель обязан быть тяжелым. Вес корпуса — главный показатель толщины стенок. Обходите стороной легкие краны из <i>силумина</i> (порошкового алюминия) — они хрупкие и трескаются от гидроударов.</li>
                    <li style="margin-bottom: 8px !important;"><strong>Обращайте внимание на шланги (гибкую подводку):</strong> Комплектные шланги в коробках со смесителями часто короткие (всего 30 см) и с оплеткой из ржавеющего железа. Я рекомендую сразу докупить шланги нужной длины в оплетке строго из <strong>нержавеющей стали (St.Steel)</strong> с прочной латунной гайкой.</li>
                    <li style="margin-bottom: 8px !important;"><strong>Тип управления:</strong> Однорычажные смесители с керамическим картриджем внутри гораздо надежнее и удобнее в быту, чем старые двухвентильные краны с резиновыми прокладками, которые начинают капать каждые полгода.</li>
                </ul>
            </div>

            <!-- ========================================== -->
            <!-- ЗОНА 3: СОЧНЫЙ И ДРУЖЕЛЮБНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ (СТА) -->
            <!-- ========================================== -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; box-shadow: 0 10px 20px rgba(0, 102, 204, 0.04) !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important;">Нужна надежная установка смесителя?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Если вы хотите сэкономить свои силы, время и избавить себя от хлопот по монтажу сантехники, доверьте эту задачу профессионалу. Я оперативно приеду в любой район Минска со своим инструментом, качественно соберу и подключу новый смеситель, а также гарантирую идеальную герметичность всех соединений!
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important; box-shadow: 0 5px 15px rgba(0, 102, 204, 0.3) !important; transition: transform 0.2s ease, background 0.2s ease !important;" onmouseover="this.style.transform='scale(1.05)'; this.style.background='#0052a3';" onmouseout="this.style.transform='scale(1)'; this.style.background='#0066cc';">
                    📲 Связаться с мастером в Telegram
                </a>
            </div>

        `
    },




    'siphon': {
        mainTitle: "ИНДИВИДУАЛЬНАЯ КАРТА УСЛУГИ: ПОШАГОВАЯ ЗАМЕНА СИФОНА",
        stepsHTML: `
            <!-- ========================================== -->
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЙ ПОШАГОВЫЙ ПРОЦЕСС РАБОТЫ -->
            <!-- ========================================== -->
            <div style="width: 100% !important; margin-bottom: 50px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ Что входит в стоимость работы под ключ:</h5>
                
                <div class="horizontal-infographic-row">
                    
                    <!-- Шаг 1 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-siphon-remove" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Демонтаж и зачистка</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Аккуратно снимаю старую изношенную систему слива, полностью удаляю застарелые жировые отложения, волосы и грязь из раструба канализационной трубы.</p>
                        </div>
                    </div>
                    
                    <!-- Шаг 2 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-siphon-assemble" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Сборка новой колбы</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Проверяю комплектность нового сифона. Ювелирно выставляю конусные резиновые прокладки строго широкой стороной к гайке и плотно затягиваю резьбу вручную без перекосов пластика.</p>
                        </div>
                    </div>
                    
                    <!-- Шаг 3 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-siphon-final" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Подключение и тест</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Соединяю выпускную жесткую трубу или гофру с канализацией через плотную манжету. Набираю полную раковину воды и делаю резкий залповый слив для проверки герметичности стыков.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ========================================== -->
            <!-- ЗОНА 2: ПОЛЕЗНАЯ ИНФОРМАЦИЯ ДЛЯ ЗАКАЗЧИКА -->
            <!-- ========================================== -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📐 Памятка владельца: Зачем нужен сифон и как избежать засоров</h5>
                
                <p style="font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important; margin: 0 0 15px 0 !important;">
                    Сифон под кухонной мойкой, умывальником или ванной выполняет две важнейшие функции: задерживает мелкий мусор и создает водяной затвор (гидрозатвор), который на 100% блокирует проникновение неприятных запахов и газов из общей канализации в вашу квартиру.
                </p>
                
                <ul style="margin: 0 0 20px 20px !important; padding: 0 !important; font-size: 14px !important; color: #475569 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Бутылочный сифон против обычной гофры:</strong> Я настоятельно рекомендую устанавливать полноценные жесткие бутылочные сифоны с колбой (особенно на кухне). В отличие от обычной гибкой гофры, которая со временем растягивается, провисает и собирает на своих внутренних складках тонны жира и грязи, колбу сифона можно легко открутить и промыть за 5 минут.</li>
                    <li style="margin-bottom: 8px !important;"><strong>Когда пора менять деталь:</strong> Если пластик пожелтел, стал хрупким, резьбовые соединения начали подтекать даже после подтяжки гаек, а из раковины появился неприятный запах — это явные признаки того, что уплотнительные резинки рассохлись, и сифон пора полностью обновить.</li>
                </ul>
            </div>

            <!-- ========================================== -->
            <!-- ЗОНА 3: СОЧНЫЙ И ДРУЖЕЛЮБНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ (СТА) -->
            <!-- ========================================== -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; box-shadow: 0 10px 20px rgba(0, 102, 204, 0.04) !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important;">Хотите избавить себя от хлопот со сливом?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Если вы не хотите тратить свое время на грязную работу по разборке старого слива и замене сифона, доверьте это мастеру. Я оперативно приеду в любой район Минска, аккуратно соберу новую систему, правильно выставлю все прокладки и гарантирую полную сухость под вашей раковиной!
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important; box-shadow: 0 5px 15px rgba(0, 102, 204, 0.3) !important; transition: transform 0.2s ease, background 0.2s ease !important;" onmouseover="this.style.transform='scale(1.05)'; this.style.background='#0052a3';" onmouseout="this.style.transform='scale(1)'; this.style.background='#0066cc';">
                    📲 Связаться с мастером в Telegram
                </a>
            </div>
        `
    },





    'silicone': {
        mainTitle: "🧼 ИНДИВИДУАЛЬНАЯ КАРТА УСЛУГИ: ГЕРМЕТИЗАЦИЯ СТЫКОВ СИЛИКОНОМ",
        stepsHTML: `
            <!-- ========================================== -->
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЙ ПОШАГОВЫЙ ПРОЦЕСС РАБОТЫ -->
            <!-- ========================================== -->
            <div style="width: 100% !important; margin-bottom: 50px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ Что входит в стоимость работы под ключ:</h5>
                
                <div class="horizontal-infographic-row">
                    
                    <!-- Шаг 1 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-silicone-remove" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Удаление и дезинфекция</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Специальным скребком полностью срезаю старый потемневший герметик, тщательно вычищаю остатки силикона и обрабатываю шов мощным антисептиком против спор скрытой плесени.</p>
                        </div>
                    </div>
                    
                    <!-- Шаг 2 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-silicone-apply" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Подготовка и нанесение</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Обезжириваю поверхности спиртовым составом для идеальной сцепки, при необходимости оклеиваю края малярной лентой и пистолетом равномерно наношу свежую полосу герметика.</p>
                        </div>
                    </div>
                    
                    <!-- Шаг 3 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-silicone-final" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Формирование шва</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Специальным радиусным шпателем формирую абсолютно гладкий, вогнутый и плотный шов, по которому капли воды будут легко скатываться вниз, не задерживаясь на стыке.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ========================================== -->
            <!-- ЗОНА 2: ПОЛЕЗНАЯ ИНФОРМАЦИЯ ДЛЯ ЗАКАЗЧИКА -->
            <!-- ========================================== -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📐 Памятка владельца: Почему швы чернеют и какой герметик правильный</h5>
                
                <p style="font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important; margin: 0 0 15px 0 !important;">
                    Красивый стык между ванной и плиткой — это не только про внешний вид, но и про здоровье. Черные точки на швах — это опасная грибковая плесень, которая размножается во влажной среде.
                </p>
                
                <ul style="margin: 0 0 20px 20px !important; padding: 0 !important; font-size: 14px !important; color: #475569 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Только Санитарный силикон:</strong> В ванных комнатах и на кухнях нельзя использовать обычный универсальный силикон или дешевый акрил (акриловый герметик от влаги размокает и трескается). Я применяю исключительно профессиональный 100% силиконовый <strong>санитарный герметик</strong>, в состав которого входят сильные фунгициды — специальные добавки, которые годами блокируют появление грибка.</li>
                    <li style="margin-bottom: 8px !important;"><strong>Важное правило после монтажа:</strong> Свежему силиконовому шву необходимо дать полностью высохнуть и полимеризоваться. Пользоваться душем или раковиной нельзя в течение <strong>24 часов</strong> после окончания моих работ, чтобы герметик набрал максимальную прочность и намертво прилип к поверхностям.</li>
                </ul>
            </div>

            <!-- ========================================== -->
            <!-- ЗОНА 3: СОЧНЫЙ И ДРУЖЕЛЮБНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ (СТА) -->
            <!-- ========================================== -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; box-shadow: 0 10px 20px rgba(0, 102, 204, 0.04) !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important;">Хотите идеальные и чистые швы в ванной?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Если вам надоел потемневший стык вокруг раковины или ванны, а самостоятельное нанесение пугает неровными краями, доверьте это мне. Я аккуратно зачищу старый слой, продезинфицирую поверхность и сформирую безупречно ровный, герметичный шов!
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important; box-shadow: 0 5px 15px rgba(0, 102, 204, 0.3) !important; transition: transform 0.2s ease, background 0.2s ease !important;" onmouseover="this.style.transform='scale(1.05)'; this.style.background='#0052a3';" onmouseout="this.style.transform='scale(1)'; this.style.background='#0066cc';">
                    📲 Связаться с мастером в Telegram
                </a>
            </div>
        `
    },




// ==========================================================================
// 🗺️ ИНТЕРАКТИВНАЯ ИНФОГРАФИКА: ЧАСТЬ 2 ИЗ 3 (БАЗА ДАННЫХ: УСЛУГИ 5-8)
// ==========================================================================
     'clog': {
        mainTitle: "ИНДИВИДУАЛЬНАЯ КАРТА УСЛУГИ: ПРОФЕССИОНАЛЬНОЕ УСТРАНЕНИЕ ЗАСОРОВ",
        stepsHTML: `
            <!-- ========================================== -->
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЙ ПОШАГОВЫЙ ПРОЦЕСС РАБОТЫ -->
            <!-- ========================================== -->
            <div style="width: 100% !important; margin-bottom: 50px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ Что входит в стоимость работы под ключ:</h5>
                
                <div class="horizontal-infographic-row">
                    
                    <!-- Шаг 1 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-clog-inspect" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Локализация и метод</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Проверяю скорость ухода воды, определяю точное местонахождение пробки (в сифоне, гофре или глубоко в общедомовом лежаке) и подбираю оптимальный метод устранения без вреда для труб.</p>
                        </div>
                    </div>
                    
                    <!-- Шаг 2 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-clog-snake" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Механическая пробивка</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Применяю профессиональный гибкий сантехнический трос со специальными насадками. Бережно прохожу все углы канализации, полностью разрушая и вытаскивая пробку из волос, тряпок и бытового мусора.</p>
                        </div>
                    </div>
                    
                    <!-- Шаг 3 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-clog-flush" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Гидропромывка и тест</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">После устранения пробки промываю систему мощным залповым потоком горячей воды, смывая остатки налета со стенок труб. Делаю финальный тест на максимальную пропускную способность слива.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ========================================== -->
            <!-- ЗОНА 2: ПОЛЕЗНАЯ ИНФОРМАЦИЯ ДЛЯ ЗАКАЗЧИКА -->
            <!-- ========================================== -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📐 Совет мастера: Вся правда о химических средствах от засоров</h5>
                
                <p style="font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important; margin: 0 0 15px 0 !important;">
                    Когда вода в раковине встает колом, большинство людей сразу бегут за «Кротом» или другими едкими гелями. Вот почему при сильных засорах это плохая идея:
                </p>
                
                <ul style="margin: 0 0 20px 20px !important; padding: 0 !important; font-size: 14px !important; color: #475569 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Опасность для пластика:</strong> Жидкая химия при сильном засоре стоит в трубе часами. Вступая в реакцию с грязью, она сильно нагревается. Тонкие пластиковые гофры от высокой температуры деформируются, истончаются и могут дать течь прямо под мойкой.</li>
                    <li style="margin-bottom: 8px !important;"><strong>Образование пробки-камня:</strong> Если засор вызван жировыми отложениями на кухне, щелочные средства могут вступить с жиром в реакцию омыления. Вместо прочистки вы получите плотную белую пробку, похожую на мыльный камень, которую химией растворить уже невозможно — только пробивать тросом.</li>
                    <li style="margin-bottom: 8px !important;"><strong>Профилактика:</strong> Чтобы реже сталкиваться с засорами, раз в неделю проливайте слив кухни в течение 5 минут просто большим напором горячей воды из-под крана и используйте копеечные защитные сеточки для сбора волос в ванной.</li>
                </ul>
            </div>

            <!-- ========================================== -->
            <!-- ЗОНА 3: СОЧНЫЙ И ДРУЖЕЛЮБНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ (СТА) -->
            <!-- ========================================== -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; box-shadow: 0 10px 20px rgba(0, 102, 204, 0.04) !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important;">Вода в раковине или ванне полностью встала?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Не тратьте деньги на бесполезную химию и не пытайтесь самостоятельно ковырять трубы подручными средствами, рискуя повредить стыки. Я оперативно приеду со специальным оборудованием, быстро и аккуратно удалю засор и верну вашей сантехнике идеальный слив!
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important; box-shadow: 0 5px 15px rgba(0, 102, 204, 0.3) !important; transition: transform 0.2s ease, background 0.2s ease !important;" onmouseover="this.style.transform='scale(1.05)'; this.style.background='#0052a3';" onmouseout="this.style.transform='scale(1)'; this.style.background='#0066cc';">
                    📲 Связаться с мастером в Telegram
                </a>
            </div>
        `
    },



    'toilet': {
        mainTitle: "🚽 ИНДИВИДУАЛЬНАЯ КАРТА УСЛУГИ: РЕМОНТ БАЧКА УНИТАЗА",
        stepsHTML: `
            <!-- ========================================== -->
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЙ ПОШАГОВЫЙ ПРОЦЕСС РАБОТЫ -->
            <!-- ========================================== -->
            <div style="width: 100% !important; margin-bottom: 50px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ Что входит в стоимость работы под ключ:</h5>
                
                <div class="horizontal-infographic-row">
                    
                    <!-- Шаг 1 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-toilet-disassemble" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Разборка и дефектовка</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Аккуратно демонтирую кнопку слива и снимаю тяжелую керамическую крышку. Проверяю состояние заливного клапана, целостность мембраны и плотность прилегания сливного кольца.</p>
                        </div>
                    </div>
                    
                    <!-- Шаг 2 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-toilet-replace" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Замена механизмов</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Перекрываю воду, полностью выкручиваю старые изношенные узлы арматуры. При необходимости снимаю сам бачок, обновляю уплотнительную прокладку-пончик между бачком и чашей, после чего монтирую новую надежную бесшумную систему.</p>
                        </div>
                    </div>
                    
                    <!-- Шаг 3 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-toilet-adjust" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Тонкая настройка</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Регулирую высоту поплавка для экономного и достаточного набора воды, выставляю переливную трубку безопасности, центрирую кнопку слива и провожу серию тестов на полное отсутствие скрытых течей.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ========================================== -->
            <!-- ЗОНА 2: ПОЛЕЗНАЯ ИНФОРМАЦИЯ ДЛЯ ЗАКАЗЧИКА -->
            <!-- ========================================== -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📐 Памятка владельца: О скрытых опасностях неисправного бачка</h5>
                
                <p style="font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important; margin: 0 0 15px 0 !important;">
                    Проблемы со сливным бачком — это не повод покупать новый унитаз. Абсолютно любой фаянс можно вернуть к жизни, если вовремя и правильно обслужить внутренние механизмы.
                </p>
                
                <ul style="margin: 0 0 20px 20px !important; padding: 0 !important; font-size: 14px !important; color: #475569 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Экономия на коммунальных платежах:</strong> Еле заметная, тонкая струйка воды, непрерывно бегущая по чаше унизата из-за изношенной резиновой прокладки, способна «намотать» на счетчиках от <b>200 до 500 литров</b> лишней воды в сутки! Кроме того, постоянная течь быстро оставляет на чистом фарфоре уродливую желтую полосу ржавчины, которую потом ничем не отмыть.</li>
                    <li style="margin-bottom: 8px !important;"><strong>Опасность старых крепежных болтов:</strong> В старых моделях унитазов бачок прикручен к чаше металлическими болтами. Со временем от постоянной сырости они ржавеют, истончаются и в один прекрасный момент просто лопаются под давлением веса бачка. Это приводит к мгновенному залитию туалета холодной водой. При ремонте я всегда рекомендую менять старый крепеж на надежные латунные или пластиковые болты.</li>
                </ul>
            </div>

            <!-- ========================================== -->
            <!-- ЗОНА 3: СОЧНЫЙ И ДРУЖЕЛЮБНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ (СТА) -->
            <!-- ========================================== -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; box-shadow: 0 10px 20px rgba(0, 102, 204, 0.04) !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important;">Надоел постоянный шум воды в туалете?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Если ваш унитаз начал подтекать, бачок шумит по ночам или кнопка слива перестала нормально нажиматься, не откладывайте решение проблемы на потом. Я оперативно приеду со всеми необходимыми запчастями и защитным инструментом, быстро заменю неисправную арматуру и верну вашему санузлу идеальную тишину!
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important; box-shadow: 0 5px 15px rgba(0, 102, 204, 0.3) !important; transition: transform 0.2s ease, background 0.2s ease !important;" onmouseover="this.style.transform='scale(1.05)'; this.style.background='#0052a3';" onmouseout="this.style.transform='scale(1)'; this.style.background='#0066cc';">
                    📲 Связаться с мастером в Telegram
                </a>
            </div>
        `
    },


    'washer': {
        mainTitle: "🧺 ИНДИВИДУАЛЬНАЯ КАРТА УСЛУГИ: ПОДКЛЮЧЕНИЕ СТИРАЛЬНЫХ И ПОСУДОМОЕЧНЫХ МАШИН",
        stepsHTML: `
            <!-- ========================================== -->
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЙ ПОШАГОВЫЙ ПРОЦЕСС РАБОТЫ -->
            <!-- ========================================== -->
            <div style="width: 100% !important; margin-bottom: 50px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ Что входит в стоимость работы под ключ:</h5>
                
                <div class="horizontal-infographic-row">
                    
                    <!-- Шаг 1 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-washer-unpack" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Распаковка и подготовка</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Аккуратно снимаю заводскую упаковку. Специальным инструментом обязательно выкручиваю жесткие транспортировочные болты, которые удерживают барабан (если их оставить, машинка сломается при первом же запуске), и ставлю декоративные заглушки.</p>
                        </div>
                    </div>
                    
                    <!-- Шаг 2 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-washer-connect" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Врезка в коммуникации</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Подключаю заливной шланг через надежный металлический кран-тройник к водопроводу. Организую герметичный слив: врезаюсь напрямую в канализацию через специальную уплотнительную манжету или подключаю шланг к сифону раковины.</p>
                        </div>
                    </div>
                    
                    <!-- Шаг 3 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-washer-level" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Выравнивание и тест</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Выставляю корпус прибора строго по лазерному строительному уровню во всех плоскостях, плавно регулируя резьбовые ножки и контргайки. Запускаю тестовую экспресс-стирку для проверки забора, слива воды и отсутствия вибраций.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ========================================== -->
            <!-- ЗОНА 2: ПОЛЕЗНАЯ ИНФОРМАЦИЯ ДЛЯ ЗАКАЗЧИКА -->
            <!-- ========================================== -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📐 Памятка владельца: Как защитить новую технику от поломок и запахов</h5>
                
                <p style="font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important; margin: 0 0 15px 0 !important;">
                    Правильное подключение стиральной или посудомоечной машины напрямую влияет на срок её службы и безопасность вашей квартиры. Обратите внимание на два ключевых технических нюанса:
                </p>
                
                <ul style="margin: 0 0 20px 20px !important; padding: 0 !important; font-size: 14px !important; color: #475569 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>«Сифонный эффект» и неприятный запах:</strong> Если сливной шланг просто бросить на пол или подключить к канализации слишком низко, возникнет сифонный эффект. Грязная вода из раковины и кухонные запахи будут засасываться внутрь стиральной машины. По инструкции сливной шланг обязательно должен делать плавную верхнюю петлю на высоте <strong>не менее 60 см</strong> от пола перед входом в трубу.</li>
                    <li style="margin-bottom: 8px !important;"><strong>Зачем перекрывать вводной кран:</strong> Гибкие заливные шланги находятся под постоянным высоким давлением водопровода. Если вы уезжаете в отпуск или на выходные, внутреннее резиновое уплотнение шланга или клапан машинки может не выдержать резкого ночного гидроудара. Рекомендуется выбирать приборы с системой защиты Аквастоп (AquaStop) или просто перекрывать выделенный кран подачи воды, когда уезжаете надолго.</li>
                </ul>
            </div>

            <!-- ========================================== -->
            <!-- ЗОНА 3: СОЧНЫЙ И ДРУЖЕЛЮБНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ (СТА) -->
            <!-- ========================================== -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; box-shadow: 0 10px 20px rgba(0, 102, 204, 0.04) !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important;">Купили новую технику и хотите подключить её правильно?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Если вы не хотите разбираться в схемах подключения, крутить тугие болты и рисковать герметичностью труб под раковиной, доверьте эту задачу мне. Я оперативно приеду в любой район Минска со всем инструментом, надежно врежусь в коммуникации, идеально выровняю корпус по лазеру и полностью подготовлю вашу технику к долгой и бесшумной работе!
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important; box-shadow: 0 5px 15px rgba(0, 102, 204, 0.3) !important; transition: transform 0.2s ease, background 0.2s ease !important;" onmouseover="this.style.transform='scale(1.05)'; this.style.background='#0052a3';" onmouseout="this.style.transform='scale(1)'; this.style.background='#0066cc';">
                    📲 Связаться с мастером в Telegram
                </a>
            </div>
        `
    },




    'wc-replace': {
        mainTitle: "🚽 ИНДИВИДУАЛЬНАЯ КАРТА УСЛУГИ: ПРОФЕССИОНАЛЬНАЯ УСТАНОВКА И ЗАМЕНА УНИТАЗА",
        stepsHTML: `
            <!-- ========================================== -->
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЙ ПОШАГОВЫЙ ПРОЦЕСС РАБОТЫ -->
            <!-- ========================================== -->
            <div style="width: 100% !important; margin-bottom: 50px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ Что входит в стоимость работы под ключ:</h5>
                
                <div class="horizontal-infographic-row">
                    
                    <!-- Шаг 1 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-wc-demolish" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Аккуратный демонтаж</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Перекрываю подачу воды, осушаю бачок и чашу. Деликатно демонтирую старый унитаз и крепеж к полу, полностью очищая чугунный или пластиковый раструб канализации от застарелого цемента и герметика.</p>
                        </div>
                    </div>
                    
                    <!-- Шаг 2 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-wc-drill" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Крепление по уровню</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Подготавливаю основание пола. Делаю разметку, бурю плитку специальным безударным сверлом (чтобы не расколоть кафель), забиваю дюбели и жестко фиксирую новую чашу на мощные стальные сантехнические винты строго по уровню.</p>
                        </div>
                    </div>
                    
                    <!-- Шаг 3 -->
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-wc-seal" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4 style="font-size:16px !important; margin-bottom:8px !important; font-weight:800 !important;">Герметизация и пуск</h4>
                            <p style="font-size:13px !important; line-height:1.5 !important; color:#475569 !important; margin: 0 !important;">Соединяю выпуск унитаза с канализацией через плотную манжету с резиновыми лепестками, пакую гибкую подводку воды, герметизирую стык основания с полом санитарным силиконом и настраиваю арматуру бачка.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ========================================== -->
            <!-- ЗОНА 2: ПОЛЕЗНАЯ ИНФОРМАЦИЯ ДЛЯ ЗАКАЗЧИКА -->
            <!-- ========================================== -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📐 Памятка владельца: О типах выпусков и правильной установке</h5>
                
                <p style="font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important; margin: 0 0 15px 0 !important;">
                    Замена унитаза начинается ещё в магазине. Прежде чем оплатить понравившуюся модель, обязательно загляните за старый унитаз и посмотрите, под каким углом труба уходит в стену или пол.
                </p>
                
                <ul style="margin: 0 0 20px 20px !important; padding: 0 !important; font-size: 14px !important; color: #475569 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Обращайте внимание на направление выпуска:</strong> На рынке Минска есть три типа: <b>косой выпуск</b> (под углом 45°, классика для советских домов и панелек), <b>горизонтальный прямой выпуск</b> (уходит ровно в стену, стандарт для большинства новостроек) и <b>вертикальный выпуск</b> (уходит прямо в пол, встречается в частных домах или сталинках). Если ошибиться с выбором, новый унитаз либо сильно выдвинется вперед в коридор, либо его вообще не получится подключить.</li>
                    <li style="margin-bottom: 8px !important;"><strong>Почему нельзя сажать на глухой цемент или плиточный клей:</strong> Старые мастера намертво вмазывали унитазы в раствор. Делать так со сменным современным фаянсом категорически запрещено. Керамика расширяется от тепла и сжимается от холодной воды — жесткий раствор может просто расколоть основание. Кроме того, если у вас случайно упадет тяжелый флакон в чашу и разобьет её, «вцементированный» унитаз придется выбивать кувалдой вместе с напольной плиткой. Я монтирую сантехнику строго на съемные винты, заполняя шов по периметру эластичным герметиком.</li>
                </ul>
            </div>

            <!-- ========================================== -->
            <!-- ЗОНА 3: СОЧНЫЙ И ДРУЖЕЛЮБНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ (СТА) -->
            <!-- ========================================== -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; box-shadow: 0 10px 20px rgba(0, 102, 204, 0.04) !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important;">Купили новый унитаз и ищете мастера для надежной установки?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Если вы хотите избавить себя от хлопот по демонтажу тяжелой старой сантехники, грязной работы с канализацией и риска расколоть новый фаянс, доверьте это мне. Я оперативно приеду в любой район Минска, аккуратно демонтирую старую систему, надежно закреплю новую чашу без повреждения!
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important; box-shadow: 0 5px 15px rgba(0, 102, 204, 0.3) !important; transition: transform 0.2s ease, background 0.2s ease !important;" onmouseover="this.style.transform='scale(1.05)'; this.style.background='#0052a3';" onmouseout="this.style.transform='scale(1)'; this.style.background='#0066cc';">
                    📲 Связаться с мастером в Telegram
                </a>
            </div>
        `
    },

};








// ==========================================================================
// 🛋️ БАЗА ДАННЫХ И ФУНКЦИЯ ОТКРЫТИЯ ДЛЯ СБОРКИ МЕБЕЛИ
// ==========================================================================

// Пока оставляем базу пустой, чтобы наполнять её строго по пунктам
// ==========================================================================
// 🛋️ ОБЪЕДИНЕННАЯ БАЗА ДАННЫХ ДЛЯ СБОРКИ МЕБЕЛИ (ИСПРАВЛЕНЫ СКОБКИ)
// ==========================================================================
const furnitureInfoData = {
    'wardrobe': {
        mainTitle: "🛋️ ПРОФЕССИОНАЛЬНАЯ СБОРКА И МОНТАЖ ШКАФА-КУПЕ",
        stepsHTML: `
            <div style="width: 100% !important; margin-bottom: 40px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ ЭТАПЫ СБОРКИ ШКАФА-КУПЕ:</h5>
                <div class="horizontal-infographic-row">
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-wardrobe-frame" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details"><h4>Сборка каркаса</h4><p>Собираю короб шкафа, жестко фиксирую заднюю стенку ХДФ и выставляю жесткую геометрию диагоналей.</p></div>
                    </div>
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-wardrobe-track" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details"><h4>Направляющие</h4><p>Устанавливаю алюминиевые треки на пол и потолок шкафа строго по уровню для плавного хода роликов.</p></div>
                    </div>
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-wardrobe-door" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details"><h4>Регулировка дверей</h4><p>Навешиваю раздвижные фасады, настраиваю нижние ролики по уровню стен и наклеиваю буферную щетку.</p></div>
                    </div>
                </div>
            </div>
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📋 Полезные советы: Что важно проверить перед установкой шкафа-купе</h5>
                <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Ровный пол:</strong> Если у вас кривой пол, двери-купе будут сами откатываться в сторону уклона. Я всегда компенсирую неровности регулировкой опор.</li>
                    <li style="margin-bottom: 0 !important;"><strong>Задняя стенка:</strong> ХДФ панели нельзя прибивать гвоздями, со временем они выдавится наружу. Я фиксирую её исключительно на качественные строительные саморезы.</li>
                </ul>
            </div>
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Купили новый шкаф-купе?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">Соберу встроенный или отдельно стоящий шкаф любой сложности. Отрегулирую плавный ход дверей. Приеду со своим инструментом в любой район Минска.</p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
        `
    }, // 👈 ТЕПЕРЬ ТУТ СТОИТ ЗАКРЫВАЮЩАЯ СКОБКА И ЗАПЯТАЯ, КОТОРЫЕ СВЯЗЫВАЮТ ИХ ДРУГ С ДРУГОМ!
    
    'kitchen': {
        mainTitle: "🍳 ПРОФЕССИОНАЛЬНАЯ СБОРКА КУХНИ ПОД КЛЮЧ",
        stepsHTML: `
            <div style="width: 100% !important; margin-bottom: 40px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ ЭТАПЫ СБОРКИ КУХОННОГО ГАРНИТУРА:</h5>
                <div class="horizontal-infographic-row">
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-kitchen-base" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details"><h4>Нижние базы</h4><p>Собираю нижние столы, выставляю их строго в горизонт по лазеру регулируемыми ножками, стягиваю между собой и монтирую столешницу.</p></div>
                    </div>
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-kitchen-cut" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details"><h4>Врезка техники</h4><p>Делаю аккуратные выпилы в столешнице под мойку и варочную панель, обрабатываю все срезы качественным влагостойким герметиком.</p></div>
                    </div>
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-kitchen-top" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details"><h4>Навеска и фасады</h4><p>Монтирую металлическую шину, вешаю верхние шкафы на регулируемые навесы, ставлю фасады, доводчики и выставляю идеальные ровные зазоры.</p></div>
                    </div>
                </div>
            </div>
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📋 Полезные советы: Как защитить новую кухню от разбухания от влаги</h5>
                <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Обработка спилов:</strong> Самое уязвимое место любой кухни — края ДСП вокруг раковины. Я всегда наношу обильный слой сантехнического силикона на все внутренние спилы, чтобы защитить их от разбухания.</li>
                    <li style="margin-bottom: 0 !important;"><strong>Вентиляция техники:</strong> Встроенная техника выделяет много тепла. При сборке пеналов важно оставлять зазоры для циркуляции воздуха, иначе приборы будут перегреваться.</li>
                </ul>
            </div>
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Заказали новую кухню и нужен монтаж под ключ?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">Соберу кухонный гарнитур любой сложности. Профессионально сделаю все врезки, установлю встроенную технику и навешу шкафы. Приеду со своим инструментом в любой район Минска.</p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
      `
    },

        'table': {
        mainTitle: "🛋️ СБОРКА СТОЛОВ, СТУЛЬЕВ И КОМПЬЮТЕРНЫХ КРЕСЕЛ",
        stepsHTML: `
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЕ ШАГИ РАБОТЫ -->
            <div style="width: 100% !important; margin-bottom: 40px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ ЭТАПЫ СБОРКИ МЕБЕЛИ:</h5>
                <div class="horizontal-infographic-row">
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-table-legs" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4>Сборка каркаса</h4>
                            <p>Собираю основание, подстолье или металлический рамный каркас, плотно затягиваю все силовые болты и крепежи.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-table-top" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4>Монтаж элементов</h4>
                            <p>Ровно центрирую и фиксирую столешницу, сиденье или спинку кресла на фабричные винты и мебельные евровинты.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-table-glides" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4>Регулировка</h4>
                            <p>Настраиваю высоту ножек по уровню пола, проверяю работу газлифта у кресел и наклеиваю мягкие защитные фетровые подпятники.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ЗОНА 2: БЛОК С ПОЛЕЗНЫМИ СОВЕТАМИ МАСТЕРА -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📋 Полезные советы: Чтобы стол и стулья не шатались со временем</h5>
                <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Протяжка болтов:</strong> Стулья и обеденные столы испытывают постоянные динамические нагрузки. Из-за этого резьбовые соединения могут постепенно разбалтываться. Рекомендую раз в год проверять и слегка подтягивать основные крепежные винты.</li>
                    <li style="margin-bottom: 0 !important;"><strong>Защита ламината:</strong> Пластиковые заводские заглушки на ножках стульев очень жесткие и со временем могут сильно исцарапать паркет или линолеум. Я всегда устанавливаю специальные мягкие войлочные или фетровые прокладки.</li>
                </ul>
            </div>

            <!-- ЗОНА 3: СКРОМНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Купили новый стол или офисное кресло?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Быстро и ровно соберу обеденный, письменный стол, кухонные стулья или сложное компьютерное кресло с механизмами регулировки. Приеду со своим инструментом в любой район Минска.
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
        `
    },


    'dresser': {
        mainTitle: "🛋️ ПРОФЕССИОНАЛЬНАЯ СБОРКА КОМОДОВ, ТУМБ И ПРИХОЖИХ",
        stepsHTML: `
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЕ ШАГИ РАБОТЫ -->
            <div style="width: 100% !important; margin-bottom: 40px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ ЭТАПЫ СБОРКИ КОРПУСНОЙ МЕБЕЛИ:</h5>
                <div class="horizontal-infographic-row">
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-dresser-frame" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4>Сборка корпуса</h4>
                            <p>Собираю основной каркас комода или тумбы, жестко фиксирую стяжки и выставляю ровные диагонали.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-dresser-rail" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4>Направляющие</h4>
                            <p>Размечаю и монтирую роликовые или телескопические направляющие на боковины строго параллельно друг другу.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-dresser-drawer" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4>Сборка ящиков</h4>
                            <p>Собираю выдвижные ящики, креплю ручки, устанавливаю фасады и регулирую зазоры, чтобы всё ходило плавно.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ЗОНА 2: БЛОК С ПОЛЕЗНЫМИ СОВЕТАМИ МАСТЕРА -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📋 Полезные советы: Чтобы ящики комода не заклинивали и не перекашивались</h5>
                <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Тип направляющих:</strong> Шариковые направляющие (телескопические) служат гораздо дольше и выдерживают больший вес, чем дешевые роликовые. При сборке я всегда проверяю соосность, чтобы механизмы двигались мягко и без усилий.</li>
                    <li style="margin-bottom: 0 !important;"><strong>Защита от опрокидывания:</strong> Высокие и узкие комоды при одновременном выдвижении нескольких загруженных ящиков могут опасно наклониться вперед. Рекомендую фиксировать такую мебель к стене на специальные скрытые мебельные уголки.</li>
                </ul>
            </div>

            <!-- ЗОНА 3: СКРОМНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Нужно собрать комод или мебель в прихожую?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Качественно соберу комод, тумбу под ТВ, обувницу или модульную прихожую. Отрегулирую все выдвижные механизмы и петли. Приеду со своим профессиональным инструментом в любой район Минского региона.
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
        `
    },


    'bed': {
        mainTitle: "🛋️ НАДЕЖНАЯ СБОРКА ОДНОСПАЛЬНЫХ И ДВУХСПАЛЬНЫХ КРОВАТЕЙ",
        stepsHTML: `
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЕ ШАГИ РАБОТЫ -->
            <div style="width: 100% !important; margin-bottom: 40px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ ЭТАПЫ СБОРКИ КРОВАТИ:</h5>
                <div class="horizontal-infographic-row">
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-bed-frame" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4>Сборка каркаса</h4>
                            <p>Соединяю царги и изголовье кровати, жестко стягиваю угловые крепления и монтирую опорные ножки.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-bed-slats" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4>Основание и лифты</h4>
                            <p>Устанавливаю ортопедическую решетку, ламели, либо монтирую и настраиваю подъемный механизм с газлифтами.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-bed-final" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4>Чистовая фиксация</h4>
                            <p>Проверяю плавность работы подъемной системы, креплю упоры для матраса и тестирую каркас под нагрузкой на отсутствие люфтов.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ЗОНА 2: БЛОК С ПОЛЕЗНЫМИ СОВЕТАМИ МАСТЕРА -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📋 Полезные советы: Чтобы кровать не начала скрипеть через месяц</h5>
                <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Протяжка всех соединений:</strong> Скрип появляется из-за трения деревянных элементов друг о друга при ослаблении крепежа. При сборке я плотно затягиваю все силовые болты. Настоятельно рекомендую использовать мягкие прокладки в местах стыков деревянных царг.</li>
                    <li style="margin-bottom: 0 !important;"><strong>Газлифты подъемного механизма:</strong> Никогда не пытайтесь закрыть подъемное основание без уложенного сверху матраса. Мощности новых газовых амортизаторов рассчитаны строго на вес матраса — без него вы можете погнуть стальной каркас или вырвать крепления из дерева.</li>
                </ul>
            </div>

            <!-- ЗОНА 3: СКРОМНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Купили кровать и нужна качественная сборка?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Соберу односпальную, двуспальную кровать или детскую мебель любой сложности, включая модели с подъемными механизмами и выдвижными ящиками. Быстро, надежно и аккуратно в Минске.
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
        `
    },



    'furniture-repair': {
        mainTitle: "🛋️ РЕМОНТ МЕБЕЛИ, ЗАМЕНА ПЕТЕЛЬ И ФУРНИТУРЫ",
        stepsHTML: `
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЕ ШАГИ РАБОТЫ -->
            <div style="width: 100% !important; margin-bottom: 40px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ ЭТАПЫ ВОССТАНОВЛЕНИЯ МЕБЕЛИ:</h5>
                <div class="horizontal-infographic-row">
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-repair-hinge" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4>Замена фурнитуры</h4>
                            <p>Демонтирую сломанные петли, провисшие газлифты или заклинившие направляющие и устанавливаю новые качественные механизмы.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-repair-brace" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4>Укрепление каркаса</h4>
                            <p>Устраняю люфты короба, перебираю расшатанные конфирматы, усиливаю угловые соединения стальными мебельными уголками.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-repair-align" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4>Регулировка</h4>
                            <p>Выставляю зазоры и плоскости фасадов, чтобы дверцы закрывались ровно, плотно и без затираний.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ЗОНА 2: БЛОК С ПОЛЕЗНЫМИ СОВЕТАМИ МАСТЕРА -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📋 Полезные советы: Как продлить срок службы кухонных петель и ящиков</h5>
                <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Своевременный ремонт:</strong> Если дверца шкафа провисла или начала тереться о соседний фасад, отрегулируйте или замените петлю сразу. Перекошенный механизм создает избыточную нагрузку на соседние узлы, что приводит к вырыванию саморезов из тела ДСП.</li>
                    <li style="margin-bottom: 0 !important;"><strong>Уход за механизмами:</strong> Направляющие выдвижных ящиков и подъемники (газлифты) очень боятся строительной пыли и грязи. Во время ремонта обязательно укрывайте мебель пленкой, а если ящики стали ходить туго — очистите рельсы от мусора без использования агрессивной смазки.</li>
                </ul>
            </div>

            <!-- ЗОНА 3: СКРОМНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Провисли двери или плохо выдвигаются ящики?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Быстро приеду со своим инструментом, подберу надежную фурнитуру на замену, укреплю расшатанный каркас шкафа или комода и идеально отрегулирую все фасады по уровню в Минске.
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
        `
    },


    'facade-align': {
        mainTitle: "🛋️ ВЫРАВНИВАНИЕ И РЕГУЛИРОВКА МЕБЕЛЬНЫХ ФАСАДОВ",
        stepsHTML: `
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЕ ШАГИ РАБОТЫ -->
            <div style="width: 100% !important; margin-bottom: 40px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ ЭТАПЫ РЕГУЛИРОВКИ ДВЕРЕЙ:</h5>
                <div class="horizontal-infographic-row">
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-facade-screw" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4>Настройка петель</h4>
                            <p>Регулирую винты мебельных петель в трех плоскостях: по высоте, глубине и ширине зазора.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-facade-laser" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4>Выравнивание</h4>
                            <p>Проверяю общие горизонтальные и вертикальные зазоры, устраняя перекосы.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-facade-final" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4>Ход и доводчики</h4>
                            <p>Настраиваю плавность закрывания, калибрую мебельные амортизаторы и проверяю надежность фиксации ручек.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ЗОНА 2: БЛОК С ПОЛЕЗНЫМИ СОВЕТАМИ МАСТЕРА -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📋 Полезные советы: Почему провисают мебельные фасады</h5>
                <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Ослабление винтов:</strong> Из-за постоянного открывания дверей регулировочные и крепежные винты петель со временем слегка выкручиваются под собственным весом фасада. Достаточно раз в пару лет делать профилактическую подтяжку.</li>
                    <li style="margin-bottom: 0 !important;"><strong>Нагрузка на дверцы:</strong> Никогда не вешайте на внутреннюю сторону дверей шкафов или кухонных баз тяжелые органайзеры, пакеты или полотенца. Мебельные петли рассчитаны строго на вес самого фасада, любая лишняя нагрузка быстро сорвет резьбу в ДСП.</li>
                </ul>
            </div>

            <!-- ЗОНА 3: СКРОМНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Двери шкафа трутся или висят криво?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Оперативно приеду в любой район Минска, идеально отрегулирую все фасады на кухне, в гостиной или спальне по уровню, устраню кривые зазоры и настрою мягкий ход дверей.
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
        `
    },



    'hourly-furniture': {
        mainTitle: "🛋️ ПОЧАСОВАЯ СБОРКА И РАЗБОРКА МЕБЕЛИ ПРИ ПЕРЕЕЗДАХ",
        stepsHTML: `
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЕ ШАГИ РАБОТЫ -->
            <div style="width: 100% !important; margin-bottom: 40px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ КАК СЧИТАЕТСЯ РАБОЧЕЕ ВРЕМЯ:</h5>
                <div class="horizontal-infographic-row">
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-hourly-check" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4>Оценка объема</h4>
                            <p>На месте изучаю фронт работ, фурнитуру, чертежи, схемы сборки и готовлю рабочее пространство.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-hourly-work" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4>Процесс сборки</h4>
                            <p>Аккуратно собираю или разбираю мебель, используя свой профессиональный инструмент.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-hourly-time" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4>Фиксация времени</h4>
                            <p>Завершаю монтаж, проверяю работу механизмов и фиксирую затраченное по часам.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ЗОНА 2: БЛОК С ПОЛЕЗНЫМИ СОВЕТАМИ МАСТЕРА -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📋 Полезные советы: Когда выгоднее выбирать почасовую оплату</h5>
                <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Большие переезды:</strong> Почасовой тариф идеален, если вам нужно разобрать, перевезти и заново собрать много разнородной мебели (столы, стулья, стеллажи, кровати), где оценка каждого предмета по отдельности выйдет дороже.</li>
                    <li style="margin-bottom: 0 !important;"><strong>Сортировка фурнитуры:</strong> При самостоятельной разборке мебели перед переездом всегда складывайте крепежные винты, петли и ручки от каждого шкафа в отдельные подписанные пакеты. Это сэкономит кучу времени при сборке на новом месте и снизит итоговую стоимость работы.</li>
                </ul>
            </div>

            <!-- ЗОНА 3: СКРОМНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Нужна масштабная сборка или разборка мебели?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Приеду со всем необходимым электроинструментом для больших объемов работ. Работаю быстро, аккуратно и честно фиксирую время. Помогу с мебелью при квартирных или офисных переездах в Минске.
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
        `
    },

};


// Отдельная функция, которая управляет только мебельной панелью
function openFurnitureInfo(type) {
    const dropdown = document.getElementById('tile-info-dropdown-furniture');
    const titleZone = document.getElementById('tile-info-title-furniture');
    const textZone = document.getElementById('tile-info-text-furniture');
    
    if (!dropdown || !titleZone || !textZone) return;
    
    const data = furnitureInfoData[type];
    if (!data) {
        console.warn(`Данные для мебели с ключом "${type}" пока не добавлены.`);
        return;
    }
    
    titleZone.innerHTML = data.mainTitle;
    textZone.innerHTML = data.stepsHTML;
    
    dropdown.classList.add('active-info');
    
    // Блокируем лишние стрелки шаблона внутри мебели
    const badArrows = textZone.querySelectorAll('.infographic-arrow');
    badArrows.forEach(function(arrow) {
        arrow.style.setProperty('display', 'none', 'important');
    });
    
    // Рисуем синюю линию связи за номерами шагов на мониторах
    const lineRow = textZone.querySelector('.horizontal-infographic-row');
    if (lineRow && window.innerWidth > 900) {
        lineRow.style.setProperty('position', 'relative', 'important');
        lineRow.style.setProperty('background', 'linear-gradient(to right, transparent 15%, #0066cc 15%, #0066cc 85%, transparent 85%) no-repeat center 150px / 100% 2px', 'important');
    }
    
    setTimeout(function() {
        dropdown.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 60);
}













// ==========================================================================
// 🔨 БАЗА ДАННЫХ И ФУНКЦИЯ ОТКРЫТИЯ ДЛЯ МЕЛКОГО РЕМОНТА (МУЖ НА ЧАС)
// ==========================================================================

const repairInfoData = {
    'lock-repair': {
        mainTitle: "🔑 ПРОФЕССИОНАЛЬНАЯ ЗАМЕНА И ВРЕЗКА ДВЕРНЫХ ЗАМКОВ",
        stepsHTML: `
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЕ ШАГИ РАБОТЫ -->
            <div style="width: 100% !important; margin-bottom: 40px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ ЭТАПЫ ЗАМЕНЫ ДВЕРНОГО ЗАМКА:</h5>
                <div class="horizontal-infographic-row">
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-lock-old" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4>Демонтаж старого</h4>
                            <p>Выкручиваю фиксирующие винты, аккуратно извлекаю сломанную личинку или весь корпус старого замка, не повреждая дверное полотно.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-lock-fit" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4>Подгонка и врезка</h4>
                            <p>Зачищаю посадочное гнездо в двери, подгоняю размеры под новый механизм и, если нужно, аккуратно дорабатываю ответную планку на коробке.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-lock-final" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4>Монтаж и проверка</h4>
                            <p>Устанавливаю новую сердцевину, жестко фиксирую стяжные болты, монтирую ручки и многократно тестирую плавность хода ключа.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ЗОНА 2: БЛОК С ПОЛЕЗНЫМИ СОВЕТАМИ МАСТЕРА -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📋 Полезные советы: Как правильно подобрать замок или личинку на замену</h5>
                <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Размер сердцевины (личинки):</strong> Цилиндры замков бывают разной длины и со смещением центра (например, 30х40 мм или 40х40 мм). Чтобы новая личинка не торчала наружу или не утонула глубоко в двери, лучше всего снимать её размеры строго после демонтажа старой.</li>
                    <li style="margin-bottom: 0 !important;"><strong>Заклинивание ключа:</strong> Если ключ в замке начал проворачиваться с трудом, заедать или застревать, никогда не заливайте внутрь обычное подсолнечное масло — оно соберет всю пыль и намертво забьет пины. Используйте только специальную графитовую или силиконовую смазку, а лучше сразу замените изношенную личинку.</li>
                </ul>
            </div>

            <!-- ЗОНА 3: СКРОМНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Заклинил замок или потеряли ключи?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Оперативно приеду со своим инструментом в любой район Минска. Помогу быстро заменить личинку, установить новый надежный замок в металлическую или межкомнатную дверь и отрегулировать ручки.
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
        `
    },



    'tv-mount': {
        mainTitle: "📺 НАДЕЖНЫЙ МОНТАЖ КРОНШТЕЙНА И НАВЕСКА ТЕЛЕВИЗОРА",
        stepsHTML: `
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЕ ШАГИ РАБОТЫ -->
            <div style="width: 100% !important; margin-bottom: 40px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ ЭТАПЫ МОНТАЖА ТЕЛЕВИЗОРА:</h5>
                <div class="horizontal-infographic-row">
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-tv-drill" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4>Разметка и бурение</h4>
                            <p>Выверяю высоту под уровень глаз по лазеру, размечаю точки крепления и аккуратно бурю стену без лишней пыли.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-tv-mount" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4>Монтаж кронштейна</h4>
                            <p>Намертво фиксирую стальную рамку на стене, подбирая мощные дюбели строго под материал ваших стен (бетон или блоки).</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-tv-final" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4>Навеска экрана</h4>
                            <p>Закрепляю ответные лапы на ТВ, аккуратно навешиваю панель на кронштейн, фиксирую стопорные винты от падения и подключаю провода.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ЗОНА 2: БЛОК С ПОЛЕЗНЫМИ СОВЕТАМИ МАСТЕРА -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📋 Полезные советы: На что обратить внимание при выборе и монтаже кронштейна</h5>
                <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Стены из гипсокартона:</strong> Повесить большой и тяжелый телевизор напрямую на один слой гипсокартона нельзя — со временем дюбели вырвет из мягкого листа. Для таких стен я всегда нахожу металлический профиль каркаса с помощью магнита или использую специальные раскрывающиеся стальные дюбели типа "Молли".</li>
                    <li style="margin-bottom: 0 !important;"><strong>Стандарт VESA и болты:</strong> У каждого телевизора сзади есть 4 резьбовых отверстия для крепления, расстояние между которыми называется стандартом VESA (например, 200х200 или 400х400 мм). Кронштейн должен строго поддерживать размеры вашего ТВ. Кроме того, я всегда подбираю правильную длину болтов из комплекта, чтобы случайно не продавить матрицу изнутри.</li>
                </ul>
            </div>

            <!-- ЗОНА 3: СКРОМНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Купили новый телевизор и нужен надежный монтаж?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Надежно смонтирую фиксированный, наклонный или поворотный кронштейн на любую стену. Выставлю экран идеально ровно по лазеру и надежно зафиксирую фиксаторы. Приеду со своими мощными перфораторами и крепежом в любой район Минска.
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
        `
    },


    'curtain-mount': {
        mainTitle: "🪟 НАДЕЖНЫЙ МОНТАЖ СТЕНОВЫХ И ПОТОЛОЧНЫХ КАРНИЗОВ",
        stepsHTML: `
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЕ ШАГИ РАБОТЫ -->
            <div style="width: 100% !important; margin-bottom: 40px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ ЭТАПЫ УСТАНОВКИ КАРНИЗА:</h5>
                <div class="horizontal-infographic-row">
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-curtain-laser" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4>Разметка по лазеру</h4>
                            <p>Высчитываю одинаковый отступ от откосов окна, выставляю идеальный уровень по лазеру и намечаю точки для кронштейнов.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-curtain-drill" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4>Бурение и дюбели</h4>
                            <p>Беру мощный перфоратор с пылеудалением, аккуратно высверливаю отверстия в бетоне или кирпиче и забиваю прочные дюбели.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-curtain-final" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4>Сборка и фиксация</h4>
                            <p>Жестко прикручиваю держатели винтами, собираю штангу или шину, надежно затягиваю стопоры и проверяю конструкцию под нагрузкой.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ЗОНА 2: БЛОК С ПОЛЕЗНЫМИ СОВЕТАМИ МАСТЕРА -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📋 Полезные советы: Что важно учесть при монтаже карниза</h5>
                <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Вынос от стены:</strong> Длина кронштейнов настенного карниза должна быть такой, чтобы шторы в будущем свободно свисали и не ложились на выступающий подоконник или радиатор отопления. Идеальный отступ — минимум 10-15 см от окна.</li>
                    <li style="margin-bottom: 0 !important;"><strong>Стены из рыхлых материалов:</strong> В старых домах или новостройках с газосиликатными блоками стандартный комплектный крепеж из коробки карниза не удержит тяжелую ткань. В таких случаях я всегда заменяю стандартные дюбели на специальные раскрывающиеся анкеры или дюбели для блоков, гарантируя мертвую посадку.</li>
                </ul>
            </div>

            <!-- ЗОНА 3: СКРОМНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Купили новый карниз для штор?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Профессионально смонтирую круглые штанги, потолочные пластиковые шины или скрытые профили на любую поверхность. Выставлю идеальный горизонт без пыли. Приеду со своими инструментами в любой район Минска.
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
        `
    },



    'mirror-mount': {
        mainTitle: "🖼️ НАДЕЖНАЯ НАВЕСКА ЗЕРКАЛ, КАРТИН И ПРЕДМЕТОВ ИНТЕРЬЕРА",
        stepsHTML: `
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЕ ШАГИ РАБОТЫ -->
            <div style="width: 100% !important; margin-bottom: 40px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ ЭТАПЫ НАВЕСКИ И МОНТАЖА:</h5>
                <div class="horizontal-infographic-row">
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-mirror-laser" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4>Лазерная разметка</h4>
                            <p>Выверяю идеальное положение, высоту по уровню глаз и размечаю точки крепежа строго по осям с помощью лазерного уровня.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-mirror-drill" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4>Бурение под крепеж</h4>
                            <p>Высверливаю аккуратные отверстия перфоратором с пылесосом, уберегая плитку или обои, и устанавливаю прочные дюбели.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-mirror-final" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4>Монтаж и навеска</h4>
                            <p>Вкручиваю мощные метизы, навешиваю зеркало или картину на скрытые крепления, проверяю плотность прилегания и надежность фиксации.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ЗОНА 2: БЛОК С ПОЛЕЗНЫМИ СОВЕТАМИ МАСТЕРА -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📋 Полезные советы: Как безопасно вешать тяжелые зеркала в ванной</h5>
                <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Сверление плитки:</strong> При монтаже зеркал в ванной на керамогранит или кафель обычный перфоратор использовать нельзя — плитка мгновенно треснет. Для этого я использую специальные безударные алмазные трубчатые сверла и охлаждаю место реза водой, проходя деликатный слой идеально чисто.</li>
                    <li style="margin-bottom: 0 !important;"><strong>Скрытый крепеж:</strong> Тяжелые современные зеркала со светодиодной LED-подсветкой требуют жесткого и плотного подвешивания, чтобы за ними не скапливалась лишняя влага. Я всегда использую металлические пластины со специальными зацепами, которые намертво притягивают раму к стене.</li>
                </ul>
            </div>

            <!-- ЗОНА 3: СКРОМНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Купили большое зеркало или тяжелую картину?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Ровно и надежно повешу зеркала любых размеров, картины, фоторамки или настенные часы. Работаю аккуратно, без строительной пыли и грязи. Приеду со своим крепежом и лазерным уровнем в любой район Минска.
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
        `
    },



    'dryer-mount': {
        mainTitle: "🧺 ПРОФЕССИОНАЛЬНАЯ УСТАНОВКА И МОНТАЖ БАЛКОННЫХ СУШИЛОК",
        stepsHTML: `
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЕ ШАГИ РАБОТЫ -->
            <div style="width: 100% !important; margin-bottom: 40px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ ЭТАПЫ МОНТАЖА СУШИЛКИ:</h5>
                <div class="horizontal-infographic-row">
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-dryer-drill" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4>Разметка и бурение</h4>
                            <p>Размечаю потолок или стены балкона с учетом открывания оконных створок, аккуратно бурю перфоратором бетонное перекрытие.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-dryer-roller" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4>Фиксация роликов</h4>
                            <p>Монтирую потолочные направляющие планки с роликовыми шкивами на прочные металлические дюбели или анкеры.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-dryer-final" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4>Запасовка и сборка</h4>
                            <p>Протягиваю и калибрую шнуры через ролики, закрепляю пристенную скобу-гребенку, навешиваю трубки и настраиваю высоту уровней.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ЗОНА 2: БЛОК С ПОЛЕЗНЫМИ СОВЕТАМИ МАСТЕРА -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📋 Полезные советы: Что важно учесть при установке сушилки типа «Лиана»</h5>
                <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Открывание окон балконной рамы:</strong> Самая частая и глупая ошибка при самостоятельной установке — смонтировать сушилку вплотную к стене с окном. Когда вы повесите сушить белье, трубки опустятся вниз и заблокируют открывание створок рамы. Я всегда замеряю ход окон перед бурением, отступая безопасное расстояние.</li>
                    <li style="margin-bottom: 0 !important;"><strong>Обшивка потолка (ПВХ, вагонка):</strong> Если потолок балкона уже зашит пластиковыми панелями или деревянной вагонкой, крепить сушилку напрямую к декоративной отделке нельзя — тяжелый вес белья сорвет её. В таких случаях монтаж выполняется на длинные саморезы (или анкеры) насквозь через обшивку строго в бетонную плиту или деревянный каркас обрешетки.</li>
                </ul>
            </div>

            <!-- ЗОНА 3: СКРОМНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Нужно установить сушилку для белья на балконе?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Надежно смонтирую потолочную или настенную сушилку («Лиана», раздвижную, гармошку) на балконе или в ванной комнате. Закреплю прочно с гарантией на любой тип стен и потолков. Приеду со своим инструментом и крепежом в любой район Минска.
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
        `
    },



    'skirting-mount': {
        mainTitle: "🪵 АККУРАТНЫЙ МОНТАЖ И УСТАНОВКА НАПОЛЬНЫХ ПЛИНТУСОВ",
        stepsHTML: `
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЕ ШАГИ РАБОТЫ -->
            <div style="width: 100% !important; margin-bottom: 40px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ ЭТАПЫ МОНТАЖА ПЛИНТУСА:</h5>
                <div class="horizontal-infographic-row">
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-skirting-cut" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4>Запил и подгонка</h4>
                            <p>Точно нарезаю плинтус в размер помещения, ювелирно запиливаю углы под 45 градусов для плотной стыковки планок.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-skirting-drill" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4>Надежная фиксация</h4>
                            <p>Бурю стены, устанавливаю скрытые клипсы, дюбели или фиксирую планки на жидкие гвозди строго без зазоров к полу.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-skirting-final" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4>Чистовая сборка</h4>
                            <p>Укладываю кабели в скрытый кабель-канал, монтирую заглушки, соединители, внешние и внутренние угловые элементы.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ЗОНА 2: БЛОК С ПОЛЕЗНЫМИ СОВЕТАМИ МАСТЕРА -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📋 Полезные советы: Как правильно выбрать тип плинтуса и способ его крепежа</h5>
                <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Способ крепления к стенам:</strong> Напольный плинтус категорически запрещено крепить напрямую к напольному покрытию (ламинату или паркетной доске). Пол должен свободно "дышать" и расширяться. Каркас плинтуса монтируется исключительно к стенам. Если стены из рыхлого гипсокартона, я использую специальный клей или дюбели-бабочки.</li>
                    <li style="margin-bottom: 0 !important;"><strong>Скрытый кабель-канал:</strong> Пластиковые ПВХ-плинтусы со съемной центральной планкой — самый практичный вариант, если нужно спрятать провода. Внутри них можно спокойно протянуть толстый телевизионный кабель или интернет-провод (LAN) без необходимости штробления и порчи готовой отделки.</li>
                </ul>
            </div>

            <!-- ЗОНА 3: СКРОМНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Закончили укладку пола и нужно смонтировать плинтусы?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Профессионально и ровно установлю напольные плинтусы любого типа (ПВХ, МДФ, дерево). Ювелирно подогоню углы без щелей и аккуратно спрячу мешающие провода. Приеду со своим инструментом в любой район Минска.
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
        `
    },



    'sports-mount': {
        mainTitle: "🏋️ НАДЕЖНЫЙ МОНТАЖ НАСТЕННЫХ И ПОТОЛОЧНЫХ ТУРНИКОВ",
        stepsHTML: `
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЕ ШАГИ РАБОТЫ -->
            <div style="width: 100% !important; margin-bottom: 40px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ ЭТАПЫ МОНТАЖА СПОРТИНВЕНТАРЯ:</h5>
                <div class="horizontal-infographic-row">
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-sports-laser" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4>Разметка и уровень</h4>
                            <p>Подбираю удобную высоту крепления под ваш рост, выставляю идеальный уровень рамки по лазеру и размечаю отверстия.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-sports-drill" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4>Бурение под анкеры</h4>
                            <p>Высверливаю глубокие отверстия в прочной несущей стене мощным перфоратором с пылесосом и забиваю стальные анкерные болты.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-sports-final" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4>Навеска и протяжка</h4>
                            <p>Навешиваю снаряд на анкеры, намертво протягиваю гайки гаечным ключом, устанавливаю защитные заглушки и проверяю на прочность.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ЗОНА 2: БЛОК С ПОЛЕЗНЫМИ СОВЕТАМИ МАСТЕРА -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📋 Полезные советы: На какие стены категорически нельзя вешать турник</h5>
                <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Материал основания:</strong> Спортивные снаряды, шведские стенки и тяжелые боксерские груши можно монтировать исключительно на прочные несущие основания — бетон или полнотелый кирпич. К весу самого турника добавляется вес взрослого человека, умноженный на рывок при подтягивании. Закрепить такую конструкцию на тонкую межкомнатную перегородку из гипсокартона или пеноблока обычным крепежом нельзя — её вырвет с мясом при первой же тренировке.</li>
                    <li style="margin-bottom: 0 !important;"><strong>Тип крепежа:</strong> Обычные пластиковые дюбели-новоселы, которые часто идут в заводском комплекте с турником, не рассчитаны на вибрационные нагрузки. Для безопасности я всегда заменяю их на мощные стальные распорные анкеры рамного типа, которые намертво заклинивают в бетоне.</li>
                </ul>
            </div>

            <!-- ЗОНА 3: СКРОМНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Купили турник или боксерскую грушу?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Надежно смонтирую настенные или потолочные турники, детские спортивные комплексы и подвесы для груш. Гарантирую железную прочность и безопасность тренировок. Приеду со своими мощными перфораторами и стальными анкерами в любой район Минска.
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
        `
    },


    'accessories-mount': {
        mainTitle: "🧻 ЧИСТОВОЙ МОНТАЖ И УСТАНОВКА АКСЕССУАРОВ В ВАННОЙ И КУХНЕ",
        stepsHTML: `
            <!-- ЗОНА 1: ГОРИЗОНТАЛЬНЫЕ ШАГИ РАБОТЫ -->
            <div style="width: 100% !important; margin-bottom: 40px !important; display: block !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; color: #0066cc !important; text-transform: uppercase !important; margin-bottom: 35px !important; text-align: center !important;">🛠️ ЭТАПЫ МОНТАЖА АКСЕССУАРОВ:</h5>
                <div class="horizontal-infographic-row">
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-access-laser" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">1</div>
                        <div class="step-details">
                            <h4>Точная разметка</h4>
                            <p>Согласовываю с вами расстановку, проверяю отсутствие скрытой проводки и труб и размечаю точки по лазеру.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-access-drill" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">2</div>
                        <div class="step-details">
                            <h4>Сверление плитки</h4>
                            <p>Высверливаю отверстия деликатными безударными алмазными сверлами без сколов керамогранита или кафеля, забиваю дюбели.</p>
                        </div>
                    </div>
                    
                    <div class="info-step-card">
                        <div class="step-sticker-icon tile-img-access-final" style="width:110px !important; height:110px !important; margin: 0 auto 15px auto !important;"></div>
                        <div class="step-number-badge">3</div>
                        <div class="step-details">
                            <h4>Чистовая фиксация</h4>
                            <p>Плотная прикручиваю скрытые монтажные планки-основания, надежно закрепляю аксессуары и фиксирую стопорными винтами.</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- ЗОНА 2: БЛОК С ПОЛЕЗНЫМИ СОВЕТАМИ МАСТЕРА -->
            <div style="width: 100% !important; background: #f8fafc !important; border-radius: 16px !important; padding: 25px !important; box-sizing: border-box !important; margin-bottom: 40px !important; border: 1px dashed #cbd5e1 !important; display: block !important;">
                <h5 style="font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; margin: 0 0 15px 0 !important; text-transform: uppercase !important;">📋 Полезные советы: Как избежать повреждения скрытых труб при монтаже в ванной</h5>
                <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14px !important; color: #334155 !important; line-height: 1.6 !important;">
                    <li style="margin-bottom: 8px !important;"><strong>Опасность скрытых коммуникаций:</strong> Стены в ванной комнате и санузле нашпигованы скрытыми водопроводными трубами и кабелями питания подсветки зеркал. Бурение наугад часто приводит к затоплению или короткому замыканию. Перед сверлением я всегда использую специальный цифровой детектор скрытых коммуникаций для поиска безопасных зон.</li>
                    <li style="margin-bottom: 0 !important;"><strong>Крепление на скотч или клей:</strong> Заводские мыльницы или крючки «на липучках» или двухстороннем скотче постоянно отваливаются от влажности и пара в ванной. Для долговременного использования подходит исключительно классический механический монтаж на скрытые дюбели.</li>
                </ul>
            </div>

            <!-- ЗОНА 3: СКРОМНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ -->
            <div style="width: 100% !important; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important; border-radius: 18px !important; padding: 30px !important; box-sizing: border-box !important; text-align: center !important; display: block !important;">
                <h4 style="font-size: 20px !important; font-weight: 900 !important; color: #0369a1 !important; margin: 0 0 10px 0 !important; text-transform: uppercase !important;">Нужно установить аксессуары в ванной или на кухне?</h4>
                <p style="font-size: 15px !important; color: #0c4a6e !important; max-width: 650px !important; margin: 0 auto 20px auto !important; line-height: 1.6 !important;">
                    Аккуратно и ровно смонтирую вешалки, полотенцедержатели, зеркала, полки, дозаторы и любые элементы интерьера. Работаю без сколов плитки и строительной пыли. Приеду со своим инструментом в любой район Минска.
                </p>
                <a href="https://t.me" target="_blank" style="display: inline-block !important; background: #0066cc !important; color: #ffffff !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 14px !important; padding: 14px 35px !important; border-radius: 50px !important; text-decoration: none !important;">📲 Связаться с мастером в Telegram</a>
            </div>
        `
    },

};

// Функция управления выкатной панелью мелкого ремонта
function openRepairInfo(type) {
    const dropdown = document.getElementById('tile-info-dropdown-repair');
    const titleZone = document.getElementById('tile-info-title-repair');
    const textZone = document.getElementById('tile-info-text-repair');
    
    if (!dropdown || !titleZone || !textZone) return;
    
    const data = repairInfoData[type];
    if (!data) {
        console.warn(`Данные для мелкого ремонта с ключом "${type}" пока не добавлены.`);
        return;
    }
    
    titleZone.innerHTML = data.mainTitle;
    textZone.innerHTML = data.stepsHTML;
    dropdown.classList.add('active-info');
    
    // Блокируем лишние стрелки шаблона внутри мелкого ремонта
    const badArrows = textZone.querySelectorAll('.infographic-arrow');
    badArrows.forEach(function(arrow) {
        arrow.style.setProperty('display', 'none', 'important');
    });
    
    // Рисуем синюю линию связи за номерами шагов на мониторах
    const lineRow = textZone.querySelector('.horizontal-infographic-row');
    if (lineRow && window.innerWidth > 900) {
        lineRow.style.setProperty('position', 'relative', 'important');
        lineRow.style.setProperty('background', 'linear-gradient(to right, transparent 15%, #0066cc 15%, #0066cc 85%, transparent 85%) no-repeat center 150px / 100% 2px', 'important');
    }
    
    setTimeout(function() {
        dropdown.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 60);
}














// ==========================================================================
// 🎯 ЖЕЛЕЗНЫЕ РАЗДЕЛЬНЫЕ ФУНКЦИИ ОТКРЫТИЯ (ПОЛНОСТЬСТЬЮ УБИРАЮТ КАШУ)
// ==========================================================================

// 1. ФУНКЦИЯ СТРОГО ДЛЯ САНТЕХНИКИ (Открывает ТОЛЬКО сантехнику!)
function openPlumbingInfo(type) {
    const dropdown = document.getElementById('tile-info-dropdown-plumbing');
    const titleZone = document.getElementById('tile-info-title-plumbing');
    const textZone = document.getElementById('tile-info-text-plumbing');
    
    if (!dropdown || !titleZone || !textZone) {
        console.error("Ошибка: Элементы панели сантехники не найдены в HTML!");
        return;
    }
    
    // Берем данные строго из базы сантехники
    const data = plumbingInfoData[type];
    if (!data) return;
    
    titleZone.innerHTML = data.mainTitle;
    textZone.innerHTML = data.stepsHTML;
    
    dropdown.classList.add('active-info');
    
    // Блокируем системные стрелки шаблона
    const badArrows = textZone.querySelectorAll('.infographic-arrow, a:not([href*="t.me"])');
    badArrows.forEach(function(arrow) {
        arrow.style.setProperty('display', 'none', 'important');
    });
    
    // Горизонтальная линия связи для шагов сантехники
    const lineRow = textZone.querySelector('.horizontal-infographic-row');
    if (lineRow && window.innerWidth > 900) {
        lineRow.style.setProperty('position', 'relative', 'important');
        lineRow.style.setProperty('background', 'linear-gradient(to right, transparent 15%, #0066cc 15%, #0066cc 85%, transparent 85%) no-repeat center 150px / 100% 2px', 'important');
    }
    
    setTimeout(function() {
        dropdown.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 60);
}

// 2. ФУНКЦИЯ СТРОГО ДЛЯ ЭЛЕКТРИКИ (Открывает ТОЛЬКО электрику и калькулятор!)
// ==========================================================================
// 🎛️ ИСПРАВЛЕННАЯ ФУНКЦИЯ ОТКРЫТИЯ ЭЛЕКТРИКИ (БЕЗ БЛОКИРОВКИ КНОПОК)
// ==========================================================================
function openElectricInfo(type) {
    const dropdown = document.getElementById('tile-info-dropdown-electric');
    const titleZone = document.getElementById('tile-info-title-electric');
    const textZone = document.getElementById('tile-info-text-electric');
    if (!dropdown || !titleZone || !textZone) return;
    
    titleZone.innerHTML = electricInfoData[type].mainTitle;
    textZone.innerHTML = electricInfoData[type].stepsHTML;
    dropdown.classList.add('active-info');
    
    // Блокируем ТОЛЬКО системные стрелки, кнопки калькуляторов больше НЕ трогаем!
    const badArrows = textZone.querySelectorAll('.infographic-arrow');
    badArrows.forEach(function(arrow) { arrow.style.setProperty('display', 'none', 'important'); });
    
    const lineRow = textZone.querySelector('.horizontal-infographic-row');
    if (lineRow && window.innerWidth > 900) {
        lineRow.style.setProperty('position', 'relative', 'important');
        lineRow.style.setProperty('background', 'linear-gradient(to right, transparent 15%, #0066cc 15%, #0066cc 85%, transparent 85%) no-repeat center 150px / 100% 2px', 'important');
    }
    setTimeout(function() { dropdown.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 60);
}

// ==========================================================================
// 🧠 МОЗГ ИНТЕРАКТИВНОГО СПРАВОЧНИКА АВТОМАТОВ (ВСЕ НОМИНАЛЫ ДЛЯ КЛИКОВ)
// ==========================================================================
function updateBreakerWidget(rating, btnElement) {
    const resultBox = document.getElementById('breaker-result-box');
    if (!resultBox) return;
    
    // Переключаем синюю подсветку у кнопок автоматов
    const allButtons = document.querySelectorAll('.breaker-calc-btn');
    allButtons.forEach(function(btn) {
        btn.style.setProperty('background', '#ffffff', 'important');
        btn.style.setProperty('color', '#334155', 'important');
        btn.style.setProperty('border', '2px solid #cbd5e1', 'important');
    });
    
    btnElement.style.setProperty('background', '#0066cc', 'important');
    btnElement.style.setProperty('color', '#ffffff', 'important');
    btnElement.style.setProperty('border', '2px solid #0066cc', 'important');
    
    // Выдаем скромную и четкую техническую инфу под каждый номинал
    if (rating === 'C6') {
        resultBox.innerHTML = `
            <h6 style="font-size: 16px !important; font-weight: 800 !important; color: #0066cc !important; margin: 0 0 15px 0 !important; text-transform:uppercase !important;">🎛️ Автомат C6 (6 Ампер)</h6>
            <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14.5px !important; color: #334155 !important; line-height: 1.7 !important;">
                <li><strong>Назначение линии:</strong> Защита слаботочных цепей и деликатной автоматики.</li>
                <li><strong>Сечение кабеля:</strong> медный провод <b>1.5 мм²</b>.</li>
                <li><strong>Допустимая нагрузка:</strong> до <b>1.3 кВт</b>.</li>
                <li><strong>Что подключается:</strong> Системы видеонаблюдения, охранная сигнализация, роутеры, блоки питания умного дома.</li>
            </ul>`;
    } else if (rating === 'C10') {
        resultBox.innerHTML = `
            <h6 style="font-size: 16px !important; font-weight: 800 !important; color: #0066cc !important; margin: 0 0 15px 0 !important; text-transform:uppercase !important;">🎛️ Автомат C10 (10 Ампер)</h6>
            <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14.5px !important; color: #334155 !important; line-height: 1.7 !important;">
                <li><strong>Назначение линии:</strong> Стандартные цепи освещения квартиры.</li>
                <li><strong>Сечение кабеля:</strong> медный провод строго <b>1.5 мм²</b>.</li>
                <li><strong>Допустимая нагрузка:</strong> до <b>2.2 кВт</b>.</li>
                <li><strong>Что подключается:</strong> Люстры, точечные светильники, бра, светодиодные LED-ленты.</li>
            </ul>`;
    } else if (rating === 'C16') {
        resultBox.innerHTML = `
            <h6 style="font-size: 16px !important; font-weight: 800 !important; color: #0066cc !important; margin: 0 0 15px 0 !important; text-transform:uppercase !important;">🎛️ Автомат C16 (16 Ампер)</h6>
            <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14.5px !important; color: #334155 !important; line-height: 1.7 !important;">
                <li><strong>Назначение линии:</strong> Основные бытовые розеточные группы.</li>
                <li><strong>Сечение кабеля:</strong> медный провод строго <b>2.5 мм²</b>.</li>
                <li><strong>Допустимая нагрузка:</strong> до <b>3.5 кВт</b>.</li>
                <li><strong>Что подключается:</strong> Телевизоры, компьютеры, холодильник, микроволновка, пылесос, розетки в комнатах.</li>
            </ul>`;
    } else if (rating === 'C20') {
        resultBox.innerHTML = `
            <h6 style="font-size: 16px !important; font-weight: 800 !important; color: #0066cc !important; margin: 0 0 15px 0 !important; text-transform:uppercase !important;">🎛️ Автомат C20 (20 Ампер)</h6>
            <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14.5px !important; color: #334155 !important; line-height: 1.7 !important;">
                <li><strong>Назначение линии:</strong> Выделенные линии под мощную бытовую технику.</li>
                <li><strong>Сечение кабеля:</strong> медный провод строго <b>2.5 мм²</b> (или 4.0 мм² при длинных линиях).</li>
                <li><strong>Допустимая нагрузка:</strong> до <b>4.4 кВт</b>.</li>
                <li><strong>Что подключается:</strong> Посудомоечная машина, мощный кондиционер, бойлер, стиральная машина с сушкой.</li>
            </ul>`;
    } else if (rating === 'C25') {
        resultBox.innerHTML = `
            <h6 style="font-size: 16px !important; font-weight: 800 !important; color: #0066cc !important; margin: 0 0 15px 0 !important; text-transform:uppercase !important;">🎛️ Автомат C25 (25 Ампер)</h6>
            <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14.5px !important; color: #334155 !important; line-height: 1.7 !important;">
                <li><strong>Назначение линии:</strong> Питание тяжелой кухонной техники.</li>
                <li><strong>Сечение кабеля:</strong> силовой медный провод <b>4.0 мм²</b>.</li>
                <li><strong>Допустимая нагрузка:</strong> до <b>5.5 кВт</b>.</li>
                <li><strong>Что подключается:</strong> Встроенные духовые шкафы, электроплиты, мощные проточные водонагреватели.</li>
            </ul>`;
    } else if (rating === 'C32') {
        resultBox.innerHTML = `
            <h6 style="font-size: 16px !important; font-weight: 800 !important; color: #0066cc !important; margin: 0 0 15px 0 !important; text-transform:uppercase !important;">🎛️ Автомат C32 (32 Ампер)</h6>
            <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14.5px !important; color: #334155 !important; line-height: 1.7 !important;">
                <li><strong>Назначение линии:</strong> Магистральные линии или индукционные варочные панели высокой мощности.</li>
                <li><strong>Сечение кабеля:</strong> силовой медный провод <b>6.0 мм²</b>.</li>
                <li><strong>Допустимая нагрузка:</strong> до <b>7.0 кВт</b>.</li>
                <li><strong>Что подключается:</strong> Мощные индукционные царь-плиты, либо используется как вводной автомат в некоторых квартирах.</li>
            </ul>`;
    } else if (rating === 'RCBO') {
        resultBox.innerHTML = `
            <h6 style="font-size: 16px !important; font-weight: 800 !important; color: #0066cc !important; margin: 0 0 15px 0 !important; text-transform:uppercase !important;">🛡️ Дифавтомат / УЗО (16А / 30мА)</h6>
            <ul style="margin: 0 !important; padding: 0 0 0 20px !important; font-size: 14.5px !important; color: #334155 !important; line-height: 1.7 !important;">
                <li><strong>Назначение линии:</strong> Защита человека от удара током и утечек во влажных зонах.</li>
                <li><strong>Сечение кабеля:</strong> медный провод <b>2.5 мм²</b>.</li>
                <li><strong>Ток утечки отсечки:</strong> строго <b>30 мА</b> (миллиампер).</li>
                <li><strong>Что подключается:</strong> Обязательно ставится на розетки в ванной комнате (стиралка, фен) и рабочую зону кухни. При пробое тока на корпус прибора мгновенно отключает линию.</li>
            </ul>`;
    }
}

// Дублируем перезапуск, чтобы калькулятор автоматов подхватывался при открытии панели розеток
const finalOpenElectricInfo = openElectricInfo;
openElectricInfo = function(type) {
    finalOpenElectricInfo(type);
    if (type === 'socket' && typeof initInteractiveSocketCalc === 'function') {
        setTimeout(initInteractiveSocketCalc, 100);
    }
};



// 3. УНИВЕРСАЛЬНАЯ ФУНКЦИЯ ЗАКРЫТИЯ ПАНЕЛЕЙ
function closeTileInfo(category) {
    const currentCategory = category || 'plumbing';
    const dropdown = document.getElementById(`tile-info-dropdown-${currentCategory}`);
    if (dropdown) {
        dropdown.classList.remove('active-info');
    }
}











