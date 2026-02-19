import { isDarkColor } from '../utils/colorUtils';

interface Color {
  name: string;
  hex_code: string;
}

const state = {
  colors: [] as Color[],
  filter: 'all',
  gridSize: 'comfortable'
};

const container = document.getElementById('color-container') as HTMLElement;
const colorCount = document.getElementById('color-count') as HTMLElement;
const filterIndicator = document.getElementById('menu-indicator') as HTMLElement;
const gridIndicator = document.getElementById('grid-indicator') as HTMLElement;

const filterBtns: Record<string, HTMLElement | null> = {
  all: document.getElementById('all-button'),
  dark: document.getElementById('dark-button'),
  light: document.getElementById('light-button')
};

const gridBtns: Record<string, HTMLElement | null> = {
  compact: document.getElementById('grid-compact'),
  comfortable: document.getElementById('grid-comfortable'),
  large: document.getElementById('grid-large')
};

const toggleGap = document.getElementById('toggle-gap') as HTMLElement;
const toggleInfo = document.getElementById('toggle-info') as HTMLElement;

function init() {
  colorCount.innerHTML = '<span class="loading-pulse">Loading colors...</span>';
  container.innerHTML = '<div class="spinner-container"><div class="spinner"></div></div>';

  fetch('https://gist.githubusercontent.com/Lenochxd/12a1927943a2ce151560e1b9585d4bfa/raw/41d5a0dc9336827cefb217c1728f0e9415b1c7b9/colors_db.json')
    .then(response => response.json())
    .then(data => {
      state.colors = data;
      renderColors();
      updateUI();
    })
    .catch(error => {
      console.error('Error fetching colors:', error);
      colorCount.innerHTML = '<span style="color: #ff3b30">Error loading colors</span>';
    });

  setupEventListeners();
}

function setupEventListeners() {
  // Filter Buttons
  Object.entries(filterBtns).forEach(([key, btn]) => {
    btn?.addEventListener('click', () => {
      if (state.filter === key) return;
      state.filter = key;
      updateUI();
      filterColors();
    });
  });

  // Grid Buttons
  Object.entries(gridBtns).forEach(([key, btn]) => {
    btn?.addEventListener('click', () => {
      if (state.gridSize === key) return;
      state.gridSize = key;
      updateUI();
    });
  });

  // Toggles
  toggleGap?.addEventListener('click', () => {
    toggleGap.classList.toggle('active');
    container.classList.toggle('no-gap');
  });

  toggleInfo?.addEventListener('click', () => {
    toggleInfo.classList.toggle('active');
    container.classList.toggle('show-info');
  });

  window.addEventListener('resize', updateIndicators);
  
  // Visual Feedback for Copying
  document.addEventListener('color-copied', (e: any) => {
    const el = (e as CustomEvent).detail.element;
    if (el) {
      // Remove rounded class from all other boxes
      document.querySelectorAll('.color-box.rounded, .color-card.rounded').forEach(box => {
        box.classList.remove('rounded');
      });
      // Add to current one
      el.classList.add('rounded');
    }
  });

  document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    const randomBtn = document.querySelector('.random-box') as HTMLElement;
    randomBtn?.click();
  }
});
}

function updateUI() {
  // Update Filter Buttons
  Object.values(filterBtns).forEach(btn => btn?.classList.remove('active'));
  filterBtns[state.filter]?.classList.add('active');

  // Update Grid Buttons
  Object.values(gridBtns).forEach(btn => btn?.classList.remove('active'));
  gridBtns[state.gridSize]?.classList.add('active');

  // Update Container Classes
  container.classList.remove('compact', 'comfortable', 'large');
  if (state.gridSize !== 'comfortable') {
    container.classList.add(state.gridSize);
  }

  updateIndicators();
}

function updateIndicators() {
  const activeFilterBtn = filterBtns[state.filter];
  const activeGridBtn = gridBtns[state.gridSize];

  if (activeFilterBtn && filterIndicator) {
    filterIndicator.style.width = `${activeFilterBtn.offsetWidth}px`;
    filterIndicator.style.transform = `translateX(${activeFilterBtn.offsetLeft - 2}px)`;
  }

  if (activeGridBtn && gridIndicator) {
    gridIndicator.style.width = `${activeGridBtn.offsetWidth}px`;
    gridIndicator.style.transform = `translateX(${activeGridBtn.offsetLeft}px)`; // Adjusted offset
  }
}

function renderColors() {
  container.innerHTML = '';
  
  const randomBox = document.createElement('div');
  randomBox.className = 'color-box random-box';
  randomBox.dataset.brightness = 'all'; // Special case to show in all filters or manage below
  
  randomBox.innerHTML = `
    <div class="color-box-content">
      <div class="random-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 3h5v5"></path>
          <path d="M4 20L21 3"></path>
          <path d="M21 16v5h-5"></path>
          <path d="M15 15l6 6"></path>
          <path d="M4 4l5 5"></path>
        </svg>
      </div>
      <div class="color-info" style="opacity: 1;">
        <span class="color-name">Lucky Pick</span>
        <span class="color-hex">Randomize</span>
      </div>
    </div>
  `;

  randomBox.onclick = () => {
    const visibleBoxes = Array.from(container.querySelectorAll('.color-box:not(.random-box)')) as HTMLElement[];
    const filteredBoxes = visibleBoxes.filter(b => b.style.display !== 'none');
    
    if (filteredBoxes.length === 0) return;
    
    const randomElement = filteredBoxes[Math.floor(Math.random() * filteredBoxes.length)];
    randomElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    setTimeout(() => {
      randomElement.click();
    }, 1000);
  };
  container.appendChild(randomBox);

  const staggerDelay = state.colors.length > 100 ? 5 : 15;

  state.colors.forEach((color, index) => {
    const colorBox = document.createElement('div');
    colorBox.className = 'color-box';
    
    // Pre-calculate values
    const isDark = isDarkColor(color.hex_code);
    const r = parseInt(color.hex_code.slice(1, 3), 16);
    const g = parseInt(color.hex_code.slice(3, 5), 16);
    const b = parseInt(color.hex_code.slice(5, 7), 16);

    // Set properties
    colorBox.style.setProperty('--card-rgb', `${r}, ${g}, ${b}`);
    colorBox.style.setProperty('--current-hex', color.hex_code);
    colorBox.style.backgroundColor = color.hex_code;
    colorBox.style.animationDelay = `${index * staggerDelay}ms`;
    colorBox.style.color = isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)';
    
    // Data attributes for filtering
    colorBox.dataset.hex = color.hex_code;
    colorBox.dataset.brightness = isDark ? 'dark' : 'light';

    colorBox.innerHTML = `
      <div class="color-box-content">
        <div class="color-info">
          <span class="color-name">${color.name}</span>
          <span class="color-hex">${color.hex_code}</span>
        </div>
      </div>
    `;

    colorBox.onclick = (e) => {
      e.stopPropagation();
      const hex = color.hex_code;
      navigator.clipboard.writeText(hex);
      
      // Dispatch event for visual feedback (toast/favicon/etc)
      document.dispatchEvent(new CustomEvent('color-copied', { 
        detail: { 
          color: hex, 
          element: colorBox, 
          message: `Copied ${hex}` 
        } 
      }));
    };

    container.appendChild(colorBox);
  });

  // Initial filter application
  filterColors();
}

async function filterColors() {
  if (!container) return;

  container.classList.add('filtering');
  
  // Small delay for animation
  await new Promise(resolve => setTimeout(resolve, 300));

  const boxes = container.querySelectorAll('.color-box');
  let visibleCount = 0;

  boxes.forEach((_box) => {
    const box = _box as HTMLElement;
    if (box.classList.contains('random-box')) {
      box.style.display = '';
      visibleCount++;
      return;
    }
    const brightness = box.dataset.brightness;
    const shouldShow = state.filter === 'all' || state.filter === brightness;

    if (shouldShow) {
      box.style.display = '';
      // Reset animation to play it again
      box.style.animation = 'none';
      box.offsetHeight; /* trigger reflow */
      box.style.animation = ''; 
      visibleCount++;
    } else {
      box.style.display = 'none';
    }
  });

  colorCount.innerText = `${visibleCount} colors available`;
  container.classList.remove('filtering');
}

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
