const searchSheet = document.getElementById('search-sheet');
const openSearchBtn = document.getElementById('open-search');

openSearchBtn.addEventListener('click', ()=>{
  searchSheet.hidden = false;
});

searchSheet.addEventListener('click', (e)=>{
  if (e.target.matches('[data-close]') || e.target === searchSheet) {
    searchSheet.hidden = true;
  }
});

// Demo: badge increments when кликаем на карточку
const badge = document.getElementById('cart-badge');
let cartCount = parseInt(badge.textContent, 10) || 0;

document.querySelectorAll('.card').forEach(card=>{
  card.addEventListener('click', (e)=>{
    e.preventDefault();
    cartCount += 1;
    badge.textContent = String(cartCount);
    // ripple coords
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--r-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--r-y', `${e.clientY - rect.top}px`);
    card.classList.remove('rippling');
    // restart animation
    void card.offsetWidth;
    card.classList.add('rippling');
  });
});

// Order button functionality
const orderBtn = document.getElementById('order-btn');
orderBtn.addEventListener('click', ()=>{
  if (cartCount === 0) {
    alert('Добавьте товары в корзину для оформления заказа');
    return;
  }
  
  // В Mini App можно использовать Telegram WebApp API
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.showAlert(`Заказ на ${cartCount} товар(ов) оформлен! Ожидайте звонка.`);
    tg.close();
  } else {
    alert(`Заказ на ${cartCount} товар(ов) оформлен! Ожидайте звонка.`);
  }
});

// Intersection Observer for reveal animation
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
},{threshold:0.2});

document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));


