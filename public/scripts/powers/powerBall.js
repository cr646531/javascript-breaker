import checkWallCollision from '../wallCollision.js';
import checkBrickCollision from '../brickCollision.js';

export default function updatePowerBall(global, paddle, bricks, brickLayout) {
    // returns the x coordinate of where the power ball touched the paddle
    // returns -1 if the power ball touched the ground
    // returns 0 otherwise
    global.powerBallWallCollision = checkWallCollision(global.powerBall, paddle);

    // returns true if a brick was hit
    // returns false otherwise
    global.powerBallBrickCollision = checkBrickCollision(bricks, brickLayout, global.powerBall, global);

    // update position of power ball
    global.powerBall.x += global.powerBall.dx;
    global.powerBall.y += global.powerBall.dy;
}