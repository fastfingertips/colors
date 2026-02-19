const lightBtn = document.getElementById('theme-light');
const darkBtn = document.getElementById('theme-dark');
const systemBtn = document.getElementById('theme-system');
const indicator = document.querySelector('.theme-indicator') as HTMLElement;
const buttons = [lightBtn, darkBtn, systemBtn];

function updateTheme(theme: 'light' | 'dark' | 'system', save = true) {
  if (save) localStorage.setItem('theme', theme);

  if (theme === 'system') {
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', isSystemDark ? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }

  buttons.forEach(btn => btn?.classList.remove('active'));
  
  let activeBtn;
  if (theme === 'light') activeBtn = lightBtn;
  else if (theme === 'dark') activeBtn = darkBtn;
  else activeBtn = systemBtn;

  activeBtn?.classList.add('active');

  if (activeBtn && indicator) {
    indicator.style.width = `${activeBtn.offsetWidth}px`;
    indicator.style.transform = `translateX(${activeBtn.offsetLeft - 2}px)`;
  }
}

lightBtn?.addEventListener('click', () => updateTheme('light'));
darkBtn?.addEventListener('click', () => updateTheme('dark'));
systemBtn?.addEventListener('click', () => updateTheme('system'));

const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
updateTheme(savedTheme, false);

document.addEventListener('astro:after-swap', () => {
  const theme = (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
  updateTheme(theme, false);
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (localStorage.getItem('theme') === 'system' || !localStorage.getItem('theme')) {
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  }
});

window.addEventListener('load', () => {
  const theme = (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
  updateTheme(theme, false);
});
