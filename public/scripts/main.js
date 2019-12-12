import Ball from './ball.js';
import Paddle from './paddle.js';
import Bricks from './bricks.js';
import checkWallCollision from './wallCollision.js';
import checkBrickCollision from './brickCollision.js';
import Bomb from './bomb.js';

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');


// update the canvas every 10ms
var speed = 10;
var interval = setInterval(draw, speed);





/* ----------------------- GLOBAL VARIABLES ---------------------- */
var level = 0;
var score = 0;
var lives = 3;

// level generator variables
var advance = false;
var randomNumberGenerator;

// collision detection variables
var ballWallCollision;
var ballBrickCollision;
var extraBallWallCollision;
var extraBallBrickCollision;
var bombCollision;

// entity variables
var ball = new Ball(canvas.width / 2, canvas.height - 30);
var paddle = new Paddle();
var brickLayout = new Bricks(level);
var bricks = brickLayout.getArray();

// extra entity variables
var extraBall = 0;
var bomb = 0;






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

function drawBomb(bomb) {
	ctx.font = "16px Arial";
	ctx.fillStyle = bomb.color;
	ctx.fillText('X', bomb.x, bomb.y);
	
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

/* ------------------- RANDOM NUMBER GENERATOR ------------------ */

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}



/* ------------------- NEW LEVEL ----------------------- */

function newLevel() {
	level++;
	brickLayout = new Bricks(level);
	bricks = brickLayout.getArray();
	drawBricks();
	advance = false;

	// if the player ended a level with the bomb in tact, the player gets a longer paddle
	if(bomb) {
		paddle.width += 10;
		bomb = 0;
	}

	// if the player ended a level with the extra ball in tact, the player gets 50 points
	if(extraBall) {
		score += 50;
		extraBall = 0;
	}

	// determines, at random, which extra entities will spawn
	randomNumberGenerator = getRandomInt(3);
	if(randomNumberGenerator == 2) {
		extraBall = new Ball(canvas.width / 2, canvas.height - 30, 10, "purple", 0.5, -0.5, 2)
	}
	randomNumberGenerator = getRandomInt(3);
	if(randomNumberGenerator == 2) {
		bomb = new Bomb(canvas.width / 2, canvas.height - 30);
	}


}



/* -------------------- GAME LOGIC ---------------------- */


function checkConditions() {

	// if the ball touched the floor then the player loses a life
	// if the player has no more lives, then the game ends
	if(ballWallCollision) == -1) {
		if(lives > 0) {
			lives--;
		} else {
			alert(`GAME OVER!\n\nScore: ${score}`);
			clearInterval(interval);
			document.location.reload(false);
		} 			
	} 

	// if the extra ball touched the floor, the player loses the extra ball
	if(extraBallWallCollision == -1){
		extraBall = 0;
	}

	// if the extra ball touched the paddle, the player gains a point and the speed increases
	if(extraBallWallCollision == 1){
		score++;
		// increase speed
		clearInterval(interval);
		speed -= 0.25;
		interval = setInterval(draw, speed);
		extraBallWallCollision = 0;
	}

	// if the bomb touched the paddle, the player loses a life && the bomb disappears
	// if the player has no more lives, then the game ends
	if(bombCollision == 1) {
		if(lives > 0) {
			lives--;
		} else {
			alert(`GAME OVER!\n\nScore: ${score}`);
			clearInterval(interval);
			document.location.reload(false);
		} 
		bomb = 0;
		bombCollision = 0;
	}
	
	// if the ball touched the paddle the player gains a point
	// if all the bricks have been destroyed, the new level begins
	if(ballWallCollision == 1) {
		if(advance){
			newLevel();
		}
		score++;
	}

	// if the player destroyed a brick, the player gains five points
	if(ballBrickCollision){
		score += 5;
	}

	// if the player destroyed a brick with the extra ball, the player gains 10 points
	if(extraBallBrickCollision){
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
	ballWallCollision = checkWallCollision(ball, paddle);

	
	// returns true if a brick was hit
	// returns false otherwise
	ballBrickCollision = checkBrickCollision(bricks, brickLayout, ball);

	// dictates the movement of the extra ball
	if(extraBall){
		drawBall(extraBall);
		extraBallWallCollision = checkWallCollision(extraBall, paddle);
		extraBallBrickCollision = checkBrickCollision(bricks, brickLayout, extraBall);
		extraBall.x += extraBall.dx;
		extraBall.y += extraBall.dy;
	}

	// dictates the movement of the bomb
	if(bomb) {
		drawBomb(bomb);
		bombCollision = checkWallCollision(bomb, paddle);
		bomb.x += bomb.dx;
		bomb.y += bomb.dy;
	}

	// check game conditions
	checkConditions();

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