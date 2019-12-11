

export default class Ball {
	radius = 10;
	color = "blue";
	sAngle = 0;
	eAngle = 2 * Math.PI;
	dx = 2;
	dy = -2;


	constructor(radius, color, sAngle, eAngle, dx, dy) {
		this.radius = radius;
		this.color = color;
		this.sAngle = sAngle;
		this.eAngle = eAngle;
		this.dx = dx;
		this.dy = dy;
	}
}