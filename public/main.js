var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');


// update the canvas every 10ms
var speed = 10;
var interval = setInterval(draw, speed);
var gameOver = false;




/* ------------------ BALL -------------------- */

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





/* ------------------- PADDLE -------------------- */

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
	if(relativeX > paddleWidth / 2 && relativeX < canvas.width - paddleWidth / 2) {
		paddleX = relativeX - paddleWidth / 2;
	}
}

// draw the paddle
function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "purple";
	ctx.fill();
	ctx.closePath();
}






/* ------------------- BRICKS --------------------- */

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;


var bricks = [];
for (var i = 0; i < brickColumnCount; i++){
	bricks[i] = [];
	for(var j = 0; j < brickRowCount; j++){
		bricks[i][j] = {
			x: i * (brickWidth + brickPadding) + brickOffsetLeft, 
			y: j * (brickHeight + brickPadding) + brickOffsetTop,
			status: 1
		};
	}
}

function drawBricks(){
	for(var i = 0; i < brickColumnCount; i++){
		for(var j = 0; j < brickRowCount; j++){

			var currBrick = bricks[i][j];

			if(currBrick.status == 1){
				ctx.beginPath();
				ctx.rect(currBrick.x, currBrick.y, brickWidth, brickHeight);
				ctx.fillStyle = "red";
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

		/* TEST */
		// console.log('ballX: ', ballX);
		// console.log('paddleX: ', paddleX);
		// console.log('paddleWidth: ', paddleWidth);
		// console.log('speed: ', speed);

		// ball is between left and right edges of the paddle
		if(ballX > paddleX && ballX < paddleX + paddleWidth) {
			// change direction of vertical movement
			dy = -dy;

			// increase speed
			clearInterval(interval);
			speed -= 0.25;
			interval = setInterval(draw, speed)

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
				dy = -dy;
			}
		}
	}
}

function checkBrickCollision() {
	for(var i = 0; i < brickColumnCount; i++){
		for(var j = 0; j < brickRowCount; j++){
			var currBrick = bricks[i][j];

			// brick is active
			if(currBrick.status == 1){

				// ball is between beginning and end of brick
				if(ballX > currBrick.x && ballX < currBrick.x + brickWidth) {

					// ball is touching the top or bottom of the brick
					if(ballY - ballRadius >= currBrick.y && ballY - ballRadius <= currBrick.y + brickHeight){

						// eliminate the brick
						currBrick.status = 0;

						// change vertical direction of the ball
						dy = -dy;

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
	ballX += dx;
	ballY += dy;

	// set the next position of the paddle based on the keyboard input
	if(rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += moveDistance;
	} else if(leftPressed && paddleX > 0) {
		paddleX -= moveDistance;
	}

	/* Gives control of the rendering to the browser */
	// requestAnimationFrame(draw);
}

// draw();