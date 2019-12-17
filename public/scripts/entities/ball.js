import checkWallCollision from '../wallCollision.js';
import checkBrickCollision from '../collisionDetection/brickCollision.js';

export default function updateBall(global, ball, paddle, bricks, brickLayout) {

    // returns the x coordinate of where the ball touched the paddle
	// returns -1 if the ball hit the ground
	// returns 0 otherwise
	global.ballWallCollision = checkWallCollision(ball, paddle);

	// returns true if a brick was hit
	// returns false otherwise
    global.ballBrickCollision = checkBrickCollision(bricks, brickLayout, ball, global);

    // set the next position of the ball

	// if the player has the sticky paddle power up, set the position of the ball to be fixed to the paddle
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
}