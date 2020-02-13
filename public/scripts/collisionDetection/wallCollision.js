export default function checkWallCollision(obj, paddle) {

    var canvasWidth = 480;
	var canvasHeight = 320;

	// if the object is a bomb
	if(obj.radius == "bomb") {

		// bomb touches top edge
		if(obj.y == 0) {
			obj.dy = -obj.dy;
		}

		// bomb touches left or right edge
		if(obj.x == 0 || obj.x + obj.width == canvasWidth) {
			obj.dx = -obj.dx;
		}

		// bomb touches the bottom frame
		if(obj.y + obj.height == canvasHeight){

			// change direction of vertical movement
			obj.dy = -obj.dy;

			// bomb is between left and right edges of the paddle
			if(obj.x + obj.width / 2 > paddle.position && obj.x + obj.width / 2 < paddle.position + paddle.width) {
				return obj.x - paddle.position
			} else {
				return -1;
			}
		}

	} else {

		// obj touches top edge
		if(obj.y + obj.dy < obj.radius) {
			obj.dy = -obj.dy;

			// if the obj is a laser shot, the obj disappears
			if(obj.power == "laser") {
				obj.power = "none";
			}
		}

		// obj touches left or right edge
		if(obj.x + obj.dx < obj.radius || obj.x + obj.dx > canvasWidth - obj.radius) {
			obj.dx = -obj.dx;
		}

		// obj touches the bottom frame
		if(obj.y + obj.dy > canvasHeight - obj.radius){

			// change direction of vertical movement
			obj.dy = -obj.dy;

			// obj is between left and right edges of the paddle
			if(obj.x > paddle.position && obj.x < paddle.position + paddle.width) {
				return obj.x - paddle.position
			} else {
				return -1;
			}
		}
	}

	return 0;
}