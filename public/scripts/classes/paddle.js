export default class Paddle {
    constructor(height = 10, width = 75, color = "black", distance = 7, power = "none"){
        this.position = (480 - width) / 2;
        this.height = height;
        this.width = width;
        this.color = color;
        this.distance = distance;
        this.power = power;

    }
}