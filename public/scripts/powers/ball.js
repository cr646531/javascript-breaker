import checkWallCollision from '../wallCollision.js';
import checkBrickCollision from '../brickCollision.js';

import increaseSpeed from '../main.js';

export default function updateBall(global, ball, paddle, bricks, brickLayout) {

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
    global.ballBrickCollision = checkBrickCollision(bricks, brickLayout, ball, global);
}