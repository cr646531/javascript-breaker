import Ball from './classes/ball.js';
import Paddle from './classes/paddle.js';
import Bricks from './classes/bricks.js';
import checkWallCollision from './collisionDetection/wallCollision.js';
import checkBrickCollision from './collisionDetection/brickCollision.js';
import checkConditions from './checkConditions.js';
import generateLevel from './generateLevel.js';

import updatePowerBall from './entities/powerBall.js';
import updateExtraBall from './entities/extraBall.js';
import updateBall from './entities/ball.js';
import updateBomb from './entities/bomb.js';

// document elements
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// images
var bombImage = document.getElementById("bomb");
var clockImage = document.getElementById("clock");
var arrow = document.getElementById("arrow");
var arrow_NE = document.getElementById("arrow_NE");
var arrow_SE = document.getElementById("arrow_SE");
var arrow_SW = document.getElementById("arrow_SW");
var arrow_NW = document.getElementById("arrow_NW");

var missile_NE = document.getElementById("missile_NE");
var missile_SE = document.getElementById("missile_SE");
var missile_SW = document.getElementById("missile_SW");
var missile_NW = document.getElementById("missile_NW");
var missile = document.getElementById("missile");

var slime_ball = document.getElementById("slime_ball");


// update the canvas every 10ms
var speed = 10;
var interval = setInterval(draw, speed);



/* ----------------------- GLOBAL VARIABLES ---------------------- */
var global = {

	// gameplay variables
	level: 0,
	score: 0,
	lives: 3,
	gameStatus: 0,

	//level generator variables
	advance: false,
	randomNumberGenerator: null,
	rowThrottle: 3,
	sizeUp: 0,

	// collision detection variables
	ballWallCollision: 0,
	extraBallWallCollision: 0,
	bombCollision: 0,
	powerBallWallCollision: 0,
	powerBallBrickCollision: 0,
	holdBall: false,

	// extra entity variables
	extraBall: 0,
	bomb: 0,
	powerBall: 0,
	scatterBalls: [],
	lasers: [],

	// power up ball location and status
	releasedPowerBall: 0,
	brickContainingPowerUp: {
		x: 0,
		y: 0
	},

	// power up
	powerUp: 0,
	nextPower: 0,
	powers: ["Slow Time", "Arrow", "Sticky Paddle", "Cluster Bomb", "Row Blaster", "Column Blaster", "Scatter Shot", "Laser Shot", "Ghost Ball"]
}

// entity variables
var ball = new Ball(canvas.width / 2, canvas.height - 30);
var paddle = new Paddle();
var brickLayout = new Bricks(global.level);
var bricks = brickLayout.getArray();





/* ------------------------ DRAW FUNCTIONS ------------------------- */


function drawIntro() {
	ctx.font = "42px Arial";
	ctx.fillStyle = "black";
	ctx.fillText(`Press the spacebar`, 50, 100);
	ctx.fillText('to start the game', 70, 200);
}

function drawPause() {

	// draw a black border around the white text
	ctx.font = "bold 64px Verdana";
	ctx.fillStyle = "black";

	var x = 111;
	var y = 170;

	for(var i = 0; i <= 8; i++) {
		for(var j = 0; j <= 10; j++) {
			ctx.fillText('PAUSE', x, y);
			y++;
		}
		x++;
		y = 170;
	}
	
	// draw the white text over the border
	ctx.font = "bold 64px Verdana";
	ctx.fillStyle = "white";
	ctx.fillText(`PAUSE`, 115, 175);
}

function drawBall(ball) {

	// if the ball is a power ball
	if(ball.power == "powerBall") {

		// draw the appropriate icon that matches the power up

		// draw a clock
		if(global.nextPower == "Slow Time") {
			ctx.drawImage(clockImage, ball.x - ball.radius, ball.y - ball.radius)
		} else if(global.nextPower == "Arrow") {
			ctx.drawImage(arrow, ball.x - ball.radius, ball.y - ball.radius);
		} else if(global.nextPower == "Sticky Paddle") {
			ctx.drawImage(slime_ball, ball.x - ball.radius, ball.y - ball.radius);
		} else if(global.nextPower = "Cluster Bomb") {
			ctx.drawImage(missile, ball.x - ball.radius, ball.y - ball.radius);
		}

	} else {

		// if the ball is a super ball
		if(ball.power == "Arrow") {

			// draw the image so that the bullet faces the correct direction
			if(ball.dx > 0 && ball.dy < 0) {
				ctx.drawImage(arrow_NE, ball.x - ball.radius, ball.y - ball.radius);
			} else if(ball.dx > 0 && ball.dy > 0) {
				ctx.drawImage(arrow_SE, ball.x - ball.radius, ball.y - ball.radius);
			} else if(ball.dx < 0 && ball.dy > 0) {
				ctx.drawImage(arrow_SW, ball.x - ball.radius, ball.y - ball.radius);
			} else if(ball.dx < 0 && ball.dy < 0) {
				ctx.drawImage(arrow_NW, ball.x - ball.radius, ball.y - ball.radius);
			}
		} else {

			// if the ball is standard
			ctx.beginPath();
			ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
			ctx.fillStyle = ball.color;
			ctx.fill();
			ctx.closePath();
		}
	}
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
	ctx.drawImage(bombImage, bomb.x, bomb.y);
}

function drawPowerUp() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "black";
	ctx.fillText(`${global.powerUp}`, canvas.width / 2 - 40, (canvas.height / 3) * 2)
}




/* ------------------------ KEYBOARD INPUT ---------------------------- */

// controls the movement of the paddle
var rightPressed = false;
var leftPressed = false;
var click = false;
var play = false;

// controls the pause screen
var pause = false;
// delays the pause menu to make the text flash on and off
var count = 0;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);
document.addEventListener("click", clickHandler);

function keyDownHandler(event) {
	if(event.keyCode == 39) {
		rightPressed = true;
	} else if(event.keyCode == 37) {
		leftPressed = true;
	} else if(event.keyCode == 80) {
		if(pause) {
			pause = false;
		} else {
			pause = true;
			count = 0;

		}
	} else if(event.keyCode == 32) {
		play = true;
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
	if(!pause) {
		var relativeX = event.clientX - canvas.offsetLeft;
		if(relativeX > paddle.width / 2 && relativeX < canvas.width - paddle.width / 2) {
			paddle.position = relativeX - paddle.width / 2;
		}
	}
}

function clickHandler(event) {
	click = true;
}




/* ------------------- LEVEL GENERATOR ----------------------- */

function newLevel() {
	// temp will hold a brickLayout and a set of bricks
	var temp = generateLevel(global, ball, paddle);
	brickLayout = temp.brickLayout;
	bricks = temp.bricks;
	// bricks = brickLayout.getArray();
	drawBricks();
}

function gameOver() {
	alert(`GAME OVER!\n\nScore: ${global.score}`);
	clearInterval(interval);
	document.location.reload(false);
}

function increaseSpeed() {
	clearInterval(interval);
	speed -= 0.02;
	interval = setInterval(draw, speed);
}

function usePowerUp() {
	if(global.powerUp == "Slow Time") {
		clearInterval(interval);
		speed = 10;
		interval = setInterval(draw, speed);
	}
	if(global.powerUp == "Arrow") {
		ball.power = "Arrow";
	}
	if(global.powerUp == "Sticky Paddle") {
		paddle.power = "Sticky Paddle";
		paddle.color = "green";
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
	if(global.powerUp == "Ghost Ball") {
		ball.power = "Ghost Ball";
	}

	// releases the ball if it is stuck to the paddle
	if(global.holdBall){
		global.holdBall = false;
	}
}



/* -------------------- GAME LOGIC ---------------------- */

function draw() {

	// CHECK TO SEE IF THE GAME HAS BEGUN
	if(!play){

		// if the game has not begun, draw the intro screen
		drawIntro();

	} else {

		// clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		drawScore();
		drawLives();
		drawPaddle();

		// CHECK TO SEE IF THE GAME IS PAUSED
		if(pause) {

			// if the game is paused, draw the pause screen
			// conditionally draw the pause screen to make the text flash on and off

			if(count < 100) {
				drawPause();
			} else {
				if(count === 150) {
					count = 0;
				}
			}
			count++;

		} else {

			drawBall(ball);
			drawBricks();

			if(global.powerUp) {
				drawPowerUp();
			}

			// dictates the logic of the ball
			updateBall(global, ball, paddle, bricks, brickLayout);
			drawBall(ball);
			// if the ball hit the paddle, increase the speed
			if(global.ballWallCollision > 0) {
				increaseSpeed();
			}

			// dictates the logic of the bomb - assuming it exists
			if(global.bomb) {
				drawBomb(global.bomb);
				updateBomb(global, paddle);
			}

			// dictates the logic of the extra ball - assuming it exists
			if(global.extraBall) {
				drawBall(global.extraBall);
				updateExtraBall(global, paddle, bricks, brickLayout);
			}

			// dictates the logic of the power ball - assuming it exists
			if(global.powerBall) {
				drawBall(global.powerBall);
				updatePowerBall(global, paddle, bricks, brickLayout);
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
					checkBrickCollision(bricks, brickLayout, curr, global);
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
					checkBrickCollision(bricks, brickLayout, curr, global);

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

			// returns 1 if the player cleared the level
			// returns -1 if game over
			global.gameStatus = checkConditions(global, brickLayout, bricks, ball, paddle);

			if(global.gameStatus == 1) {
				newLevel();
			} else if(global.gameStatus == -1) {
				gameOver();
			}

			// reset collision detection variables
			global.ballWallCollision = 0;
			global.extraBallWallCollision = 0;
			global.bombCollision = 0;

			// set the next position of the paddle based on the keyboard input
			if(rightPressed && paddle.position < canvas.width - paddle.width) {
				paddle.position += paddle.distance;
			} else if(leftPressed && paddle.position > 0) {
				paddle.position -= paddle.distance;
			}
		}
	}
}