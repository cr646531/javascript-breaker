import Ball from './ball.js';
import Paddle from './paddle.js';
import Bricks from './bricks.js';

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');


// update the canvas every 10ms
var speed = 10;
var interval = setInterval(draw, speed);
var gameOver = false;




/* ------------------ BALL -------------------- */


// initial position
var ballX = canvas.width / 2;
var ballY = canvas.height - 30;

var ball = new Ball();


// draw the ball
function drawBall() {
	ctx.beginPath();
	ctx.arc(ballX, ballY, ball.radius, ball.sAngle, ball.eAngle);
	ctx.fillStyle = ball.color;
	ctx.fill();
	ctx.closePath();
}



/* ------------------- PADDLE -------------------- */

var paddle = new Paddle();

// initial position
var paddleX = (canvas.width - paddle.width) / 2;

// draw the paddle
function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddle.height, paddle.width, paddle.height);
	ctx.fillStyle = paddle.color;
	ctx.fill();
	ctx.closePath();
}




/* -------------------- KEYBOARD INPUT ------------------------ */

// // controls the movement of the paddle
var rightPressed = false;
var leftPressed = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);

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

function mouseMoveHandler(event) {
	var relativeX = event.clientX - canvas.offsetLeft;
	if(relativeX > paddle.width / 2 && relativeX < canvas.width - paddle.width / 2) {
		paddleX = relativeX - paddle.width / 2;
	}
}







/* ------------------- BRICKS --------------------- */

var brickLayout = new Bricks();
var bricks = brickLayout.getArray();

function drawBricks(){
	for(var i = 0; i < brickLayout.columns; i++){
		for(var j = 0; j < brickLayout.rows; j++){

			var currBrick = bricks[i][j];

			if(currBrick.status == 1){
				ctx.beginPath();
				ctx.rect(currBrick.x, currBrick.y, brickLayout.width, brickLayout.height);
				ctx.fillStyle = brickLayout.color;
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}





/* -------------------- SCORE --------------------- */

var score = 0;

function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "black";
	ctx.fillText(`Score: ${score}`, 8, 20);
}





/* -------------------- LIVES --------------------- */

var lives = 3;

function drawLives() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "black";
	ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}




/* -------------------- GAME LOGIC ---------------------- */

function checkWallCollision() {

	// check end condition
	if(gameOver){
		return;
	}

	// ball touches top edge
	if(ballY + ball.dy < ball.radius) {
		// change direction of vertical movement
		ball.dy = -ball.dy;
	}

	// ball touches left or right edge
	if(ballX + ball.dx < ball.radius || ballX + ball.dx > canvas.width - ball.radius) {
		// change direction of horizontal movement
		ball.dx = -ball.dx;
	}

	// ball touches the bottom frame
	if(ballY + ball.dy > canvas.height - ball.radius){

		// ball is between left and right edges of the paddle
		if(ballX > paddleX && ballX < paddleX + paddle.width) {
			// change direction of vertical movement
			ball.dy = -ball.dy;

			//increase speed
			clearInterval(interval);
			speed -= 0.25;
			interval = setInterval(draw, speed)

			// // incease speed
			// ball.increaseSpeed();

			// add 1 to the player's score
			score += 1;
		// ball hit the bottom edge
		} else {

			// check to see if player has any lives remaining
			if(lives === 0){
				// game over
				alert(`GAME OVER!\n\nScore: ${score}`);
				clearInterval(interval);
				document.location.reload(false);
				gameOver = true;
			} else {
				lives--;
				ball.dy = -ball.dy;
			}
		}
	}
}

function checkBrickCollision() {
	for(var i = 0; i < brickLayout.columns; i++){
		for(var j = 0; j < brickLayout.rows; j++){
			var currBrick = bricks[i][j];

			// brick is active
			if(currBrick.status == 1){

				// ball is between beginning and end of brick
				if(ballX > currBrick.x && ballX < currBrick.x + brickLayout.width) {

					// ball is touching the top or bottom of the brick
					if(ballY - ball.radius >= currBrick.y && ballY - ball.radius <= currBrick.y + brickLayout.height){

						// eliminate the brick
						currBrick.status = 0;

						// change vertical direction of the ball
						ball.dy = -ball.dy;

						// add 5 to the player's score
						score += 5;
					}	
				}
			}
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

	// draw the bricks
	drawBricks();

	// draw the score
	drawScore();

	// draw lives
	drawLives();

	// detect wall collision
	checkWallCollision();

	// detect brick collision
	checkBrickCollision();

	// set the next position of the ball
	ballX += ball.dx;
	ballY += ball.dy;

	// set the next position of the paddle based on the keyboard input
	if(rightPressed && paddleX < canvas.width - paddle.width) {
		paddleX += paddle.distance;
	} else if(leftPressed && paddleX > 0) {
		paddleX -= paddle.distance;
	}

	/* Gives control of the rendering to the browser */
	// requestAnimationFrame(draw);
}

// draw();