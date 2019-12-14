import Ball from './classes/ball.js';
import Bomb from './classes/bomb.js';
import Bricks from './classes/bricks.js';
import getRandomInt from './rng.js';

// function getRandomInt(max) {
// 	return Math.floor(Math.random() * Math.floor(max));
// }

export default function generateLevel(global, ball, paddle, brickLayout, bricks, drawBricks) {

	// at level 10 and level 30, remove one row of bricks
	if(global.level == 10) {
		global.rowThrottle--;
	} else if(global.level == 30) {
		global.rowThrottle--;
	}

	// increase the level
	global.level++;
	global.advance = false;

	// if the player ended a level with the bomb in tact, the player gets a longer paddle, and the bomb disappears
	if(global.bomb) {
		paddle.width += 10;
		global.bomb = 0;
	}

	// if the player ended a level with the extra ball in tact, the player gets 50 points
	if(global.extraBall) {
		global.score += 50;
		global.extraBall = 0;
	}

	// if the player ended a level with the super ball - remove the power up
	if(ball.power == "Super Ball") {
		ball.power = "none";
	}

	// if the player ended a level with the sticky paddle - remove the power up
	if(paddle.power == "Sticky Paddle") {
		paddle.power = "none";
	}

	// determines, at random, which extra entities will spawn

	// generates the power ball
	global.randomNumberGenerator = getRandomInt(2);
	if(global.randomNumberGenerator == 1){
		global.powerBall = new Ball(480 / 2, 320 - 30, 10, "yellow", 0.5, -0.5, "powerBall")
	}

	// ensures the player will not receive an extra ball and a power ball at the same time
	if(!global.powerBall){
		global.randomNumberGenerator = getRandomInt(3);
		if(global.randomNumberGenerator == 2) {
			global.extraBall = new Ball(480 / 2, 320 - 30, 10, "purple", 0.5, -0.5)
		}
	}

	// generates a bomb
	global.randomNumberGenerator = getRandomInt(3);
	if(global.randomNumberGenerator == 2) {
		global.bomb = new Bomb(canvas.width / 2, canvas.height - 30);
    }
    

    // draw the next set of bricks
    var output = new Bricks(global.level, global.rowThrottle)
    return output;
	
}