import Ball from '../classes/ball.js';

import clusterBomb from './clusterBomb.js';
import rowBlaster from './rowBlaster.js';
import columnBlaster from './columnBlaster.js';

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

							// if the ball is a cluster bomb, destroy all the surrounding bricks
							if(ball.power === "Cluster Bomb") {
								clusterBomb(global, bricks, brickLayout, i, j);
							} 
							
							// if the ball is a row blaster, destroy all bricks in the same row that are touching the brick
							if(ball.power == "Row Blaster") {
								rowBlaster(global, bricks, brickLayout, i, j)

							}

							// if the ball is a column blaster, destroy all the bricks in the same column
							if(ball.power == "Column Blaster") {
								columnBlaster(global, bricks, brickLayout, i);
							}

							// if the ball is a ghost ball - only destroy the brick if the ball is moving downwards
							if(ball.power == "Ghost Ball") {
								if(ball.dy == 2){
									currBrick.status = 0;
									global.score++;
								}
							} else {
								currBrick.status = 0;
								global.score++;
							}
						}

                        // if the ball is a super ball, laser shot, or power ball - don't change direction
						if(ball.power !== "Super Ball" && ball.power !== "laser" && ball.power !== "powerBall") {
						    // change vertical direction of the ball
                            ball.dy = -ball.dy;
						}

						// if the ball is a ghost ball - only change direction if the ball hits the top of a brick
						if(ball.power == "Ghost Ball") {
							if(ball.dy == 2){
								ball.dy = -ball.dy;
							}
						}
						
						// if the ball is a scatter ball, or laser shot, it disappears when it hits a brick
						if(ball.power == "scatter") {
							ball.power = "none";
						}

						return true;
					}	
				}
			}

			// release power ball if the brick containing power up is destroyed
			if(!global.releasedPowerBall){
				if(currBrick.status == 0 && currBrick.holdsPowerUp == true) {
					console.log('release');

					// generates the power ball
					global.powerBall = new Ball(currBrick.x + (brickLayout.width / 2), currBrick.y, 10, "yellow", 0, 0.5, "powerBall")

					// sets the global variable to indicate that the power ball has already been released
					global.releasedPowerBall = true;
				}
			}
		}
	}
	
    return false;
}