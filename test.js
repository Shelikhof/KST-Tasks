function findBorder(x, y, dataArr, mainColor) {
	let leftPoint = x,
		rightPoint = x;
	while (
		comparePixelColor(...getRGB(rightPoint, y, dataArr, WIDTH), ...mainColor) &&
		rightPoint < 700
	) {
		++rightPoint;
	}
	while (
		comparePixelColor(...getRGB(leftPoint - 1, y, dataArr, WIDTH), ...mainColor) &&
		leftPoint > 0
	) {
		--leftPoint;
	}
	return [leftPoint, rightPoint];
}

function findNearestPoint(left, right, y, direct, mainColor, dataArr) {
	let nextPoint = left;
	while (
		!comparePixelColor(...getRGB(nextPoint, y, dataArr, WIDTH), ...mainColor) &&
		nextPoint != right
	) {
		nextPoint += 1;
	}
	if (left === right) return 'finish';
	return nextPoint;
}

function fillToolFunc(x, y, dataArr) {
	let mainColor = getRGB(x, y, dataArr);
	ctx.fillStyle = 'red';
	let depth = 0;
	function fillPixel(x, y, mainColor, depth, fillColor = '#000000') {
		let currentColor = getRGB(x, y, dataArr);
		// console.log(!comparePixelColor(...currentColor, ...mainColor));
		if (x < 700 && y < 500 && x > 0 && y > 0)
			if (
				!comparePixelColor(...currentColor, ...mainColor) ||
				// depth === 5000 ||
				getRGB(x, y, dataArr)[0] === -1
			) {
				// console.log(12);
				return;
			}
		ctx.fillRect(x, y, 1, 1);
		dataArr[(x + y * WIDTH) * 4] = -1;
		dataArr[(x + y * WIDTH) * 4 + 1] = -1;
		dataArr[(x + y * WIDTH) * 4 + 2] = -1;
		fillPixel(x + 1, y, mainColor, depth + 1);
		fillPixel(x - 1, y, mainColor, depth + 1);
		fillPixel(x, y + 1, mainColor, depth + 1);
		fillPixel(x, y - 1, mainColor, depth + 1);
		return;
	}

	fillPixel(x, y, mainColor, depth);
	// console.log(mainColor);
}

//========
function fillToolFunc(x, y, dataArr) {
	let mainColor = getRGB(x, y, dataArr);
	ctx.fillStyle = 'red';
	let depth = 0;
	function fillPixel(x, y, mainColor, depth, fillColor = '#000000') {
		let currentColor = getRGB(x, y, dataArr);
		console.log(mainColor, currentColor);
		// console.log(!comparePixelColor(...currentColor, ...mainColor));
		if (x < 700 && y < 500 && x > 0 && y > 0)
			if (
				!comparePixelColor(...currentColor, ...mainColor) ||
				// depth === 5000 ||
				getRGB(x, y, dataArr)[0] === -100
			) {
				// console.log(12);
				return;
			}
		ctx.fillRect(x, y, 1, 1);
		dataArr[(x + y * WIDTH) * 4] = -100;
		dataArr[(x + y * WIDTH) * 4 + 1] = -100;
		dataArr[(x + y * WIDTH) * 4 + 2] = -100;
		fillPixel(x + 1, y, mainColor, depth + 1);
		fillPixel(x - 1, y, mainColor, depth + 1);
		fillPixel(x, y + 1, mainColor, depth + 1);
		fillPixel(x, y - 1, mainColor, depth + 1);
		return;
	}

	fillPixel(x, y, mainColor, depth);
	// console.log(mainColor);
}

function fillToolFunc(x, y, dataArr) {
	let mainColor = getRGB(x, y, dataArr);
	const X = x,
		Y = y;
	ctx.fillStyle = 'red';
	let q = [];
	q.push([x, y]);
	while (q.length > 0 && q.length < 100000) {
		let [x, y] = q[0];
		let currentColor = getRGB(x, y, dataArr);
		ctx.fillRect(x, y, 1, 1);
		dataArr[(x + y * 700) * 4] = -1;
		dataArr[(x + y * 700) * 4 + 1] = -1;
		dataArr[(x + y * 700) * 4 + 2] = -1;

		console.log(q.length);
		q.shift();
		// console.log(x, y, X, Y);
		if (x + 1 < 700 && comparePixelColor(...getRGB(x + 1, y, dataArr), ...mainColor)) {
			q.push([x + 1, y]);
		}
		// console.log(q[0]);
		if (x - 1 > -1 && comparePixelColor(...getRGB(x - 1, y, dataArr), ...mainColor))
			q.push([x - 1, y]);
		// if (y + 1 < 500 && comparePixelColor(...getRGB(x, y + 1, dataArr), ...mainColor))
		// 	q.push([x, y + 1]);
		// if (y - 1 < 0 && comparePixelColor(...currentColor, ...mainColor)) q.push([y + 1, y]);
	}
}

function getRGB(x, y, dataArr, width = 700) {
	let r = dataArr[(x + y * width) * 4],
		g = dataArr[(x + y * width) * 4 + 1],
		b = dataArr[(x + y * width) * 4 + 2];
	return [r, g, b];
}

function fillToolFunc(x, y, dataArr) {
	// console.log(x, y);
	let mainColor = getRGB(x, y, dataArr, WIDTH);
	let referencePointArr = [];
	// ctx.fillStyle = '#889900';
	let [leftPoint, rightPoint] = findBorder(x, y, dataArr, mainColor);
	ctx.fillRect(leftPoint, y, rightPoint - leftPoint, 1);
	referencePointArr.push([y, leftPoint, rightPoint, -1]);
	referencePointArr.push([y, leftPoint, rightPoint, 1]);
	// console.log(referencePointArr[0]);
	while (referencePointArr.length > 0) {
		// ctx.fillStyle = 'red';
		console.log(referencePointArr.length);
		let [y, x1, x2, direct] = referencePointArr[referencePointArr.length - 1];
		console.log(y, x1, x2, direct);
		if (y + direct < 0 || y + direct >= WIDTH) {
			referencePointArr.pop();
			continue;
		}
		x1 = findNearestPoint(x1, x2, y + direct, direct, mainColor, dataArr);
		if (x1 === 'finish') continue;
		let [leftPoint, rightPoint] = findBorder(x1, y + direct, dataArr, mainColor);
		ctx.fillRect(leftPoint, y + direct, rightPoint - leftPoint, 1);
		referencePointArr.pop();
		// if (leftPoint > x1 && direct === -1) referencePointArr.push(y + direct, leftPoint - 1, x1, 1);
		// if (rightPoint > x2 && direct === -1) referencePointArr.push(y + direct, x2 + 1, rightPoint, 1);
	}
	return [rightPoint, leftPoint];
}

function nonStrictCompare(a, b) {
	return a === b || a + 1 === b || a - 1 === b;
}

function comparePixelColor(r1, g1, b1, r2, g2, b2) {
	return nonStrictCompare(r1, r2) && nonStrictCompare(g1, g2) && nonStrictCompare(b1, b2);
}

function comparePixelColorWithCoordinate(x1, y1, x2, y2, dataArr) {
	let [r1, g1, b1] = getRGB(x1, y1, dataArr);
	let [r2, g2, b2] = getRGB(x2, y2, dataArr);
	return comparePixelColor(r1, g1, b1, r2, g2, b2);
}

function fillToolFunc(x, y, dataArr) {
	let mainColor = getRGB(x, y, dataArr);
	ctx.fillStyle = `${color}`;
	let depth = 0;
	function fillPixel(x, y, mainColor, depth) {
		let currentColor = getRGB(x, y, dataArr);
		if (x < 700 && y < 500 && x > 0 && y > 0)
			if (!comparePixelColor(...currentColor, ...mainColor) || getRGB(x, y, dataArr)[0] === -100) {
				return;
			}
		ctx.fillRect(x, y, 1, 1);
		dataArr[(x + y * WIDTH) * 4] = -100;
		dataArr[(x + y * WIDTH) * 4 + 1] = -100;
		dataArr[(x + y * WIDTH) * 4 + 2] = -100;
		fillPixel(x + 1, y, mainColor, depth + 1);
		fillPixel(x - 1, y, mainColor, depth + 1);
		fillPixel(x, y + 1, mainColor, depth + 1);
		fillPixel(x, y - 1, mainColor, depth + 1);
		return;
	}

	fillPixel(x, y, mainColor, depth);
}
