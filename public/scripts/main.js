import Ball from './ball.js';
import Paddle from './paddle.js';
import Bricks from './bricks.js';
import checkWallCollision from './wallCollision.js';
import checkBrickCollision from './brickCollision.js';

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');


// update the canvas every 10ms
var speed = 10;
var interval = setInterval(draw, speed);
var result;
var hit;
var advance = false;


/* ----------------------- GLOBAL VARIABLES ---------------------- */
var level = 1;
var score = 0;
var lives = 3;
var extraBall = 0;
var extraResult;
var extraHit;

var ball = new Ball(canvas.width / 2, canvas.height - 30);
var paddle = new Paddle();
var brickLayout = new Bricks(level);
var bricks = brickLayout.getArray();




/* ------------------------ DRAW FUNCTIONS ------------------------- */

function drawBall(ball) {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
	ctx.fillStyle = ball.color;
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddle.position, canvas.height - paddle.height, paddle.width, paddle.height);
	ctx.fillStyle = paddle.color;
	ctx.fill();
	ctx.closePath();
}

function drawBricks() {
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

function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "black";
	ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "black";
	ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}




/* ------------------------ KEYBOARD INPUT ---------------------------- */

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



/* -------------------- GAME LOGIC ---------------------- */


function checkConditions() {

	// if the ball touched the floor then the player loses a life
	// if the player has no more lives, then the game ends
	if(result == -1) {
		if(lives > 0) {
			lives--;
		} else {
			alert(`GAME OVER!\n\nScore: ${score}`);
			clearInterval(interval);
			document.location.reload(false);
			// gameOver = true;
		} 			
	} 

	// if the extra ball touched the floor, the player loses the extra ball
	if(extraResult == -1){
		extraBall = 0;
	}

	// if the extra ball touched the paddle, the player gains a point and the speed increases
	if(extraResult == 1){
		score++;
		// increase speed
		clearInterval(interval);
		speed -= 0.25;
		interval = setInterval(draw, speed);
	}
	
	// if the ball touched the paddle the player gains a point
	// if all the bricks have been destroyed, the new level begins
	if(result == 1) {
		if(advance){
			level++;
			brickLayout = new Bricks(level);
			bricks = brickLayout.getArray();
			drawBricks();
			advance = false;
			extraBall = new Ball(canvas.width / 2, canvas.height - 30, 10, "purple", 0.5, -0.5, 2)
		}
		score++;
	}

	// if the player destroyed a brick, the player gains five points
	if(hit){
		score += 5;
	}

	// if the player destroyed a brick with the extra ball, the player gains 10 points
	if(extraHit){
		score += 10;
	}

	// if there are no bricks remaining, the player is ready to advance
	// the new level will begin once the ball touches the players paddle
	var flag = 0;

	for(var i = 0; i < brickLayout.columns; i++){
		for(var j = 0; j < brickLayout.rows; j++){
			if(bricks[i][j].status === 1){
				flag = 1;
			}
		}
	}

	if(flag === 0){
		advance = true;
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

	// returns 1 if the ball hit the paddle
	// returns -1 if the ball hit the ground
	// returns 0 otherwise
	result = checkWallCollision(ball, paddle);

	
	// returns true if a brick was hit
	// returns false otherwise
	hit = checkBrickCollision(bricks, brickLayout, ball);

	// check game conditions
	checkConditions();

	if(extraBall){
		drawBall(extraBall);
		extraResult = checkWallCollision(extraBall, paddle);
		extraHit = checkBrickCollision(bricks, brickLayout, extraBall);
		extraBall.x += extraBall.dx;
		extraBall.y += extraBall.dy;
	}

	// set the next position of the ball
	ball.x += ball.dx;
	ball.y += ball.dy;

	// set the next position of the paddle based on the keyboard input
	if(rightPressed && paddle.position < canvas.width - paddle.width) {
		paddle.position += paddle.distance;
	} else if(leftPressed && paddle.position > 0) {
		paddle.position -= paddle.distance;
	}

}