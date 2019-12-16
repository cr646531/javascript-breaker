export default function checkBrickCollision(bricks, brickLayout, ball) {

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
                        if(ball.power !== 'powerBall'){

							// if the ball is a cluster bomb, destroy all the surrounding bricks
							// otherwise, destroy the brick
							if(ball.power === 'Cluster Bomb') {

								console.log('cluster bomb');

								for(var x = -1; x < 2; x++) {
									for(var y = -1; y < 2; y++) {
										if(i + x >= 0 && i + x < brickLayout.columns) {
											if(j + y >= 0 && j +y < brickLayout.rows) {
												bricks[i + x][j + y].status = 0;
											}
										}
									}
								}

							} else {
								currBrick.status = 0;
							}
						}
						



                        // if the player has the power ball - don't change direction
                        if(ball.power !== "Super Ball") {
						    // change vertical direction of the ball
                            ball.dy = -ball.dy;
                        }

						return true;
					}	
				}
			}
		}
    }
    return false;
}
