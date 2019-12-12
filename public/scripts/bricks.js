export default class Bricks {
    constructor(rows = 3, columns = 5, color = "red", padding = 10, width = 75, height = 20, topOffset = 30, leftOffset = 30) {
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
    }

    getArray(){
        var brickArray = [];
        for (var i = 0; i < this.columns; i++){
            brickArray[i] = [];
            for(var j = 0; j < this.rows; j++){
                brickArray[i][j] = {
                    x: i * (this.width + this.padding) + this.leftOffset, 
                    y: j * (this.height + this.padding) + this.topOffset,
                    status: 1
                };
            }
        }
        return brickArray;
    }

    test() {
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
                    status: 1
                }
            }
        }

        console.log(brickArray);
        return brickArray;
    }

}


