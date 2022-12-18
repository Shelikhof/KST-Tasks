let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;
ctx.font = '48px serif';
ctx.fillStyle = '#fffffff';
let mouseX = null;
let frames = 60;
let ballX = 50;
let ballY = 50;
let ballStepX = 5; //5
let ballStepY = 6; //6
let ballRadius = 10;
let paddleX = null;
let paddleWidth = 100;
let paddleHeight = 10;
let paddleOffset = 40;
let scoreWin = 0;
let scoreLose = 0;
let speed = 2;

const scoreBoard = document.getElementById('scoreBoardWrapper');
const scoreBoardArr = [
	{
		name: 'Василий',
		score: 101,
	},
];

drawAll();
renderScoreBoard();
let intervalID = null;
let intervalTickID = null;

canvas.addEventListener('mousemove', mouseCoords, false);

function mouseCoords(event) {
	let canvasOffset = canvas.getBoundingClientRect();
	let htmlElement = document.documentElement;
	mouseX = event.clientX - canvasOffset.left - htmlElement.scrollLeft;
	paddleX = mouseX - paddleWidth / 2;
}

function drawRect(leftX, leftY, boxWidth, boxHeight, boxFillColor) {
	ctx.fillStyle = boxFillColor;
	ctx.fillRect(leftX, leftY, boxWidth, boxHeight);
}

function drawBall(centerX, centerY, radius, fillColor) {
	ctx.fillStyle = fillColor;
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
	ctx.fill();
	ctx.closePath();
}

function drawLeftText(text) {
	ctx.textAlign = 'left';
	ctx.fillText(text, 10, 48);
}

function drawRightText(text) {
	ctx.textAlign = 'right';
	ctx.fillText(`${+text != 0 ? +text * -1 : text}`, 790, 48);
}

function drawAll() {
	drawRect(0, 0, canvas.width, canvas.height, '#000');
	drawBall(ballX, ballY, ballRadius, 'firebrick');
	drawRect(paddleX, canvas.height - paddleOffset, paddleWidth, paddleHeight, '#fff');
	drawLeftText(scoreWin);
	drawRightText(scoreLose);
}

function moveAll() {
	let paddleLeftEdge = paddleX;
	let paddleRightEdge = paddleLeftEdge + paddleWidth;
	let paddleTopEdge = canvas.height - paddleOffset;
	let paddleBottomEdge = paddleTopEdge + paddleHeight;
	ballX += ballStepX;
	ballY += ballStepY;
	//контакт шара с горизонтальными краями
	if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
		ballStepX *= -1;
	}

	//контакт шара с вертикальными краями
	if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
		if (ballY + ballRadius > paddleTopEdge) ++scoreLose;
		ballStepY *= -1;
	}
	if (ballStepX === 0) ballStepX = 1;
	if (ballX >= canvas.width) ballX = 798;
	//контакт платформы с шаром
	if (
		ballX + ballRadius > paddleLeftEdge &&
		ballX + ballRadius < paddleRightEdge &&
		ballY + ballRadius > paddleTopEdge &&
		ballY + ballRadius < paddleBottomEdge
	) {
		ballStepY *= -1;
		let paddleCenter = paddleLeftEdge + paddleWidth / 2;
		let ballDistance = ballX - paddleCenter;
		ballStepX = (ballDistance * 0.35);
		// ballStepX *= Math.ramdom(0.8, 1.2);
		++scoreWin;
	}
}

function updateAll() {
	return setInterval(() => {
		drawAll();
	}, 1000 / frames);
}

function startTicks() {
	return setInterval(() => {
		moveAll();
	}, 1000 / 60);
}

function startTimer() {
	return setInterval(() => {
		time -= 1;
		timerLabel.innerHTML = `${String(Math.floor(time / 60)).padStart(2, '0')} : ${String(Math.floor(time  % 60)).padStart(2, '0')}`;
		if(time === 0) {
			ballX = 50;
			ballY = 50;
			clearInterval(timerID);
			clearInterval(intervalID);
			clearInterval(intervalTickID);
			isStarted = false;
			pauseBtn.innerHTML = 'Начать';
			speedBtn.disabled = false;
			timerSelect.disabled = false;
			nameInput.disabled = false;
			scoreBoardArr.push({
				name: nameInput.value,
				score: ((scoreLose * -1 + scoreWin) * (speed - 1)) > 0 ? (scoreLose * -1 + scoreWin) * (speed - 1) : 0,
			});
			renderScoreBoard();
		}
	}, 1000)
};

//кнопка паузы
let isStarted = false;
let isPaused = false;
const pauseBtn = document.getElementById('pauseBtn');
pauseBtn.addEventListener('click', () => {
	if(!isStarted) {
		time =  timerSelect.value * 60;
		time = 5;
		intervalID = updateAll();
		intervalTickID = startTicks();
		pauseBtn.innerHTML = 'Пауза';
		isStarted = !isStarted
		timerID = startTimer();
		speedBtn.disabled = true;
		timerSelect.disabled = true;
		nameInput.disabled = true;
		return
	}
	if (!isPaused) {
		clearInterval(intervalID);
		clearInterval(intervalTickID);
		clearInterval(timerID);
		pauseBtn.innerHTML = 'Продолжить';
	} else {
		intervalID = updateAll();
		intervalTickID = startTicks();
		timerID = startTimer();
		pauseBtn.innerHTML = 'Пауза';
	}
	isPaused = !isPaused;
});

//таймер
let time = 60;
let timerID = null;
const timerLabel = document.getElementById('timerLabel');
const timerSelect = document.getElementById('timerSelect');
timerSelect.addEventListener('change', (e) => {
	time = e.target.value * 60;
	timerLabel.innerHTML = `${String(Math.floor(time / 60)).padStart(2, '0')} : 00`;
});


//изменение скорости шара
const speedBtn = document.getElementById('speedInput');
const speedLabel = document.getElementById('speedLabel');
speedBtn.addEventListener('change', (e) => {
	if (ballStepX > 0) ballStepX = +e.target.value + speed;
	else ballStepX = -1 * (+e.target.value + speed);
	if (ballStepY > 0) ballStepY = +e.target.value + speed;
	else ballStepY = -1 * (+e.target.value + speed);
	speedLabel.innerHTML = +e.target.value;
});

//скорборд
const nameInput = document.getElementById('nameInput');

function renderScoreBoard() {
	scoreBoard.innerHTML = '';
	scoreBoardArr.forEach((el) => {
		scoreBoard.innerHTML += `<p>${el.name} - ${el.score}</p>`;
	});
}