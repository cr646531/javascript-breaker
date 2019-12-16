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
                        if(ball.power !== "powerBall"){

							// if the ball is a cluster bomb, destroy all the surrounding bricks
							if(ball.power === "Cluster Bomb") {
								for(var x = -1; x < 2; x++) {
									for(var y = -1; y < 2; y++) {
										if(i + x >= 0 && i + x < brickLayout.columns) {
											if(j + y >= 0 && j +y < brickLayout.rows) {
												bricks[i + x][j + y].status = 0;
											}
										}
									}
								}
							} 
							
							// if the ball is a row blaster, destroy the entire row
							if(ball.power == "Row Blaster") {
								for(var x = 0; x < brickLayout.columns; x++) {
									bricks[x][j].status = 0;
								}
							}

							if(ball.power == "Column Blaster") {
								for(var y = 0; y < brickLayout.rows; y++) {
									bricks[i][y].status = 0;
								}
							}
							
							currBrick.status = 0;
						}

                        // if the player has the power ball - don't change direction
                        if(ball.power !== "Super Ball") {
						    // change vertical direction of the ball
                            ball.dy = -ball.dy;
						}
						
						// if the ball is a scatter ball, or laser shot, it disappears when it hits a brick
						if(ball.power == "scatter" || ball.power == "laser"){
							ball.power = "none";
						}

						return true;
					}	
				}
			}
		}
    }
    return false;
}
