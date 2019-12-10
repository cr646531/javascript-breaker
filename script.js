var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// update the canvas every 20ms
setInterval(draw, 20);

// draw the ball
function draw() {
	ctx.beginPath();
	ctx.arc(50, 50, 10, 0, Math.PI*2);
	ctx.fillStyle = "blue";
	ctx.fill();
	ctx.closePath();
}