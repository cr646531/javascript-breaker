import Ball from '../classes/ball.js';

import clusterBomb from './clusterBomb.js';
import rowBlaster from './rowBlaster.js';
import columnBlaster from './columnBlaster.js';
import ghostBall from './ghostBall.js';

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

							// logic that dictates the destruction of bricks based on what kind of ball hit the brick
							if(ball.power === "Cluster Bomb") {

								// if the ball is a cluster bomb, destroy all the surrounding bricks
								clusterBomb(global, bricks, brickLayout, i, j);

							} else if(ball.power == "Row Blaster") {

								// if the ball is a row blaster, destroy all bricks in the same row that are touching the brick
								rowBlaster(global, bricks, brickLayout, i, j)

							} else if(ball.power == "Column Blaster") {

								// if the ball is a column blaster, destroy all the bricks in the same column
								columnBlaster(global, bricks, brickLayout, i);

							} else if(ball.power == "Ghost Ball") {

								// if the ball is a ghost ball - only destroy the brick if the ball is moving downwards
								ghostBall(global, ball, currBrick)

							} else {

								// if the ball is standard, destroy the brick
								currBrick.status = 0;

								// if the ball was destroyed with the extra ball, gain 10 points
								// otherwise gain 5 points
								if(ball == global.extraBall) {
									global.score += 10;
								} else {
									global.score += 5;
								}
							}
						}

						// logic that dictates the destruction of bricks based on what kind of ball hit the brick

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

					// generates the power ball
					global.powerBall = new Ball(currBrick.x + (brickLayout.width / 2), currBrick.y, 10, "yellow", 0, 0.5, "powerBall")

					// sets the global variable to indicate that the power ball has already been released
					global.releasedPowerBall = true;
				}
			}
		}
	}
}