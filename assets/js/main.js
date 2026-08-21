/**
 * Функция для плавного открытия и закрытия прайс-листов с цветной подсветкой кнопок
 * @param {string} id - Уникальный ID блока с прайсом
 */
function togglePrice(id) {
    // Находим нужный блок прайса по его ID
    const priceList = document.getElementById(id);
    
    // Находим кнопку, которая вызвала эту функцию
    const button = window.event.target;

    // Переключаем класс 'active' для плавного раскрытия прайса
    priceList.classList.toggle('active');

    // Определяем, к какому блоку относится кнопка, по ID прайса
    let activeColor = '#fff'; // Цвет по умолчанию
    if (id === 'price-electric') activeColor = '#f1c40f'; // Желтый для электрики
    if (id === 'price-plumbing') activeColor = '#3498db'; // Синий для сантехники
    if (id === 'price-furniture') activeColor = '#e67e22'; // Оранжевый для мебели
    if (id === 'price-handyman') activeColor = '#1abc9c'; // Бирюзовый для мелкого ремонта

    // Проверяем, открылся ли прайс-лист
    if (priceList.classList.contains('active')) {
        button.textContent = 'Скрыть прайс-лист';
        button.style.borderColor = activeColor; // Красим рамку кнопки в цвет карточки
        button.style.color = activeColor;       // Красим текст кнопки в цвет карточки
    } else {
        button.textContent = 'Посмотреть прайс-лист';
        button.style.borderColor = '#444';     // Возвращаем стандартную рамку
        button.style.color = '#fff';           // Возвращаем белый цвет текста
    }
}




function calculateKitchen() {
    const wallMaterial = document.querySelector('input[name="wall-material"]:checked').value;
    const socketsCount = parseInt(document.getElementById('sockets-range').value);
    const strobeLength = parseInt(document.getElementById('strobe-range').value);

    document.getElementById('sockets-val').textContent = socketsCount + ' шт.';
    document.getElementById('strobe-val').textContent = strobeLength + ' м.';



    // Задаем наши фиксированные тарифные ставки из прайса
    const boxRate = wallMaterial === 'concrete' ? 18 : 10;     // 18 - бетон, 10 - кирпич
    const installBoxRate = 7;                                   // 7 - вмазка подрозетника
    const strobeRate = wallMaterial === 'concrete' ? 15 : 8;    // 15 - штроба бетон, 8 - кирпич
    const cableRate = 4;                                        // 4 - укладка кабеля за метр


    const totalBoxesPrice = socketsCount * (boxRate + installBoxRate);
    const totalStrobePrice = strobeLength * strobeRate;
    const totalCablePrice = strobeLength * cableRate;
    const finalTotal = totalBoxesPrice + totalStrobePrice + totalCablePrice;

    document.getElementById('res-boxes').textContent = totalBoxesPrice + ' BYN';
    document.getElementById('res-strobe').textContent = totalStrobePrice + ' BYN';
    document.getElementById('res-cable').textContent = totalCablePrice + ' BYN';
    document.getElementById('calc-total-val').textContent = finalTotal + ' BYN';

    // Автоматически формируем текст сообщения для копирования
    const wallsText = wallMaterial === 'concrete' ? 'Бетон' : 'Кирпич/Блок';
    const textMsg = `Заказ на перенос розеток: стены ${wallsText}, ${socketsCount} шт., ${strobeLength}м штробы. Смета: ${finalTotal} BYN.`;
    document.getElementById('calc-text-msg').value = textMsg;
}

function copyAndOpenTelegram() {
    // Находим поле с текстом сметы
    const copyText = document.getElementById("calc-text-msg");
    
    // Выделяем текст и копируем его в память устройства (буфер обмена)
    copyText.select();
    copyText.setSelectionRange(0, 99999); // Для мобильных устройств
    navigator.clipboard.writeText(copyText.value);
    
    // Меняем текст на кнопке, чтобы клиент понял, что всё сработало
    const btn = document.getElementById("btn-copy-send");
    btn.textContent = "✅ Скопировано! Открываю чат...";
    btn.style.backgroundColor = "#27ae60";

    // Через 1 секунду возвращаем кнопку в норму и перенаправляем в Telegram
    setTimeout(() => {
        btn.textContent = "📋 Скопировать смету и открыть Telegram";
        btn.style.backgroundColor = "#0088cc";
        window.open('https://t.me/AlekseuKon', '_blank');
    }, 1200);
}

// Первоначальный запуск при загрузке
document.addEventListener("DOMContentLoaded", function() {
    if(document.getElementById('sockets-range')) {
        calculateKitchen();
    }
});




/**
 * Функция для плавного открытия и закрытия калькулятора (аккордеон)
 */
function toggleCalculator() {
    // Находим блок калькулятора
    const calcSection = document.querySelector('.calculator-section');
    // Находим саму кнопку
    const btn = document.getElementById('btn-toggle-calc');
    
    // Переключаем класс active (благодаря CSS он плавно откроется или закроется)
    calcSection.classList.toggle('active');
    
    // Проверяем, открылся ли калькулятор в данный момент
    if (calcSection.classList.contains('active')) {
        btn.textContent = '❌ Скрыть калькулятор розеток';
        btn.style.backgroundColor = '#c0392b'; // Меняем цвет кнопки на красный при открытии
        btn.style.color = '#fff';
        
        // Плавно скроллим экран к началу калькулятора, чтобы клиент его сразу видел
        setTimeout(() => {
            calcSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
    } else {
        btn.textContent = '⁝⁝ Калькулятор расчета переноса розеток';
        btn.style.backgroundColor = '#f1c40f'; 
        btn.style.color = '#121212';
    }


}
