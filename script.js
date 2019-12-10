var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// update the canvas every 10ms
setInterval(draw, 10);



/* --- BALL --- */

// dimensions
var ballRadius = 10;
var beginAngle = 0;
var endAngle = 2 * Math.PI;

// initial position
var x = canvas.width / 2;
var y = canvas.height - 30;

// controls how many pixels the ball will move on every update
var dx = 2;
var dy = -2;

// draw the ball
function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, beginAngle, endAngle);
	ctx.fillStyle = "blue";
	ctx.fill();
	ctx.closePath();
}


/* --- PADDLE --- */

// dimensions
paddleHeight = 10;
paddleWidth = 75;

// initial position
paddleX = (canvas.width - paddleWidth) / 2;

// controls the movement of the paddle
var moveDistance = 7;
var rightPressed = false;
var leftPressed = false;
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(event) {
	if(event.keyCode == 39) {
		rightPressed = true;
	} else if(event.keyCode == 37) {
		leftPressed = true;
	}
}

function keyUpHandler(event) {
	if(event.keyCode == 39) {
		rightPressed = false;
	} else if(event.keyCode == 37) {
		leftPressed = false;
	}
}

// draw the paddle
function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.closePath();
}

/* --- FUNCTIONS --- */

function checkWallCollision() {
	if(y + dy < ballRadius || y + dy > canvas.height - ballRadius) {
		dy = -dy;
	}
	if(x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
		dx = -dx;
	}
}

function draw() {
	// clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// draw the ball
	drawBall();

	// draw the paddle
	drawPaddle();

	// detect collisions
	checkWallCollision();

	// set the next position of the ball
	x += dx;
	y += dy;

	// set the next position of the paddle
	if(rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += moveDistance;
	} else if(leftPressed && paddleX > 0) {
		paddleX -= moveDistance;
	}
}