let pos = 0;
let phase = 0;

const startBtn = document.getElementById('startBtn');
startBtn.addEventListener('click', () => {
	myMove();
	startBtn.disabled = true;
});
// let step = 1;
let isClockWise = true;
const reverseBtn = document.getElementById('reverseBtn');
reverseBtn.addEventListener('click', () => {
	isClockWise = !isClockWise;
});

function finishPhase(id, nextPhase) {
	clearInterval(id);
	phase = nextPhase;
	startBtn.disabled = false;
}

function myMove() {
	let elem = document.getElementById('animate');
	let id = setInterval(isClockWise ? frame : reverseFrame, 1);

	function frame() {
		switch (phase) {
			case 0:
				if (pos == 350) {
					// clearInterval(id);
					// phase = 1;
					// startBtn.disabled = false;
					finishPhase(id, 1);
				} else {
					pos += 1;
					elem.style.top = pos + 'px';
					elem.style.left = pos + 'px';
				}
				break;
			case 1:
				if (pos == 0) {
					finishPhase(id, 2);
				} else {
					pos -= 1;
					elem.style.left = pos + 'px';
				}
				break;
			case 2:
				if (pos == 350) {
					finishPhase(id, 3);
				} else {
					pos += 1;
					elem.style.left = pos + 'px';
					elem.style.top = 350 - pos + 'px';
				}
				break;
			case 3:
				if (pos == 0) {
					finishPhase(id, 0);
				} else {
					pos -= 1;
					elem.style.left = pos + 'px';
				}
				break;
		}
	}

	function reverseFrame() {
		switch (phase) {
			case 0:
				if (pos == 350) {
					finishPhase(id, 3);
				} else {
					pos += 1;
					elem.style.left = pos + 'px';
				}
				break;
			case 1:
				if (pos == 0) {
					finishPhase(id, 0);
				} else {
					pos -= 1;
					elem.style.left = pos + 'px';
					elem.style.top = pos + 'px';
				}
				break;
			case 2:
				if (pos == 350) {
					finishPhase(id, 1);
				} else {
					pos += 1;
					elem.style.left = pos + 'px';
				}
				break;
			case 3:
				if (pos == 0) {
					finishPhase(id, 2);
				} else {
					pos -= 1;
					elem.style.left = pos + 'px';
					elem.style.top = 350 - pos + 'px';
				}
				break;
		}
	}
}
