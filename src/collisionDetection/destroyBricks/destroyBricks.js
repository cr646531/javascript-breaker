import missile from './missile.js';
import rowBlaster from './rowBlaster.js';
import columnBlaster from './columnBlaster.js';
import ghostBall from './ghostBall.js';

export default function destroyBricks(global, ball, bricks, brickLayout, currBrick, brickX, brickY) {

    
    if(ball.power === "Missile") {

        // if the ball is a cluster bomb, destroy all the surrounding bricks
        missile(global, bricks, brickLayout, brickX, brickY);

    } else if(ball.power == "Row Blaster") {

        // if the ball is a row blaster, destroy all bricks in the same row that are touching the brick
        rowBlaster(global, bricks, brickLayout, brickX, brickY)

    } else if(ball.power == "Column Blaster") {

        // if the ball is a column blaster, destroy all the bricks in the same column
        columnBlaster(global, bricks, brickLayout, brickX);

    } else if(ball.power == "Ghost Ball") {

        // if the ball is a ghost ball - only destroy the brick if the ball is moving downwards
        ghostBall(global, ball, currBrick)

    } else {

        // if the ball is standard, destroy the brick
        currBrick.status = 0;

        // if the ball was destroyed with the extra ball, gain 10 points
        // otherwise gain 5 points
        if(ball == global.extraBall) {
            global.score += 10;
        } else {
            global.score += 5;
        }
    }
}