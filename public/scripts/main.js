import Ball from './classes/ball.js';
import Paddle from './classes/paddle.js';
import Bricks from './classes/bricks.js';
import checkWallCollision from './wallCollision.js';
import checkBrickCollision from './brickCollision.js';
import checkConditions from './checkConditions.js';
import generateLevel from './generateLevel.js';

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');


// update the canvas every 10ms
var speed = 10;
var interval = setInterval(draw, speed);



/* ----------------------- GLOBAL VARIABLES ---------------------- */
var global = {
	level: 0,
	score: 0,
	lives: 3,
	gameStatus: 0,
	holdBall: false,

	//level generator variables
	advance: false,
	randomNumberGenerator: null,
	rowThrottle: 3,

	// collision detection variables
	ballWallCollision: 0,
	ballBrickCollision: 0,
	extraBallWallCollision: 0,
	extraBallBrickCollision: 0,
	bombCollision: 0,
	powerBallWallCollision: 0,
	powerBallBrickCollision: 0,

	// extra entity variables
	extraBall: 0,
	bomb: 0,
	powerBall: 0,
	scatterBalls: [],
	lasers: [],

	// power up
	powerUp: 0

}

// entity variables
var ball = new Ball(canvas.width / 2, canvas.height - 30);
var paddle = new Paddle();
var brickLayout = new Bricks(global.level);
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
	ctx.fillText(`Score: ${global.score}`, 8, 20);
}

function drawLives() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "black";
	ctx.fillText(`Lives: ${global.lives}`, canvas.width - 65, 20);
}

function drawBomb(bomb) {
	ctx.font = "16px Arial";
	ctx.fillStyle = bomb.color;
	ctx.fillText('X', bomb.x, bomb.y);
}

function drawPowerUp() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "black";
	ctx.fillText(`${global.powerUp}`, canvas.width / 2, canvas.height / 2)
}




/* ------------------------ KEYBOARD INPUT ---------------------------- */

// controls the movement of the paddle
var rightPressed = false;
var leftPressed = false;
var click = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);
document.addEventListener("click", clickHandler);

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

function clickHandler(event) {
	click = true;
}




/* ------------------- RANDOM NUMBER GENERATOR ------------------ */





/* ------------------- LEVEL GENERATOR ----------------------- */

function newLevel() {
	brickLayout = generateLevel(global, ball, paddle);
	bricks = brickLayout.getArray();
	drawBricks();
}

function gameOver() {
	alert(`GAME OVER!\n\nScore: ${global.score}`);
	clearInterval(interval);
	document.location.reload(false);
}

function increaseSpeed() {
	clearInterval(interval);
	speed -= 0.05;
	interval = setInterval(draw, speed);
}

function usePowerUp() {
	if(global.powerUp == "Slow Time") {
		clearInterval(interval);
		speed = 10;
		interval = setInterval(draw, speed);
	}
	if(global.powerUp == "Super Ball") {
		ball.power = "Super Ball";
	}
	if(global.powerUp == "Sticky Paddle") {
		paddle.power = "Sticky Paddle";
	}
	if(global.powerUp == "Cluster Bomb") {
		ball.power = "Cluster Bomb";
	}
	if(global.powerUp == "Row Blaster") {
		ball.power = "Row Blaster";
	}
	if(global.powerUp == "Column Blaster") {
		ball.power = "Column Blaster";
	}
	if(global.powerUp == "Scatter Shot") {
		ball.power = "Scatter Shot";
	}
	if(global.powerUp == "Laser Shot") {
		ball.power = "Laser Shot";
	}

	// releases the ball if it is stuck to the paddle
	if(global.holdBall){
		global.holdBall = false;
	}
}



/* -------------------- GAME LOGIC ---------------------- */


function draw() {
	// clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawBall(ball);
	drawPaddle();
	drawBricks();
	drawScore();
	drawLives();

	if(global.powerUp) {
		drawPowerUp();
	}
	

	// returns the x coordinate of where the ball touched the paddle
	// returns -1 if the ball hit the ground
	// returns 0 otherwise
	global.ballWallCollision = checkWallCollision(ball, paddle);

	// if the ball hit the paddle, increase the speed
	if(global.ballWallCollision > 0) {
		increaseSpeed();
	}

	// returns true if a brick was hit
	// returns false otherwise
	global.ballBrickCollision = checkBrickCollision(bricks, brickLayout, ball);

	// dictates the logic of the extra ball - assuming it exists
	if(global.extraBall) {
		drawBall(global.extraBall);
		
		// returns the x coordinate of where the extra ball touched the paddle
		// returns -1 if the extra ball touched the ground
		// returns 0 otherwise
		global.extraBallWallCollision = checkWallCollision(global.extraBall, paddle);

		// returns true if a brick was hit
		// returns false otherwise
		global.extraBallBrickCollision = checkBrickCollision(bricks, brickLayout, global.extraBall);

		// update position of extra ball
		global.extraBall.x += global.extraBall.dx;
		global.extraBall.y += global.extraBall.dy;
	}

	// dictates the logic of the power ball - assuming it exists
	if(global.powerBall) {
		drawBall(global.powerBall);

		// returns the x coordinate of where the power ball touched the paddle
		// returns -1 if the power ball touched the ground
		// returns 0 otherwise
		global.powerBallWallCollision = checkWallCollision(global.powerBall, paddle);

		// returns true if a brick was hit
		// returns false otherwise
		global.powerBallBrickCollision = checkBrickCollision(bricks, brickLayout, global.powerBall);

		// update position of power ball
		global.powerBall.x += global.powerBall.dx;
		global.powerBall.y += global.powerBall.dy;
	}

	// dictates the logic of the scatter balls - assuming they exist
	for(var i = 0; i < global.scatterBalls.length; i++) {

		var curr = global.scatterBalls[i];
		
		// if the scatter ball hit a brick - erase it
		// otherwise, update it
		if(curr.power == "none") {
			global.scatterBalls.splice(i, 1);
			// update index so no elements are skipped within the loop
			i--;
		} else {
			drawBall(curr);

			// check to see if a brick was hit
			checkBrickCollision(bricks, brickLayout, curr);
			checkWallCollision(curr, paddle);

			// update position of power ball
			curr.x += curr.dx;
			curr.y += curr.dy;
		}
	}

	// dictates the logic of the lasers - assuming they exist
	for(var i = 0; i < global.lasers.length; i++) {

		var curr = global.lasers[i];
		
		// if the scatter ball hit a brick - erase it
		// otherwise, update it
		if(curr.power == "none") {
			global.lasers.splice(i, 1);
			// update index so no elements are skipped within the loop
			i--;
		} else {
			drawBall(curr);

			// check to see if a brick was hit
			checkBrickCollision(bricks, brickLayout, curr);

			// check to see if the top edge was hit
			checkWallCollision(curr, paddle);

			// update position of power ball
			curr.x += curr.dx;
			curr.y += curr.dy;
		}
	}

	// use the player's power up
	if(click == true) {
		usePowerUp();
		global.powerUp = 0;
		click = false;
	}

	// dictates the logic of the bomb - assuming it exists
	if(global.bomb) {
		drawBomb(global.bomb);

		// returns the x coordinate of where the bomb touched the paddle
		// returns -1 if the bomb touched the ground
		// returns 0 otherwise
		global.bombCollision = checkWallCollision(global.bomb, paddle);

		// update position of the bomb
		global.bomb.x += global.bomb.dx;
		global.bomb.y += global.bomb.dy;
	}

	// returns 1 if the player cleared the level
	// returns -1 if game over
	global.gameStatus = checkConditions(global, brickLayout, bricks, ball, paddle);

	if(global.gameStatus == 1) {
		newLevel();
	} else if(global.gameStatus == -1) {
		gameOver();
	}

	// set the next position of the ball
	if(global.ballWallCollision > 0 && paddle.power == "Sticky Paddle") {
		global.holdBall = global.ballWallCollision;
	}

	if(global.holdBall){
		// store the x coordinate of where the ball touched the paddle in holdBall variable
		ball.x = paddle.position + global.holdBall;
	} else {
		ball.x += ball.dx;
		ball.y += ball.dy;
	}

	// reset collision detection variables
	global.ballWallCollision = 0;
	global.ballBrickCollision = 0;
	global.extraBallWallCollision = 0;
	global.extraBallBrickCollision = 0;
	global.bombCollision = 0;

	// set the next position of the paddle based on the keyboard input
	if(rightPressed && paddle.position < canvas.width - paddle.width) {
		paddle.position += paddle.distance;
	} else if(leftPressed && paddle.position > 0) {
		paddle.position -= paddle.distance;
	}
}