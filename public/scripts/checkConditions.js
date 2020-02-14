import getRandomInt from './rng.js';
import Ball from './classes/Ball.js';


export default function checkConditions(global, brickLayout, bricks, ball, paddle) {

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
			global.powerUp = global.nextPower;
        }
		global.powerBall = 0;
		global.nextPower = 0;
		global.powerBallWallCollision = 0;
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

		// if the player has the scatter shot power up, generate three extra balls
		if(ball.power == "Scatter Shot"){
			var scatterBallOne = new Ball(paddle.position + global.ballWallCollision, 320 - 30, 10, "orange", -ball.dx, -2, "scatter");
			var scatterBallTwo = new Ball(paddle.position + global.ballWallCollision, 320 - 30, 10, "orange", -ball.dx / 2, -2, "scatter");
			var scatterBallThree = new Ball(paddle.position + global.ballWallCollision, 320 - 30, 10, "orange", ball.dx / 2, -2, "scatter");
			global.scatterBalls.push(scatterBallOne);
			global.scatterBalls.push(scatterBallTwo);
			global.scatterBalls.push(scatterBallThree);
		}

		// if the player has the laser shot power up, fire one extra ball
		if(ball.power == "Laser Shot") {
			var laser = new Ball(paddle.position + global.ballWallCollision, 320 - 30, 10, "black", 0, -2, "laser");
			global.lasers.push(laser);
		}

		// increase the score by one
		global.score++;
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