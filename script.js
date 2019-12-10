var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// update the canvas every 20ms
setInterval(draw, 20);

var x = canvas.width / 2;
var y = canvas.height - 30;

// controls how many pixels the ball will move on every update
var dx = 2;
var dy = -2;


function draw() {
	
	// draw the ball
	ctx.beginPath();
	ctx.arc(x, y, 10, 0, Math.PI*2);
	ctx.fillStyle = "blue";
	ctx.fill();
	ctx.closePath();

	// set the next position for the ball
	x += dx;
	y += dy;
}