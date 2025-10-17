const searchSheet = document.getElementById('search-sheet');
const openSearchBtn = document.getElementById('open-search');
const categorySheet = document.getElementById('category-sheet');
const catTitle = document.getElementById('cat-title');
const promoBtn = document.getElementById('apply-promo');
const promoToast = document.getElementById('promo-toast');
const categoryList = document.getElementById('category-list');
const emptyState = document.getElementById('empty-state');
const banner = document.querySelector('.banner');
const sphere = document.getElementById('sphere');
const activatedText = document.getElementById('activatedText');

// Demo каталог
const catalog = {
  'Пиво': [
    {title:'Lager 0.5л', meta:'ПЭТ • 5%', price:79},
    {title:'IPA 0.5л', meta:'Бутылка • 6.5%', price:99},
    {title:'Stout 0.33л', meta:'Банка • 7%', price:89},
  ],
  'Водка': [
    {title:'Водка 0.5л', meta:'40%', price:199}
  ],
  'Виски': [
    {title:'Scotch 0.7л', meta:'40%', price:799}
  ],
  'Коньяк': [
    {title:'Коньяк 0.5л', meta:'40%', price:459}
  ],
  'Вино': [
    {title:'Красное сухое 0.75л', meta:'12%', price:259}
  ],
  'Закуски': [
    {title:'Чипсы 120г', meta:'Сыр', price:49},
    {title:'Арахис 100г', meta:'Соль', price:39}
  ]
};

function renderCategory(name){
  const items = catalog[name] || [];
  categoryList.innerHTML = '';
  if(items.length === 0){
    emptyState.style.display = 'block';
    return;
  }
  emptyState.style.display = 'none';
  for(const item of items){
    const el = document.createElement('div');
    el.className = 'product';
    el.innerHTML = `
      <div class="product-thumb">${name[0]}</div>
      <div class="product-info">
        <p class="product-title">${item.title}</p>
        <p class="product-meta">${item.meta}</p>
      </div>
      <div class="product-price">${item.price}₽</div>
      <button class="btn-add" type="button">В корзину</button>
    `;
    const addBtn = el.querySelector('.btn-add');
    addBtn.addEventListener('click', ()=>{
      cartCount += 1;
      badge.textContent = String(cartCount);
    });
    categoryList.appendChild(el);
  }
}

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

    // открыть лист категории (пока пуст)
    const name = card.getAttribute('data-name') || 'Категория';
    catTitle.textContent = name;
    renderCategory(name);
    categorySheet.hidden = false;
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

// Закрытие category-sheet
categorySheet.addEventListener('click', (e)=>{
  if (e.target.matches('[data-close]') || e.target === categorySheet) {
    categorySheet.hidden = true;
  }
});

// Promo toast
if (promoBtn) {
  promoBtn.addEventListener('click', ()=>{
    promoToast.classList.remove('show');
    void promoToast.offsetWidth;
    promoToast.classList.add('show');
    setTimeout(()=>promoToast.classList.remove('show'), 1800);

    // fancy banner animation
    if (banner) {
      banner.classList.add('active');
      // spawn stars
      const rect = banner.getBoundingClientRect();
      const centerX = rect.width/2;
      const centerY = rect.height/2;
      for(let i=0;i<18;i++){
        const star = document.createElement('div');
        star.className = 'star';
        star.style.position = 'absolute';
        star.style.width = '8px';
        star.style.height = '8px';
        star.style.background = 'var(--accent)';
        star.style.borderRadius = '50%';
        star.style.left = centerX + 'px';
        star.style.top = centerY + 'px';
        star.style.opacity = '0';
        banner.appendChild(star);
        const angle = Math.random() * Math.PI * 2;
        const dist = 100 + Math.random()*120;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;
        star.animate([
          {transform:`translate(0,0) scale(1)`,opacity:1},
          {transform:`translate(${tx}px,${ty}px) scale(.3)`,opacity:0}
        ],{duration:1200,easing:'ease-out'});
        setTimeout(()=>star.remove(),1200);
      }
      setTimeout(()=>banner.classList.remove('active'), 1800);
    }
  });
}


