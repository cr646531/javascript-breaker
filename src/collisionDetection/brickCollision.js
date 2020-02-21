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

					var powers = [
						["Sticky Paddle", "Arrow", "Laser Shot", "Scatter Shot"],
						["Missile", "Row Blaster", "Column Blaster", "Scatter Shot"],
						["Ghost Ball", "Extra Life", "Slow Time", "Revert Paddle"]
					];

					var tier;

					if(global.level <= 5){
						tier = 0;
					} else if(global.level <= 10) {
						tier = getRandomInt(1);
					} else if(global.level < 15) {
						tier = getRandomInt(2);
					} else if(global.level == 15) {
						tier = 2;
					} else {
						tier = getRandomInt(2);
						if(tier == 0) {
							tier = 2;
						}
					}

					global.randomNumberGenerator = getRandomInt(4);
					global.nextPower = powers[tier][global.randomNumberGenerator];

					console.log(global.nextPower);

					// generates the power ball
					global.powerBall = new Ball(currBrick.x + (brickLayout.width / 2), currBrick.y, 10, "yellow", 0, 0.5, "powerBall")

					// sets the global variable to indicate that the power ball has already been released
					global.releasedPowerBall = true;
				}
			}
		}
	}
}