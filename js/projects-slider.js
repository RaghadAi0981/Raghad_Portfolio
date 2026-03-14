function initProjectsSlider() {
  const slider = document.querySelector('.projects-slider');
  if (!slider) return;
  if (slider.dataset.sliderInitialized) return;
  slider.dataset.sliderInitialized = 'true';

  const track = slider.querySelector('.proj-track');
  const viewport = slider.querySelector('.proj-viewport');
  const prev = slider.querySelector('.prev');
  const next = slider.querySelector('.next');
  const cards = Array.from(track.children);

  const getVisibleCount = () => {
    return window.matchMedia('(max-width: 900px)').matches ? 1 : 2;
  };

  let index = 0;
  const maxIndex = () => Math.max(0, cards.length - getVisibleCount());

  const dotsWrap = slider.querySelector('.proj-dots');
  let dots = [];

  function buildDots() {
    dotsWrap.innerHTML = '';
    dots = Array.from({ length: maxIndex() + 1 }, (_, i) => {
      const b = document.createElement('button');
      if (i === index) b.classList.add('active');
      dotsWrap.appendChild(b);
      b.addEventListener('click', () => goTo(i));
      return b;
    });
  }

  function update() {
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0);
    const cardWidth = cards[0].getBoundingClientRect().width + gap;
    track.style.transform = `translateX(${-index * cardWidth}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    prev.disabled = index === 0;
    next.disabled = index === maxIndex();
  }

  function goTo(i){
    index = Math.min(Math.max(i, 0), maxIndex());
    update();
  }

  prev.addEventListener('click', () => goTo(index - 1));
  next.addEventListener('click', () => goTo(index + 1));
  window.addEventListener('resize', () => {
    const needed = maxIndex() + 1;
    if (needed !== dots.length) buildDots();
    index = Math.min(index, maxIndex());
    update();
  });

  buildDots();
  update();
}

window.initProjectsSlider = initProjectsSlider;
document.addEventListener('DOMContentLoaded', initProjectsSlider);
