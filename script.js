const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const WIDTH = 700;

ctx.fillStyle = '#000000';

let color = '#000000';
let tool = 'brush';
let size = 10;
let bgColor = '#ffffff';
let lineX = 0,
	lineY = 0;

ctx.lineWidth = size;
ctx.font = '10px sans-serif';

//процесс рисования
canvas.addEventListener('mousemove', (e) => {
	switch (tool) {
		case 'brush':
			if (e.buttons > 0) {
				let x = e.offsetX;
				let y = e.offsetY;
				let dx = e.movementX;
				let dy = e.movementY;
				ctx.lineCap = 'round';
				ctx.beginPath();
				ctx.moveTo(x, y);
				ctx.lineTo(x - dx, y - dy);
				ctx.stroke();
				ctx.closePath();
			}
			break;
		case 'eraser':
			if (e.buttons > 0) {
				let x = e.offsetX;
				let y = e.offsetY;
				ctx.beginPath();
				ctx.clearRect(x, y, size, size);
				ctx.closePath();
			}
	}
});

canvas.addEventListener('mouseup', (e) => {
	let x = e.offsetX;
	let y = e.offsetY;
	switch (tool) {
		case 'line':
			ctx.beginPath();
			ctx.moveTo(lineX, lineY);
			ctx.lineTo(x, y);
			ctx.stroke();
			break;
	}
});

canvas.addEventListener('mousedown', (e) => {
	let x = e.offsetX;
	let y = e.offsetY;
	switch (tool) {
		// case 'fill':
		// 	let pixelData = ctx.getImageData(0, 0, canvas.clientWidth, canvas.clientHeight).data;
		// 	fillToolFunc(x, y, pixelData);
		// 	break;
		case 'square':
			ctx.fillRect(x - size / 2, y - size / 2, size, size);
			break;
		case 'round':
			ctx.beginPath();
			ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
			ctx.fill();
			break;
		case 'addText':
			let text = document.getElementById('inputText').value;
			if (!text) {
				alert('Поле не может быть пустым!');
				return;
			}
			ctx.font = `${size}px sans-serif`;
			ctx.fillText(text, x, y);
			break;
		case 'line':
			lineX = x;
			lineY = y;
			break;
	}
});

//очистка поля
const resetCanvas = document.getElementById('resetCanvasBtn');
resetCanvas.addEventListener('click', () => {
	ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
});

//изменение фона
const fillBgBtn = document.getElementById('fillBgBtn');
fillBgBtn.addEventListener('click', () => {
	canvas.style.background = color;
	bgColor = color;
});

//изменение цвета
const colorInput = document.getElementById('colorInput');
const colorSelect = document.getElementById('colorSelect');

colorInput.addEventListener('change', (e) => {
	ctx.strokeStyle = `${e.target.value}`;
	color = e.target.value;
	ctx.fillStyle = e.target.value;
	colorSelect.value = 'another';
});
colorSelect.addEventListener('change', (e) => {
	ctx.strokeStyle = `${e.target.value}`;
	color = e.target.value;
	ctx.fillStyle = e.target.value;
	colorInput.value = e.target.value;
});

//размер кисти
const sizeInput = document.getElementById('paintSizeControl');
const sizeLabel = document.getElementById('paintSizeLabel');
sizeInput.addEventListener('change', (e) => {
	resetStyleBtn(controlButtons);
	ctx.lineWidth = e.target.value;
	sizeLabel.innerHTML = e.target.value;
	size = e.target.value;
});

//кисть
const brushBtn = document.getElementById('brushBtn');
brushBtn.addEventListener('click', () => {
	resetStyleBtn(controlButtons);
	tool = 'brush';
	ctx.strokeStyle = color;
	brushBtn.classList.add('activeBtn');
});

//ластик
const eraserBtn = document.getElementById('eraserBtn');
eraserBtn.addEventListener('click', () => {
	resetStyleBtn(controlButtons);
	eraserBtn.classList.add('activeBtn');
	tool = 'eraser';
});

//квадрат
const squareBtn = document.getElementById('squareBtn');
squareBtn.addEventListener('click', () => {
	resetStyleBtn(controlButtons);
	tool = 'square';
	ctx.strokeStyle = color;
	squareBtn.classList.add('activeBtn');
});

//круг
const roundBtn = document.getElementById('roundBtn');
roundBtn.addEventListener('click', () => {
	resetStyleBtn(controlButtons);
	tool = 'round';
	ctx.strokeStyle = color;
	roundBtn.classList.add('activeBtn');
});

//линия
const lineBtn = document.getElementById('lineBtn');
lineBtn.addEventListener('click', () => {
	resetStyleBtn(controlButtons);
	tool = 'line';
	lineBtn.classList.add('activeBtn');
});

//добавление текста
const addTextBtn = document.getElementById('addTextBtn');
addTextBtn.addEventListener('click', () => {
	resetStyleBtn(controlButtons);
	tool = 'addText';
	addTextBtn.classList.add('activeBtn');
});

//скачивание канваса
const downloadCanvasBtn = document.getElementById('downloadCanvasBtn');
downloadCanvasBtn.addEventListener('click', () => {
	downloadCanvasBtn.href = canvas.toDataURL();
	downloadCanvasBtn.download = 'canvas.png';
});

const controlButtons = [brushBtn, squareBtn, roundBtn, addTextBtn, eraserBtn, lineBtn];
function resetStyleBtn(arr) {
	arr.forEach((element) => {
		element.classList.remove('activeBtn');
	});
}
