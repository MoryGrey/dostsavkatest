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


