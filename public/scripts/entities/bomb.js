import checkWallCollision from '../collisionDetection/wallCollision.js';

export default function updateBomb(global, paddle) {

    // returns the x coordinate of where the bomb touched the paddle
    // returns -1 if the bomb touched the ground
    // returns 0 otherwise
    global.bombCollision = checkWallCollision(global.bomb, paddle);

    // update position of the bomb
    global.bomb.x += global.bomb.dx;
    global.bomb.y += global.bomb.dy;
}