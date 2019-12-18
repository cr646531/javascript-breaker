import checkWallCollision from '../collisionDetection/wallCollision.js';
import checkBrickCollision from '../collisionDetection/brickCollision.js';

export default function updatePowerBall(global, paddle, bricks, brickLayout) {
    // returns the x coordinate of where the extra ball touched the paddle
    // returns -1 if the extra ball touched the ground
    // returns 0 otherwise
    global.extraBallWallCollision = checkWallCollision(global.extraBall, paddle);

    checkBrickCollision(bricks, brickLayout, global.extraBall, global);

    // update position of extra ball
    global.extraBall.x += global.extraBall.dx;
    global.extraBall.y += global.extraBall.dy;
}