import { hexToRgb, hexToHsl } from '../utils/colorUtils';

const contextMenu = document.getElementById('context-menu') as HTMLElement;
const menuPreviewColor = contextMenu?.querySelector('.menu-color-preview') as HTMLElement;
const menuColorName = contextMenu?.querySelector('.menu-color-name') as HTMLElement;
const menuColorHex = contextMenu?.querySelector('.menu-color-hex') as HTMLElement;
const menuHexVal = contextMenu?.querySelector('button[data-format="hex"] .value-preview') as HTMLElement;
const menuRgbVal = contextMenu?.querySelector('button[data-format="rgb"] .value-preview') as HTMLElement;
const menuHslVal = contextMenu?.querySelector('button[data-format="hsl"] .value-preview') as HTMLElement;

let lastRightClickedColor = '';
let lastRightClickedElement: HTMLElement | null = null;

if (contextMenu) {
  document.addEventListener('contextmenu', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const colorBox = target.closest('.color-box, .color-card, .hex-clock-area') as HTMLElement;

    if (colorBox) {
      e.preventDefault();
      const hex = colorBox.getAttribute('data-hex') || '';
      let name = colorBox.querySelector('.color-name')?.textContent || 'Color';
      if (colorBox.classList.contains('hex-clock-area')) name = 'Hex Clock';

      if (!hex) return;

      lastRightClickedColor = hex;
      lastRightClickedElement = colorBox;

      if (menuPreviewColor) menuPreviewColor.style.backgroundColor = hex;
      if (menuColorName) menuColorName.textContent = name;
      if (menuColorHex) menuColorHex.textContent = hex;

      if (menuHexVal) menuHexVal.textContent = hex;
      if (menuRgbVal) menuRgbVal.textContent = hexToRgb(hex);
      if (menuHslVal) menuHslVal.textContent = hexToHsl(hex).replace(/\s+/g, '');

      const { clientX: mouseX, clientY: mouseY } = e;
      
      const menuWidth = 200; 
      const menuHeight = 250; 
      let top = mouseY;
      let left = mouseX;

      if (left + menuWidth > window.innerWidth) left = window.innerWidth - menuWidth - 20;
      if (top + menuHeight > window.innerHeight) top = window.innerHeight - menuHeight - 20;

      contextMenu.style.top = `${top}px`;
      contextMenu.style.left = `${left}px`;
      contextMenu.classList.add('open');
    } else {
      contextMenu.classList.remove('open');
    }
  });

  document.addEventListener('click', () => {
    if (contextMenu.classList.contains('open')) {
      contextMenu.classList.remove('open');
    }
  });

  contextMenu.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const btn = target.closest('button');
    if (!btn || !lastRightClickedColor) return;

    const format = btn.getAttribute('data-format');
    const action = btn.getAttribute('data-action');

    if (action === 'view-details') {
      const pureHex = lastRightClickedColor.substring(1);
      window.location.href = `/color/${pureHex}`;
      return;
    }

    let textToCopy = lastRightClickedColor;

    if (format === 'rgb') {
      textToCopy = hexToRgb(lastRightClickedColor);
    } else if (format === 'hsl') {
      textToCopy = hexToHsl(lastRightClickedColor);
    } else if (format === 'css') {
      textToCopy = `var(--color-${lastRightClickedColor.substring(1)})`;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      const event = new CustomEvent('color-copied', {
        detail: {
          color: lastRightClickedColor,
          element: lastRightClickedElement,
          message: `Copied ${format?.toUpperCase()}!`
        }
      });
      document.dispatchEvent(event);
    });
  });
}
