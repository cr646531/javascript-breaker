export default class Bomb {
	constructor(x = 0, y = 0, color = "black", radius = "bomb", width = 22, height = 29, dx = 1, dy = -1) {

		this.x = x;
        this.y = y;
        
		this.color = color;
		this.radius = radius;
		this.width = width;
		this.height = height;
        
		this.dx = dx;
		this.dy = dy;
	}
}