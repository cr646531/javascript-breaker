import Ball from './ball.js';
import Paddle from './paddle.js';
import Bricks from './bricks.js';
import checkWallCollision from './wallCollision.js';
import checkBrickCollision from './brickCollision.js';
import Bomb from './bomb.js';
import checkConditions from './checkConditions.js';

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');


// update the canvas every 10ms
var speed = 10;
var interval = setInterval(draw, speed);



/* ----------------------- GLOBAL VARIABLES ---------------------- */
var global = {
	level: 1,
	score: 0,
	lives: 3,
	gameStatus: 0,

	//level generator variables
	advance: false,
	randomNumberGenerator: null,

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
	if(global.powerUp){
		click = true;
	}
}




/* ------------------- RANDOM NUMBER GENERATOR ------------------ */

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}





/* ------------------- LEVEL GENERATOR ----------------------- */

function newLevel() {

	// testing
	console.log(speed);

	// increase the level
	global.level++;
	global.advance = false;

	// draw the next set of bricks
	brickLayout = new Bricks(global.level);
	bricks = brickLayout.getArray();
	drawBricks();

	// if the player ended a level with the bomb in tact, the player gets a longer paddle, and the bomb disappears
	if(global.bomb) {
		paddle.width += 10;
		global.bomb = 0;
	}

	// if the player ended a level with the extra ball in tact, the player gets 50 points
	if(global.extraBall) {
		global.score += 50;
		global.extraBall = 0;
	}

	// if the player ended a level with the power ball in tact, the player gets a random power up
	if(global.powerBall) {
		global.powerUp = "Slow Time";
		global.powerBall = 0;
	}

	// determines, at random, which extra entities will spawn

	global.randomNumberGenerator = getRandomInt(5);
	//global.randomNumberGenerator = 5;
	if(global.randomNumberGenerator == 5){
		global.powerBall = new Ball(canvas.width / 2, canvas.height - 30, 10, "yellow", 0.5, -0.5, true)
	}

	// ensures the player will not receive an extra ball and a power ball at the same time
	if(!global.powerBall){
		global.randomNumberGenerator = getRandomInt(3);
		if(global.randomNumberGenerator == 2) {
			global.extraBall = new Ball(canvas.width / 2, canvas.height - 30, 10, "purple", 0.5, -0.5)
		}
	}

	global.randomNumberGenerator = getRandomInt(3);
	if(global.randomNumberGenerator == 2) {
		global.bomb = new Bomb(canvas.width / 2, canvas.height - 30);
	}
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
	

	// returns 1 if the ball hit the paddle
	// returns -1 if the ball hit the ground
	// returns 0 otherwise
	global.ballWallCollision = checkWallCollision(ball, paddle);

	// if the ball hit the paddle, increase the speed
	if(global.ballWallCollision == 1) {
		increaseSpeed();
	}

	
	// returns true if a brick was hit
	// returns false otherwise
	global.ballBrickCollision = checkBrickCollision(bricks, brickLayout, ball);

	// dictates the logic of the extra ball - assuming it exists
	if(global.extraBall) {
		drawBall(global.extraBall);
		
		// returns 1 if the extra ball touched the paddle
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

		// returns 1 if the power ball touched the paddle
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

	// use the player's power up
	if(click == true) {
		usePowerUp();
		global.powerUp = 0;
		click = false;
	}

	// dictates the logic of the bomb - assuming it exists
	if(global.bomb) {
		drawBomb(global.bomb);

		// returns 1 if the bomb touched the paddle
		// returns -1 if the bomb touched the ground
		// returns 0 otherwise
		global.bombCollision = checkWallCollision(global.bomb, paddle);

		// update position of the bomb
		global.bomb.x += global.bomb.dx;
		global.bomb.y += global.bomb.dy;
	}

	// returns 1 if the player cleared the level
	// returns -1 if game over
	global.gameStatus = checkConditions(global, brickLayout, bricks);

	if(global.gameStatus == 1) {
		newLevel();
	} else if(global.gameStatus == -1) {
		gameOver();
	}

	// reset collision detection variables
	global.ballWallCollision = 0;
	global.ballBrickCollision = 0;
	global.extraBallWallCollision = 0;
	global.extraBallBrickCollision = 0;
	global.bombCollision = 0;

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