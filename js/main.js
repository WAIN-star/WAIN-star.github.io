// 导航滚动状态
const nav = document.getElementById('nav');
addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', scrollY > 40);
}, { passive: true });

// 入场动画
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// 作品筛选
const filters = document.getElementById('filters');
const works = [...document.querySelectorAll('.work')];
filters.addEventListener('click', e => {
  const btn = e.target.closest('.filter');
  if (!btn) return;
  filters.querySelector('.is-active').classList.remove('is-active');
  btn.classList.add('is-active');
  const cat = btn.dataset.filter;
  works.forEach(w => {
    const show = cat === 'all' || w.dataset.cat === cat;
    w.classList.toggle('is-hidden', !show);
    if (show) {
      w.classList.remove('is-visible');
      requestAnimationFrame(() => requestAnimationFrame(() => w.classList.add('is-visible')));
    }
  });
});

// ========== 全屏灯箱 ==========
const lb = document.getElementById('lightbox');
const lbImg = lb.querySelector('.lightbox__img');
const lbTitle = lb.querySelector('.lightbox__title');
const lbCat = lb.querySelector('.lightbox__cat');
const lbYear = lb.querySelector('.lightbox__year');
const lbCounter = lb.querySelector('.lightbox__counter');
const lbBignum = lb.querySelector('.lightbox__bignum');
let lbList = [];
let lbIdx = 0;

const pad = n => String(n).padStart(2, '0');

function openLb(work) {
  lbList = works.filter(w => !w.classList.contains('is-hidden')); // 只遍历当前筛选结果
  lbIdx = lbList.indexOf(work);
  renderLb();
  lb.classList.add('is-open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function renderLb() {
  const w = lbList[lbIdx];
  const img = w.querySelector('img');
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbTitle.textContent = w.querySelector('h3').textContent;
  lbCat.textContent = w.querySelector('.work__info p').textContent;
  lbYear.textContent = w.querySelector('.work__year').textContent;
  lbCounter.textContent = `${pad(lbIdx + 1)} / ${pad(lbList.length)}`;
  lbBignum.textContent = pad(lbIdx + 1);
  lbImg.classList.remove('pop');
  void lbImg.offsetWidth; // 重启动画
  lbImg.classList.add('pop');
}

function closeLb() {
  lb.classList.remove('is-open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function stepLb(d) {
  lbIdx = (lbIdx + d + lbList.length) % lbList.length;
  renderLb();
}

works.forEach(w => w.addEventListener('click', () => openLb(w)));
lb.querySelector('.lightbox__close').addEventListener('click', closeLb);
lb.querySelector('.lightbox__prev').addEventListener('click', e => { e.stopPropagation(); stepLb(-1); });
lb.querySelector('.lightbox__next').addEventListener('click', e => { e.stopPropagation(); stepLb(1); });
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
addEventListener('keydown', e => {
  if (!lb.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') stepLb(-1);
  if (e.key === 'ArrowRight') stepLb(1);
});

// 页脚年份
document.getElementById('year').textContent = new Date().getFullYear();
