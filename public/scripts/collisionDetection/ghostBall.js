export default function ghostBall(global, ball, currBrick) {
    
    // if the ball is moving in a downwards direction
    if(ball.dy == 2){

        // destroy the brick
        currBrick.status = 0;

        // increase the score by one
        global.score++;
    }
}