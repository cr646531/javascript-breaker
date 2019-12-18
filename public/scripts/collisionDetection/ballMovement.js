export default function ballMovement(ball) {
    /* 
        The super ball, laser shot, and power ball don't bounce off bricks.
        The ghost ball only bounces off the top of bricks.
        Everything else bounces of the bricks normally
    */

    // the ball is not the super ball, laser shot, power ball, and ghost bomb - change vertical direction
    if(ball.power !== "Super Ball" && ball.power !== "laser" && ball.power !== "powerBall" && ball.power !== "Ghost Ball") {
        ball.dy = -ball.dy;
    // if the ball is a ghost ball, only change vertical direction if the ball is moving downwards
    } else if(ball.power == "Ghost Ball") {
        if(ball.dy == 2) {
            ball.dy = -ball.dy;
        }
    }
}