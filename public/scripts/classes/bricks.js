import randomNumberGenerator from '../rng.js';

export default class Bricks {
    constructor(columns = 5, rows = 3, color = "red", padding = 10, width = 75, height = 20, topOffset = 30, leftOffset = 30, brickContainingPowerUp = {x: 0, y: 0}) {
        this.canvasWidth = 480;
        this.canvasHeight = 320
 
        this.color = color;
        this.rows = rows;
        this.columns = columns;
        this.padding = padding;
        this.width = width;
        this.height = height;
        this.topOffset = topOffset;
        this.leftOffset = leftOffset;
        this.brickContainingPowerUp = brickContainingPowerUp;
    }

    getArray() {
        var brickArray = [];

        if(this.columns <= 5){
            var padding = (this.canvasWidth - (this.columns * 75)) / (this.columns + 1);
        } else {
            padding = 10;
            this.width = (this.canvasWidth - (padding * (this.columns + 1))) / this.columns;
        }

        for(var i = 0; i < this.columns; i++){
            brickArray[i] = [];
            for(var j = 0; j < this.rows; j++){
                brickArray[i][j] = {
                    x: i * this.width + (i+1) * padding,
                    y: j * (this.height + 10) + this.topOffset,
                    status: 1,
                    holdsPowerUp: false
                }
            }
        }

        return brickArray;
    }

    // setRandomCoordinate() {
    //     // get random coordinates to determine which brick holds the power ball
    //     if(this.columns == 0) {
    //         var xCoordinate = 0;
    //     } else {
    //         var xCoordinate = randomNumberGenerator(this.columns);
    //     }

    //     if(this.rows == 0){
    //         var yCoordinate = 0;
    //     } else {
    //         var yCoordinate = randomNumberGenerator(this.rows);
    //     }

    //     if(this.brickArray !== []) {

    //         console.log(xCoordinate);
    //         console.log(yCoordinate);
    //         console.log(this.brickArray[0][0]);
    //         console.log(this.brickArray[xCoordinate][yCoordinate]);

    //         brickArray[xCoordinate][yCoordinate].holdsPowerUp = true;

    //         var brickContainingPowerUp = {
    //             x: xCoordinate,
    //             y: yCoordinate
    //         }

    //         this.brickContainingPowerUp = brickContainingPowerUp;
    //     }
    // }

}


