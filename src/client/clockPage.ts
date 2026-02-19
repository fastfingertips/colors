import { isDarkColor } from '../utils/colorUtils';

function updateClock() {
  const now = new Date();
  const mainContainer = document.getElementById('clock-main');
  const hexDisplay = document.getElementById('hex-val');
  
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  const s = now.getSeconds().toString().padStart(2, '0');
  
  const hexColor = `#${h}${m}${s}`;
  const contrastColor = isDarkColor(hexColor) ? '#ffffff' : '#000000';

  if (mainContainer) {
    mainContainer.style.backgroundColor = hexColor;
    mainContainer.setAttribute('data-hex', hexColor);
  }
  if (hexDisplay) {
    hexDisplay.textContent = hexColor;
    hexDisplay.style.color = contrastColor;
  }

  const event = new CustomEvent('color-copied', { detail: { color: hexColor } });
  document.dispatchEvent(event);
}

updateClock();
const interval = setInterval(updateClock, 1000);

const infoBtn = document.getElementById('info-trigger');
const explanation = document.getElementById('explanation');
const footer = document.querySelector('.info-footer');

infoBtn?.addEventListener('click', () => explanation?.classList.toggle('hidden'));

let mouseTimer: ReturnType<typeof setTimeout>;
document.addEventListener('mousemove', () => {
  if (footer) footer.classList.add('visible');
  clearTimeout(mouseTimer);
  mouseTimer = setTimeout(() => {
    if (explanation && !explanation.classList.contains('hidden')) return;
    if (footer) footer.classList.remove('visible');
  }, 3000);
});

document.addEventListener('astro:before-preparation', () => clearInterval(interval), { once: true });
