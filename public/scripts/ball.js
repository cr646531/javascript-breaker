export default class Ball {
	constructor(x = 0, y = 0, radius = 10, color = "blue", sAngle = 0, eAngle = 2 * Math.PI, dx = 2, dy = -2) {

		this.x = x;
		this.y = y;

		this.radius = radius;
		this.color = color;
		this.sAngle = sAngle;


		this.sAngle = 0;
		this.eAngle = 2 * Math.PI;

		this.dx = 2;
		this.dy = -2;
	}

	increaseSpeed() {
		this.dx += .25;
		this.dy -= .25;
	}
}