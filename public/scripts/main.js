import Ball from './ball.js';
import Paddle from './paddle.js';
import Bricks from './bricks.js';
import checkWallCollision from './wallCollision.js';

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');


// update the canvas every 10ms
var speed = 10;
var interval = setInterval(draw, speed);
var result;




/* ------------------ BALL -------------------- */


// initial position
// var ball.x = canvas.width / 2;
// var ball.y = canvas.height - 30;

var ball = new Ball(canvas.width / 2, canvas.height - 30);

// draw the ball
function drawBall(ball) {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
	ctx.fillStyle = ball.color;
	ctx.fill();
	ctx.closePath();
}




/* ------------------- PADDLE -------------------- */

var paddle = new Paddle();

// draw the paddle
function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddle.position, canvas.height - paddle.height, paddle.width, paddle.height);
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
		paddle.position = relativeX - paddle.width / 2;
	}
}







/* ------------------- BRICKS --------------------- */

var level = 1;

var brickLayout = new Bricks(level);
var bricks = brickLayout.test();

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

// function checkWallCollision(ball) {

// 	// // check end condition
// 	// if(gameOver){
// 	// 	return;
// 	// }

// 	// ball touches top edge
// 	if(ball.y + ball.dy < ball.radius) {
// 		ball.dy = -ball.dy;
// 	}

// 	// ball touches left or right edge
// 	if(ball.x + ball.dx < ball.radius || ball.x + ball.dx > canvas.width - ball.radius) {
// 		ball.dx = -ball.dx;
// 	}

// 	// ball touches the bottom frame
// 	if(ball.y + ball.dy > canvas.height - ball.radius){

// 		// ball is between left and right edges of the paddle
// 		if(ball.x > paddle.position && ball.x < paddle.position + paddle.width) {

// 			// change direction of vertical movement
// 			ball.dy = -ball.dy;
// 			// increase score
// 			score += 1;

// 			//increase speed
// 			// clearInterval(interval);
// 			// speed -= 0.10;
// 			// interval = setInterval(draw, speed)

// 			//incease speed
// 			// ball.increaseSpeed();
// 		} else {
// 			ball.dy = -ball.dy;
// 			return true;
// 		}
// 	}
// 	return false;
// }

function checkBrickCollision() {
	for(var i = 0; i < brickLayout.columns; i++){
		for(var j = 0; j < brickLayout.rows; j++){
			var currBrick = bricks[i][j];

			// brick is active
			if(currBrick.status == 1){

				// ball is between beginning and end of brick
				if(ball.x > currBrick.x && ball.x < currBrick.x + brickLayout.width) {

					// ball is touching the top or bottom of the brick
					if(ball.y - ball.radius >= currBrick.y && ball.y - ball.radius <= currBrick.y + brickLayout.height){

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

function checkWin(){
	var flag = 0;

	for(var i = 0; i < brickLayout.columns; i++){
		for(var j = 0; j < brickLayout.rows; j++){
			if(bricks[i][j].status === 1){
				flag = 1;
			}
		}
	}

	if(flag === 0){
		speed = 10;
		level++;
		brickLayout = new Bricks(level);
		bricks = brickLayout.test();
		drawBricks();
	}
}

function draw() {
	// clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawBall(ball);
	drawPaddle();
	drawBricks();
	drawScore();
	drawLives();

	// detect wall collision
	result = checkWallCollision(ball, paddle);

	// ball touched floor
	if(result == -1){
		// check to see if the player has any lives
		if(lives === 0){
			// game over
			alert(`GAME OVER!\n\nScore: ${score}`);
			clearInterval(interval);
			document.location.reload(false);
			gameOver = true;
		} else {
			// player loses a life
			lives--;
		}
	// ball hit the paddle
	} else if(result == 1) {
		// player gets points
		score++;
	}

	// detect brick collision
	checkBrickCollision();

	// check win
	checkWin();

	// set the next position of the ball
	ball.x += ball.dx;
	ball.y += ball.dy;


	// set the next position of the paddle based on the keyboard input
	if(rightPressed && paddle.position < canvas.width - paddle.width) {
		paddle.position += paddle.distance;
	} else if(leftPressed && paddle.position > 0) {
		paddle.position -= paddle.distance;
	}

	/* Gives control of the rendering to the browser */
	// requestAnimationFrame(draw);
}

// draw();