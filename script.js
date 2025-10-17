const searchSheet = document.getElementById('search-sheet');
const openSearchBtn = document.getElementById('open-search');
const categorySheet = document.getElementById('category-sheet');
const cartSheet = document.getElementById('cart-sheet');
const checkoutSheet = document.getElementById('checkout-sheet');
const navCart = document.getElementById('nav-cart');
const catTitle = document.getElementById('cat-title');
const promoBtn = document.getElementById('apply-promo');
const promoToast = document.getElementById('promo-toast');
const categoryList = document.getElementById('category-list');
const emptyState = document.getElementById('empty-state');
const banner = document.querySelector('.banner');
const sphere = document.getElementById('sphere');
const activatedText = document.getElementById('activatedText');

// Cart elements
const cartList = document.getElementById('cart-list');
const cartEmpty = document.getElementById('cart-empty');
const cartSummary = document.getElementById('cart-summary');
const sumItems = document.getElementById('sum-items');
const sumDelivery = document.getElementById('sum-delivery');
const sumPromoRow = document.getElementById('sum-promo-row');
const sumPromo = document.getElementById('sum-promo');
const sumTotal = document.getElementById('sum-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Checkout elements
const coCity = document.getElementById('co-city');
const coPhone = document.getElementById('co-phone');
const coPromo = document.getElementById('co-promo');
const coApply = document.getElementById('co-apply');
const coItems = document.getElementById('co-items');
const coDelivery = document.getElementById('co-delivery');
const coPromoRow = document.getElementById('co-promo-row');
const coPromoVal = document.getElementById('co-promo-val');
const coTotal = document.getElementById('co-total');
const coSubmit = document.getElementById('co-submit');

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
      // add to cart data
      const existing = cart.find(i=>i.title===item.title);
      if(existing){ existing.qty += 1; }
      else { cart.push({title:item.title, price:item.price, qty:1}); }
      cartCount += 1;
      badge.textContent = String(cartCount);
      // refresh cart summary if open
      if (!cartSheet.hidden) {
        renderCart();
      }
    });
    categoryList.appendChild(el);
  }
}

openSearchBtn.addEventListener('click', ()=>{
  searchSheet.hidden = false;
});

// Open/close cart and checkout sheets
if (navCart) {
  navCart.addEventListener('click', ()=>{
    renderCart();
    cartSheet.hidden = false;
  });
}

[cartSheet, checkoutSheet].forEach(sheet=>{
  if(!sheet) return;
  sheet.addEventListener('click', (e)=>{
    if (e.target.matches('[data-close]') || e.target === sheet) {
      sheet.hidden = true;
    }
  });
});

searchSheet.addEventListener('click', (e)=>{
  if (e.target.matches('[data-close]') || e.target === searchSheet) {
    searchSheet.hidden = true;
  }
});

// Demo: badge increments when кликаем на карточку
const badge = document.getElementById('cart-badge');
let cartCount = parseInt(badge.textContent, 10) || 0;
let cart = [];

document.querySelectorAll('.card').forEach(card=>{
  card.addEventListener('click', (e)=>{
    e.preventDefault();
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

// Cart helpers
function computeTotals(promoCode){
  const itemsSum = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const hasPromo = (promoCode||'').toUpperCase()==='BONUS100';
  const delivery = hasPromo ? 400 : 500;
  const promoVal = hasPromo ? 100 : 0;
  const total = Math.max(itemsSum + delivery - promoVal, 0);
  return {itemsSum, delivery, promoVal, total, hasPromo};
}

function renderCart(){
  cartList.innerHTML = '';
  if(cart.length===0){
    cartEmpty.style.display = 'block';
    cartSummary.hidden = true;
    return;
  }
  cartEmpty.style.display = 'none';
  cartSummary.hidden = false;
  for(const it of cart){
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="cart-item-title">${it.title}</div>
      <div class="qty">
        <button class="qty-btn" data-dec>-</button>
        <b>${it.qty}</b>
        <button class="qty-btn" data-inc>+</button>
      </div>
      <div>${it.price*it.qty}₽</div>
    `;
    row.querySelector('[data-inc]').addEventListener('click', ()=>{ it.qty+=1; cartCount+=1; badge.textContent=String(cartCount); renderCart(); });
    row.querySelector('[data-dec]').addEventListener('click', ()=>{ if(it.qty>1){ it.qty-=1; cartCount-=1; } else { cartCount-=it.qty; cart.splice(cart.indexOf(it),1);} badge.textContent=String(cartCount); renderCart(); });
    cartList.appendChild(row);
  }
  const totals = computeTotals();
  sumItems.textContent = totals.itemsSum + '₽';
  sumDelivery.textContent = totals.delivery + '₽';
  sumPromoRow.hidden = true;
  sumTotal.textContent = totals.total + '₽';
}

if (checkoutBtn){
  checkoutBtn.addEventListener('click', ()=>{
    if(cart.length===0){ alert('Корзина пуста'); return; }
    const t = computeTotals();
    coItems.textContent = t.itemsSum + '₽';
    coDelivery.textContent = t.delivery + '₽';
    coPromoRow.hidden = true;
    coTotal.textContent = t.total + '₽';
    checkoutSheet.hidden = false;
  });
}

if (coApply){
  coApply.addEventListener('click', ()=>{
    const code = (coPromo.value||'').trim();
    const t = computeTotals(code);
    coItems.textContent = t.itemsSum + '₽';
    coDelivery.textContent = t.delivery + '₽';
    if(t.promoVal>0){ coPromoRow.hidden = false; coPromoVal.textContent = '-' + t.promoVal + '₽'; }
    else { coPromoRow.hidden = true; }
    coTotal.textContent = t.total + '₽';
  });
}

if (coSubmit){
  coSubmit.addEventListener('click', ()=>{
    if(cart.length===0){ alert('Корзина пуста'); return; }
    const city = (coCity.value||'').trim();
    const phone = (coPhone.value||'').trim();
    if(!city){ alert('Введите город/село'); return; }
    if(!phone){ alert('Введите телефон'); return; }
    const t = computeTotals(coPromo.value.trim());
    const order = {
      city,
      phone,
      promoCode: (coPromo.value||'').trim(),
      delivery: t.delivery,
      discount: t.promoVal,
      itemsSum: t.itemsSum,
      total: t.total,
      items: cart.map(i=>({title:i.title, price:i.price, qty:i.qty}))
    };

    // Send to Telegram bot if inside WebApp
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      try {
        tg.sendData(JSON.stringify(order));
        tg.showAlert('Заказ отправлен. Ожидайте, курьер свяжется с вами.');
        tg.close();
      } catch(e) {
        console.error('sendData failed', e);
      }
    } else {
      alert(`Заказ оформлен\nАдрес: ${city}\nТелефон: ${phone}\nСумма: ${t.total}₽`);
    }

    // reset cart
    cart = [];
    cartCount = 0;
    badge.textContent = '0';
    renderCart();
    checkoutSheet.hidden = true;
    cartSheet.hidden = true;
  });
}

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

// Load profile data
function loadProfile() {
  let profile = {};

  // Try Telegram WebApp
  if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe?.user) {
    const u = window.Telegram.WebApp.initDataUnsafe.user;
    profile.name = [u.first_name, u.last_name].filter(Boolean).join(' ');
  }

  // Try query params
  const params = new URLSearchParams(location.search);
  if (params.get('name')) profile.name = params.get('name');
  if (params.get('phone')) profile.phone = params.get('phone');
  if (params.get('is18')) profile.is18 = params.get('is18') === 'true';

  // Fallback to localStorage
  const stored = JSON.parse(localStorage.getItem('profile') || '{}');
  profile = { ...stored, ...profile };

  // Defaults
  if (!profile.name) profile.name = 'Гость';
  if (typeof profile.is18 !== 'boolean') profile.is18 = true;

  // Render
  // profile UI removed

  // Save
  localStorage.setItem('profile', JSON.stringify(profile));
}

// Save phone on blur
// no profile inputs now

// Init
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Telegram WebApp environment if present
  if (window.Telegram && window.Telegram.WebApp) {
    try { window.Telegram.WebApp.ready(); window.Telegram.WebApp.expand(); } catch(_) {}
  }
  loadProfile();
});

