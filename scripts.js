let colors = [];
let lastCopiedColorIndex = null;

document.addEventListener('DOMContentLoaded', () => {
	filterColors('all');
});

fetch('https://gist.githubusercontent.com/Lenochxd/12a1927943a2ce151560e1b9585d4bfa/raw/41d5a0dc9336827cefb217c1728f0e9415b1c7b9/colors_db.json')
	.then(response => response.json())
	.then(data => {
		colors = data;
		displayColors(colors);
		document.getElementById('color-count').innerText = `${colors.length} colors available`;
	})
	.catch(error => console.error('Error fetching the colors:', error));

function displayColors(colorArray) {
	const container = document.getElementById('color-container');
	container.innerHTML = '';
	colorArray.forEach((color, index) => {
		const colorBox = document.createElement('div');
		colorBox.className = 'color-box';
		colorBox.style.backgroundColor = color.hex_code;

		const textColor = isDarkColor(color.hex_code) ? '#ffffff' : '#000000';
		colorBox.style.color = textColor;

		colorBox.innerHTML = `
			<span>${color.name}</span>
			<div class="tooltip">${color.hex_code}</div>
		`;
		colorBox.onclick = () => {
			navigator.clipboard.writeText(color.hex_code).then(() => {
				showCopyMessage();
				highlightColorBox(index);
				updateFavicon(color.hex_code);
			}).catch(err => {
				console.error('Failed to copy color code: ', err);
			});
		};
		container.appendChild(colorBox);
	});
}

function filterColors(type) {
	let filteredColors;
	if (type === 'dark') {
		filteredColors = colors.filter(color => isDarkColor(color.hex_code));
	} else if (type === 'light') {
		filteredColors = colors.filter(color => !isDarkColor(color.hex_code));
	} else {
		filteredColors = colors;
	}
	displayColors(filteredColors);
	document.getElementById('color-count').innerText = `${filteredColors.length} colors available`;

	document.querySelectorAll('.menu button').forEach(button => {
		button.classList.remove('active');
	});
	document.getElementById(`${type}-button`).classList.add('active');
}

function isDarkColor(hex) {
	const rgb = parseInt(hex.slice(1), 16);
	const r = (rgb >> 16) & 0xff;
	const g = (rgb >>  8) & 0xff;
	const b = (rgb >>  0) & 0xff;
	const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
	return luminance < 128;
}

function highlightColorBox(index) {
	const boxes = document.querySelectorAll('.color-box');
	if (lastCopiedColorIndex !== null) {
		boxes[lastCopiedColorIndex].classList.remove('rounded');
	}
	lastCopiedColorIndex = index;
	boxes[index].classList.add('rounded');
}

function showCopyMessage() {
	const copyMessage = document.getElementById('copy-message');
	copyMessage.classList.add('show');
	setTimeout(() => {
		copyMessage.classList.remove('show');
	}, 2000);
}

function updateFavicon(color) {
	const canvas = document.createElement('canvas');
	canvas.width = 32;
	canvas.height = 32;
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	const favicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
	favicon.rel = 'icon';
	favicon.href = canvas.toDataURL('image/png');
	document.head.appendChild(favicon);
}