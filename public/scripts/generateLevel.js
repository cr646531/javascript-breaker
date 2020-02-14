import Ball from './classes/ball.js';
import Bomb from './classes/bomb.js';
import Bricks from './classes/bricks.js';
import getRandomInt from './rng.js';


export default function generateLevel(global, ball, paddle) {


	// at level 15, add a row of bricks
	if(global.level == 15) {
		global.level = 1;
		global.rowThrottle++;
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

	// remove any power up's at the end of a level
	ball.power = "none";
	paddle.power = "none";
	paddle.color = "black";

	// determines, at random, which extra entities will spawn

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
		global.bomb = new Bomb(480 / 2, 320 - 30);
    }
    
    // draw the next set of bricks
	var newBrickLayout = new Bricks(global.level, global.rowThrottle)
	var newBricks = newBrickLayout.getArray();

	// get random coordinate to determine which brick will hold the power ball
	var xCoordinate = getRandomInt(newBrickLayout.columns);
	var yCoordinate = getRandomInt(newBrickLayout.rows);

	newBricks[xCoordinate][yCoordinate].holdsPowerUp = true;

	var brickContainingPowerUp = {
		x: xCoordinate,
		y: yCoordinate
	}

	global.brickContainingPowerUp = brickContainingPowerUp;

	var temp = {
		brickLayout: newBrickLayout,
		bricks: newBricks
	}

	// if the power ball does not exist at the start of the new level, reset the global variable
    if(!global.powerBall){
        //reset global variable releasedPowerBall to prompt the next power ball to be created
        global.releasedPowerBall = false;
    }

    return temp;
	
}