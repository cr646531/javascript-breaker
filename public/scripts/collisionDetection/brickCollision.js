import Ball from '../classes/ball.js';

import getRandomInt from '../rng.js';
import destroyBricks from './destroyBricks/destroyBricks.js';
import ballMovement from './ballMovement.js';

export default function checkBrickCollision(bricks, brickLayout, ball, global) {

	for(var i = 0; i < brickLayout.columns; i++){
		for(var j = 0; j < brickLayout.rows; j++){
			var currBrick = bricks[i][j];

			// brick is active
			if(currBrick.status == 1){

				// ball is between beginning and end of brick
				if(ball.x > currBrick.x && ball.x < currBrick.x + brickLayout.width) {

					// ball is touching the top or bottom of the brick
					if(ball.y - ball.radius >= currBrick.y && ball.y - ball.radius <= currBrick.y + brickLayout.height){

						// the power ball doesn't destroy any blocks
						// check to make sure we are not evaluating the power ball
                        if(ball.power !== "powerBall"){
							destroyBricks(global, ball, bricks, brickLayout, currBrick, i, j)	
						}

						// logic that dictates the directional movement of the ball
						ballMovement(ball);
						
						// if the ball is a scatter ball, or laser shot, it disappears when it hits a brick
						if(ball.power == "scatter") {
							ball.power = "none";
						}
					}	
				}
			}

			// release power ball if the brick containing power up is destroyed
			if(!global.releasedPowerBall){
				if(currBrick.status == 0 && currBrick.holdsPowerUp == true) {

					global.randomNumberGenerator = getRandomInt(9);
					//global.nextPower = global.powers[global.randomNumberGenerator];
					global.nextPower = global.powers[1];

					// generates the power ball
					global.powerBall = new Ball(currBrick.x + (brickLayout.width / 2), currBrick.y, 12, "yellow", 0, 0.5, "powerBall")

					// sets the global variable to indicate that the power ball has already been released
					global.releasedPowerBall = true;
				}
			}
		}
	}
}