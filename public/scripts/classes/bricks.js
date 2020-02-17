export default class Bricks {
    constructor(columns = 5, rows = 3, color = "#cc2900", padding = 10, width = 75, height = 20, topOffset = 30, offset = 30, brickContainingPowerUp = {x: 0, y: 0}) {
        this.canvasWidth = 480;
        this.canvasHeight = 320;
 
        this.color = color;
        this.rows = rows;
        this.columns = columns;
        this.padding = padding;
        this.width = width;
        this.height = height;
        this.topOffset = topOffset;
        this.offset = offset;
        this.brickContainingPowerUp = brickContainingPowerUp;
    }

    getArray() {
        var brickArray = [];

        if(this.columns <= 5){
            var padding = (this.canvasWidth - (this.columns * 75)) / (this.columns + 1);
        } else if(this.columns <= 15) {
            padding = 10;
            this.width = (this.canvasWidth - (padding * (this.columns + 1))) / this.columns;
        } else {
            
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
}


