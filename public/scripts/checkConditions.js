import getRandomInt from './rng.js';


export default function checkConditions(global, brickLayout, bricks) {

	// if the ball touched the floor then the player loses a life
	// if the player has no more lives, then the game ends
	if(global.ballWallCollision == -1) {
		if(global.lives > 0){
            global.lives--;
        } else {
            // game over
            return -1;
        }		
	} 

	// if the extra ball touched the floor, the player loses the extra ball
	if(global.extraBallWallCollision == -1){
		global.extraBall = 0;
	}

	// if the extra ball touched the paddle, the player gains a point
	if(global.extraBallWallCollision > 0){
        global.score++;
    }
    
    // if the power ball touched the floor, the player loses the power ball
    if(global.powerBallWallCollision == -1) {
        global.powerBall = 0;
    }

    // if the power ball touched the paddle, the player gains a power up
    if(global.powerBallWallCollision > 0) {
        if(global.powerBall) {
            global.randomNumberGenerator = getRandomInt(3);
            if(global.randomNumberGenerator == 0) {
                global.powerUp = "Slow Time";
            }
            if(global.randomNumberGenerator == 1) {
                global.powerUp = "Super Ball";
            }
            if(global.randomNumberGenerator == 2) {
                global.powerUp = "Sticky Paddle";
            }
        }
        global.powerBall = 0;
    }

	// if the bomb touched the paddle, the player loses a life && the bomb disappears
	if(global.bombCollision > 0) {
		if(global.lives > 0){
            global.lives--;
            global.bomb = 0;
        } else {
            // game over
            return -1;
        }	
	}
	
	// if the ball touched the paddle the player gains a point
	// if all the bricks have been destroyed, the new level begins
	if(global.ballWallCollision > 0) {
		if(global.advance){
            // go to the next level
            return 1;
		}
		global.score++;
	}

	// if the player destroyed a brick, the player gains five points
	if(global.ballBrickCollision){
		global.score += 5;
	}

	// if the player destroyed a brick with the extra ball, the player gains 10 points
	if(global.extraBallBrickCollision){
		global.score += 10;
	}

	// if there are no bricks remaining, the player is ready to advance
	// the new level will begin once the ball touches the players paddle
	var flag = 0;

	for(var i = 0; i < brickLayout.columns; i++){
		for(var j = 0; j < brickLayout.rows; j++){
			if(bricks[i][j].status === 1){
				flag = 1;
			}
		}
	}

	if(flag === 0){
		global.advance = true;
    }

}