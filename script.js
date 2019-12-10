var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');


// update the canvas every 10ms
var speed = 10;
var interval = setInterval(draw, speed);
var gameOver = false;



/* --- BALL --- */

// dimensions
var ballRadius = 10;
var beginAngle = 0;
var endAngle = 2 * Math.PI;

// initial position
var ballX = canvas.width / 2;
var ballY = canvas.height - 30;

// controls how many pixels the ball will move on every update
var dx = 2;
var dy = -2;

// draw the ball
function drawBall() {
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballRadius, beginAngle, endAngle);
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

	if(gameOver){
		return;
	}

	// ball touches top edge
	if(ballY + dy < ballRadius) {
		// change direction of vertical movement
		dy = -dy;
	}

	// ball touches left or right edge
	if(ballX + dx < ballRadius || ballX + dx > canvas.width - ballRadius) {
		// change direction of horizontal movement
		dx = -dx;
	}

	// ball touches the bottom frame
	if(ballY + dy > canvas.height - ballRadius){

		console.log('ballX: ', ballX);
		console.log('paddleX: ', paddleX);
		console.log('paddleWidth: ', paddleWidth);

		// ball is between left and right edges of the paddle
		if(ballX > paddleX && ballX < paddleX + paddleWidth) {
			// change direction of vertical movement
			dy = -dy;
			// increase speed
			speed += 10;
			interval = setInterval(draw, speed)
		} else {
			alert("GAME OVER");
			clearInterval(interval);
			document.location.reload(false);
			gameOver = true;
		}
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
	ballX += dx;
	ballY += dy;

	// set the next position of the paddle based on the keyboard input
	if(rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += moveDistance;
	} else if(leftPressed && paddleX > 0) {
		paddleX -= moveDistance;
	}
}