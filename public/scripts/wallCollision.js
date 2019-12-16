export default function checkWallCollision(ball, paddle) {

    var canvasWidth = 480;
    var canvasHeight = 320;

	// ball touches top edge
	if(ball.y + ball.dy < ball.radius) {
		ball.dy = -ball.dy;

		// if the ball is a laser shot, the ball disappears
		if(ball.power == "laser") {
			ball.power = "none";
		}
	}

	// ball touches left or right edge
	if(ball.x + ball.dx < ball.radius || ball.x + ball.dx > canvasWidth - ball.radius) {
		ball.dx = -ball.dx;
	}

	// ball touches the bottom frame
	if(ball.y + ball.dy > canvasHeight - ball.radius){

        // change direction of vertical movement
		ball.dy = -ball.dy;

		// ball is between left and right edges of the paddle
		if(ball.x > paddle.position && ball.x < paddle.position + paddle.width) {
			return ball.x - paddle.position
		} else {
			return -1;
		}
	}
	return 0;
}