export default class Bomb {
	constructor(x = 0, y = 0, color = "black", radius = 10, dx = 1, dy = -1) {

		this.x = x;
        this.y = y;
        
		this.color = color;
        this.radius = 10;
        
		this.dx = dx;
		this.dy = dy;
	}
}