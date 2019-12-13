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

                        // eliminate the brick - unless it's the power ball
                        if(!ball.power){
                            currBrick.status = 0;
                        }

						// change vertical direction of the ball
						ball.dy = -ball.dy;

						return true;
					}	
				}
			}
		}
    }
    return false;
}