import Ball from './classes/ball.js';
import getRandomInt from './rng.js';

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
								for(var x = -1; x < 2; x++) {
									for(var y = -1; y < 2; y++) {
										if(i + x >= 0 && i + x < brickLayout.columns) {
											if(j + y >= 0 && j +y < brickLayout.rows) {
												bricks[i + x][j + y].status = 0;
												global.score++;
											}
										}
									}
								}
							} 
							
							// if the ball is a row blaster, destroy all bricks in the same row that are touching the brick
							if(ball.power == "Row Blaster") {
								var x = i;
								while(x < brickLayout.columns) {
									if(bricks[x][j].status == 1){
										bricks[x][j].status = 0;
										global.score++;
									} else {
										x = brickLayout.columns;
									}
									x++;
								}
								var x = i - 1;
								while(x >= 0) {
									if(bricks[x][j].status == 1) {
										bricks[x][j].status = 0;
										global.score++;
									} else {
										x = -1;
									}
									x--;
								}

							}

							if(ball.power == "Column Blaster") {
								for(var y = 0; y < brickLayout.rows; y++) {
									bricks[i][y].status = 0;
									global.score++;
								}
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