import { generateShades, generateTints, isDarkColor, hexToRgb, hexToHsl, getContrastRatio, getWCAGRating, rgbToHex, hslToHex, getRawRgb, getRawHsl, getRandomHex, getColorHarmonies, getRawCmyk, getRawOklch, cmykToHex, oklchToHex, getColorPsychology, isVibratingCombo } from '../utils/colorUtils';
import { getCulturalAnalysis } from '../utils/culturalColorData';
import { getColorName } from '../utils/colorNaming';

const colorInput = document.getElementById('color-input') as HTMLInputElement;
const rgbInput = document.getElementById('rgb-input') as HTMLInputElement;
const hslInput = document.getElementById('hsl-input') as HTMLInputElement;
const cmykInput = document.getElementById('cmyk-input') as HTMLInputElement;
const oklchInput = document.getElementById('oklch-input') as HTMLInputElement;
const randomBtn = document.getElementById('random-btn');
const tintsGrid = document.getElementById('tints-grid') as HTMLElement;
const shadesGrid = document.getElementById('shades-grid') as HTMLElement;
const harmoniesGrid = document.getElementById('harmonies-grid') as HTMLElement;
const accessCheck = document.getElementById('accessibility-check') as HTMLElement;
const copyCssBtn = document.getElementById('copy-css-btn') as HTMLElement;
const copyTwBtn = document.getElementById('copy-tw-btn') as HTMLElement;
const colorEditorCard = document.querySelector('.color-editor-card') as HTMLElement;
const psyName = document.getElementById('psy-name') as HTMLElement;
const psyDesc = document.getElementById('psy-desc') as HTMLElement;
const emotionBadges = document.getElementById('emotion-badges') as HTMLElement;
const psyGlow = document.querySelector('.psy-glow') as HTMLElement;
const cultureCard = document.getElementById('culture-card') as HTMLElement;
const colorEvocativeName = document.getElementById('color-evocative-name') as HTMLElement;
const colorDescriptor = document.getElementById('color-descriptor') as HTMLElement;


const sliderR = document.getElementById('slider-r') as HTMLInputElement;
const sliderG = document.getElementById('slider-g') as HTMLInputElement;
const sliderB = document.getElementById('slider-b') as HTMLInputElement;
const sliderH = document.getElementById('slider-h') as HTMLInputElement;
const sliderS = document.getElementById('slider-s') as HTMLInputElement;
const sliderL = document.getElementById('slider-l') as HTMLInputElement;
const sliderC = document.getElementById('slider-c') as HTMLInputElement;
const sliderM = document.getElementById('slider-m') as HTMLInputElement;
const sliderY = document.getElementById('slider-y') as HTMLInputElement;
const sliderK = document.getElementById('slider-k') as HTMLInputElement;
const sliderOkL = document.getElementById('slider-ok-l') as HTMLInputElement;
const sliderOkC = document.getElementById('slider-ok-c') as HTMLInputElement;
const sliderOkH = document.getElementById('slider-ok-h') as HTMLInputElement;

function createColorCard(hex: string) {
  const isDark = isDarkColor(hex);
  const card = document.createElement('div');
  card.className = 'color-card';
  card.setAttribute('data-hex', hex);
  card.style.backgroundColor = hex;
  
  card.innerHTML = `
    <div class="card-overlay" style="color: ${isDark ? '#fff' : '#000'}">
      <span class="hex-label">${hex}</span>
    </div>
  `;
  
  return card;
}

function copyToClipboard(hex: string, element?: HTMLElement) {
  navigator.clipboard.writeText(hex).then(() => {
    const event = new CustomEvent('color-copied', {
      detail: {
        color: hex,
        element: element,
        message: `Copied ${hex}!`
      }
    });
    document.dispatchEvent(event);
  });
}

function setupSliderGroup(sliders: HTMLInputElement[], updateFn: (id: string) => void) {
  sliders.forEach(slider => {
    const triggerUpdate = () => updateFn(slider.id);
    
    slider.addEventListener('input', triggerUpdate);
    
    slider.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) < 1) return;
      e.preventDefault();
      
      const step = Number.parseFloat(slider.step) || 1;
      const min = Number.parseFloat(slider.min) || 0;
      const max = Number.parseFloat(slider.max) || 100;
      const currentVal = Number.parseFloat(slider.value);
      
      const delta = e.deltaY < 0 ? step : -step;
      const newVal = Math.max(min, Math.min(max, currentVal + delta));
      
      slider.value = newVal.toString();
      triggerUpdate();
    }, { passive: false });
  });
}

function updatePageContent(hex: string, sourceInputId: string | null = null) {
  if (!/^#[0-9A-F]{6}$/i.test(hex)) return;

  const isDark = isDarkColor(hex);
  const contrast = isDark ? '#ffffff' : '#000000';
  const rgb = hexToRgb(hex);
  const hsl = hexToHsl(hex).replace(/\s+/g, '');
  const rawCmyk = getRawCmyk(hex);
  const rawOklch = getRawOklch(hex);
  const cmyk = `cmyk(${rawCmyk.c}%, ${rawCmyk.m}%, ${rawCmyk.y}%, ${rawCmyk.k}%)`;
  const oklch = `oklch(${rawOklch.l}%, ${rawOklch.c}, ${rawOklch.h})`;
  const shades = generateShades(hex);
  const tints = generateTints(hex).reverse();

  const rawRgb = getRawRgb(hex);
  const rawHsl = getRawHsl(hex);

  const whiteRatio = getContrastRatio(hex, '#ffffff');
  const blackRatio = getContrastRatio(hex, '#000000');
  const whiteWCAG = getWCAGRating(whiteRatio);
  const blackWCAG = getWCAGRating(blackRatio);

  if (colorEditorCard) {
    colorEditorCard.style.backgroundColor = hex;
    colorEditorCard.style.color = contrast;
  }
  
  if (sourceInputId !== 'color-input') colorInput.value = hex;
  if (sourceInputId !== 'rgb-input') rgbInput.value = rgb;
  if (sourceInputId !== 'hsl-input') hslInput.value = hsl;
  cmykInput.value = cmyk;
  oklchInput.value = oklch;

  if (sourceInputId !== 'slider-r') sliderR.value = rawRgb.r.toString();
  if (sourceInputId !== 'slider-g') sliderG.value = rawRgb.g.toString();
  if (sourceInputId !== 'slider-b') sliderB.value = rawRgb.b.toString();
  if (sourceInputId !== 'slider-h') sliderH.value = rawHsl.h.toString();
  if (sourceInputId !== 'slider-s') sliderS.value = rawHsl.s.toString();
  if (sourceInputId !== 'slider-l') sliderL.value = rawHsl.l.toString();

  if (sourceInputId !== 'slider-c') sliderC.value = rawCmyk.c.toString();
  if (sourceInputId !== 'slider-m') sliderM.value = rawCmyk.m.toString();
  if (sourceInputId !== 'slider-y') sliderY.value = rawCmyk.y.toString();
  if (sourceInputId !== 'slider-k') sliderK.value = rawCmyk.k.toString();
  
  if (sourceInputId !== 'slider-ok-l') sliderOkL.value = rawOklch.l.toString();
  if (sourceInputId !== 'slider-ok-c') sliderOkC.value = rawOklch.c.toString();
  if (sourceInputId !== 'slider-ok-h') sliderOkH.value = rawOklch.h.toString();

  sliderR.style.background = `linear-gradient(to right, rgb(0, ${rawRgb.g}, ${rawRgb.b}), rgb(255, ${rawRgb.g}, ${rawRgb.b}))`;
  sliderG.style.background = `linear-gradient(to right, rgb(${rawRgb.r}, 0, ${rawRgb.b}), rgb(${rawRgb.r}, 255, ${rawRgb.b}))`;
  sliderB.style.background = `linear-gradient(to right, rgb(${rawRgb.r}, ${rawRgb.g}, 0), rgb(${rawRgb.r}, ${rawRgb.g}, 255))`;
  
  sliderS.style.background = `linear-gradient(to right, hsl(${rawHsl.h}, 0%, ${rawHsl.l}%), hsl(${rawHsl.h}, 100%, ${rawHsl.l}%))`;
  sliderL.style.background = `linear-gradient(to right, #000, hsl(${rawHsl.h}, ${rawHsl.s}%, 50%), #fff)`;

  colorInput.style.color = contrast;
  rgbInput.style.color = contrast;
  hslInput.style.color = contrast;
  cmykInput.style.color = contrast;
  oklchInput.style.color = contrast;

  if (accessCheck) {
    accessCheck.innerHTML = `
      <div class="contrast-item">
        <span class="info-icon" data-tooltip="Contrast ratio against white background. WCAG AA requires 4.5:1 for normal text.">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </span>
        <span class="label">vs White:</span>
        <span class="ratio">${whiteRatio.toFixed(2)}:1</span>
        <div class="badges">
          <span class="badge ${whiteWCAG.AA ? 'pass' : 'fail'}">AA</span>
          <span class="badge ${whiteWCAG.AAA ? 'pass' : 'fail'}">AAA</span>
        </div>
      </div>
      <div class="contrast-item">
        <span class="info-icon" data-tooltip="Contrast ratio against black background. WCAG AA requires 4.5:1 for normal text.">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </span>
        <span class="label">vs Black:</span>
        <span class="ratio">${blackRatio.toFixed(2)}:1</span>
        <div class="badges">
          <span class="badge ${blackWCAG.AA ? 'pass' : 'fail'}">AA</span>
          <span class="badge ${blackWCAG.AAA ? 'pass' : 'fail'}">AAA</span>
        </div>
      </div>
    `;
  }

  tintsGrid.innerHTML = '';
  tints.forEach(tint => tintsGrid.appendChild(createColorCard(tint)));

  shadesGrid.innerHTML = '';
  shades.forEach(shade => shadesGrid.appendChild(createColorCard(shade)));

  const harmonies = getColorHarmonies(hex);
  harmoniesGrid.innerHTML = '';
  
  Object.entries(harmonies).forEach(([type, colors]) => {
    const group = document.createElement('div');
    group.className = 'harmony-group';
    
    const titleWrapper = document.createElement('div');
    titleWrapper.className = 'harmony-title-wrapper';

    const label = document.createElement('span');
    label.className = 'harmony-label';
    label.textContent = type.replace(/([A-Z])/g, ' $1').trim();

    titleWrapper.appendChild(label);
    
    const hasVibration = colors.some(c => isVibratingCombo(hex, c));
    if (hasVibration) {
      const warningIcon = document.createElement('span');
      warningIcon.className = 'vibration-warning info-icon';
      warningIcon.setAttribute('data-tooltip', 'High-saturation opposing colors. May cause visual vibration ("Vibrating Color" effect) if placed directly adjacent.');
      warningIcon.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
      titleWrapper.appendChild(warningIcon);
    }
    
    const colorsContainer = document.createElement('div');
    colorsContainer.className = 'harmony-colors';
    
    colors.forEach(c => colorsContainer.appendChild(createColorCard(c)));
    
    group.appendChild(titleWrapper);
    group.appendChild(colorsContainer);
    harmoniesGrid.appendChild(group);
  });

  const palette = {
    50: tints[0],
    100: tints[2],
    200: tints[4],
    300: tints[6],
    400: tints[8],
    500: hex,
    600: shades[0],
    700: shades[2],
    800: shades[4],
    900: shades[6],
    950: shades[8],
  };

  copyCssBtn.onclick = () => {
    let css = `:root {\n`;
    Object.entries(palette).forEach(([key, val]) => {
      css += `  --color-primary-${key}: ${val};\n`;
    });
    css += `}`;
    navigator.clipboard.writeText(css).then(() => {
      const event = new CustomEvent('color-copied', {
        detail: { color: hex, message: 'CSS Variables copied!' }
      });
      document.dispatchEvent(event);
    });
  };

  copyTwBtn.onclick = () => {
    let config = `primary: {\n`;
    Object.entries(palette).forEach(([key, val]) => {
      config += `  ${key}: '${val}',\n`;
    });
    config += `}`;
    navigator.clipboard.writeText(config).then(() => {
      const event = new CustomEvent('color-copied', {
        detail: { color: hex, message: 'Tailwind Config copied!' }
      });
      document.dispatchEvent(event);
    });
  };

  const psyTone = document.getElementById('psy-tone');
  const psychology = getColorPsychology(hex);
  if (psyName) psyName.textContent = psychology.name;
  if (psyTone) psyTone.textContent = psychology.tone;
  if (psyDesc) psyDesc.textContent = psychology.description;
  if (psyGlow) psyGlow.style.backgroundColor = hex;

  // Update color naming
  const naming = getColorName(hex);
  if (colorEvocativeName) colorEvocativeName.textContent = naming.name;
  if (colorDescriptor) colorDescriptor.textContent = naming.descriptor;
  if (emotionBadges) {
    emotionBadges.innerHTML = psychology.emotions
      .map(emotion => `<span class="emotion-badge">${emotion}</span>`)
      .join('');
  }

  // Cultural section update
  const cultural = getCulturalAnalysis(hex);
  if (cultureCard) {
    const notesHtml = cultural.notes.map(note => `
      <div class="culture-item culture-${note.sentiment}">
        <div class="culture-item-header">
          <span class="culture-region">${note.region}</span>
          ${note.sentiment === 'warning' ? `
            <span class="culture-warn-badge" title="Warning or Taboo">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </span>
          ` : ''}
        </div>
        <p class="culture-meaning">${note.meaning}</p>
      </div>
    `).join('');

    const warningsHtml = cultural.warnings.length > 0 ? `
      <div class="culture-warnings">
        ${cultural.warnings.map(w => `
          <div class="culture-warning-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>${w}</span>
          </div>
        `).join('')}
      </div>
    ` : '';

    cultureCard.innerHTML = `
      <div class="culture-grid">${notesHtml}</div>
      ${warningsHtml}
      <div class="culture-tip">
        <strong>Design Tip:</strong> ${cultural.designTip}
      </div>
    `;
  }

  const pureHex = hex.substring(1);
  window.history.replaceState({}, '', `/color/${pureHex}`);
  document.title = `Color ${hex}`;

  const stickyHex = document.getElementById('sticky-hex') as HTMLInputElement | null;
  const stickySwatch = document.getElementById('sticky-swatch') as HTMLElement | null;
  if (stickyHex && sourceInputId !== 'sticky-hex') stickyHex.value = hex;
  if (stickySwatch) stickySwatch.style.backgroundColor = hex;

  document.dispatchEvent(new CustomEvent('color-copied', {
    detail: { color: hex }
  }));
}

const stickyBar = document.getElementById('sticky-color-bar');
const overviewSection = document.getElementById('overview');

window.addEventListener('scroll', () => {
  if (overviewSection) {
    const rect = overviewSection.getBoundingClientRect();
    if (rect.bottom < 150) {
      stickyBar?.classList.add('visible');
    } else {
      stickyBar?.classList.remove('visible');
    }
  }
});

const tocLinks = document.querySelectorAll('.toc-link');
const sections = [
  document.getElementById('overview'),
  document.getElementById('psychology-section'),
  document.getElementById('culture-section'),
  document.getElementById('harmonies-section'),
  document.getElementById('shades-tints-section')
];

const observerOptions = {
  root: null,
  rootMargin: '-20% 0px -70% 0px',
  threshold: 0
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, observerOptions);

sections.forEach(section => {
  if (section) observer.observe(section);
});

let animationFrame: number | null = null;
function animateToColor(targetHex: string) {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  const startRgb = getRawRgb(colorInput.value);
  const endRgb = getRawRgb(targetHex);
  const duration = 1500;
  const startTime = performance.now();

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const easing = progress < 0.5 
      ? 4 * progress * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    
    const r = Math.round(startRgb.r + (endRgb.r - startRgb.r) * easing);
    const g = Math.round(startRgb.g + (endRgb.g - startRgb.g) * easing);
    const b = Math.round(startRgb.b + (endRgb.b - startRgb.b) * easing);
    
    const currentHex = rgbToHex(r, g, b);
    updatePageContent(currentHex);

    if (progress < 1) {
      animationFrame = requestAnimationFrame(step);
    }
  }
  
  animationFrame = requestAnimationFrame(step);
}

randomBtn?.addEventListener('click', () => {
  const randomHex = getRandomHex();
  animateToColor(randomHex);
});

window.addEventListener('keydown', (e) => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
    return;
  }

  if (e.key === ' ' || e.code === 'Space') {
    e.preventDefault();
    const randomHex = getRandomHex();
    animateToColor(randomHex);
  }
});

updatePageContent(colorInput.value);

colorInput?.addEventListener('input', (e) => {
  let value = (e.target as HTMLInputElement).value;
  if (!value.startsWith('#') && value.length > 0) value = '#' + value;
  if (value.length > 7) value = value.substring(0, 7);
  colorInput.value = value;
  
  if (value.length === 7) {
    updatePageContent(value.toUpperCase(), 'color-input');
  }
});

const stickyHexInput = document.getElementById('sticky-hex') as HTMLInputElement;
stickyHexInput?.addEventListener('input', (e) => {
  let value = (e.target as HTMLInputElement).value;
  if (!value.startsWith('#') && value.length > 0) value = '#' + value;
  if (value.length > 7) value = value.substring(0, 7);
  stickyHexInput.value = value;
  
  if (value.length === 7) {
    updatePageContent(value.toUpperCase(), 'sticky-hex');
  }
});

rgbInput?.addEventListener('input', (e) => {
  const value = (e.target as HTMLInputElement).value;
  const match = value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);
  if (match) {
    const r = Math.min(255, Math.max(0, Number.parseInt(match[1])));
    const g = Math.min(255, Math.max(0, Number.parseInt(match[2])));
    const b = Math.min(255, Math.max(0, Number.parseInt(match[3])));
    updatePageContent(rgbToHex(r, g, b), 'rgb-input');
  }
});

hslInput?.addEventListener('input', (e) => {
  const value = (e.target as HTMLInputElement).value;
  const match = value.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/i);
  if (match) {
    const h = Math.min(360, Math.max(0, Number.parseInt(match[1])));
    const s = Math.min(100, Math.max(0, Number.parseInt(match[2])));
    const l = Math.min(100, Math.max(0, Number.parseInt(match[3])));
    updatePageContent(hslToHex(h, s, l), 'hsl-input');
  }
});

setupSliderGroup([sliderR, sliderG, sliderB], (id) => {
  updatePageContent(rgbToHex(Number.parseInt(sliderR.value), Number.parseInt(sliderG.value), Number.parseInt(sliderB.value)), id);
});

setupSliderGroup([sliderH, sliderS, sliderL], (id) => {
  updatePageContent(hslToHex(Number.parseInt(sliderH.value), Number.parseInt(sliderS.value), Number.parseInt(sliderL.value)), id);
});

setupSliderGroup([sliderC, sliderM, sliderY, sliderK], (id) => {
  updatePageContent(cmykToHex(Number.parseInt(sliderC.value), Number.parseInt(sliderM.value), Number.parseInt(sliderY.value), Number.parseInt(sliderK.value)), id);
});

setupSliderGroup([sliderOkL, sliderOkC, sliderOkH], (id) => {
  updatePageContent(oklchToHex(Number.parseFloat(sliderOkL.value), Number.parseFloat(sliderOkC.value), Number.parseFloat(sliderOkH.value)), id);
});

document.body.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const card = target.closest('.color-card');
  if (card) {
    const hex = card.getAttribute('data-hex');
    if (hex) copyToClipboard(hex, card as HTMLElement);
    return;
  }

  const copyBtn = target.closest('.mini-copy-btn, .copy-trigger');
  if (copyBtn) {
    const targetId = copyBtn.getAttribute('data-copy-target') || '';
    const input = document.getElementById(targetId) as HTMLInputElement;
    if (input) copyToClipboard(input.value);
  }
});
