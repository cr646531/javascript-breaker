import checkWallCollision from '../wallCollision.js';
import checkBrickCollision from '../brickCollision.js';

export default function updatePowerBall(global, paddle, bricks, brickLayout) {
    // returns the x coordinate of where the extra ball touched the paddle
    // returns -1 if the extra ball touched the ground
    // returns 0 otherwise
    global.extraBallWallCollision = checkWallCollision(global.extraBall, paddle);

    // returns true if a brick was hit
    // returns false otherwise
    global.extraBallBrickCollision = checkBrickCollision(bricks, brickLayout, global.extraBall, global);

    // update position of extra ball
    global.extraBall.x += global.extraBall.dx;
    global.extraBall.y += global.extraBall.dy;
}