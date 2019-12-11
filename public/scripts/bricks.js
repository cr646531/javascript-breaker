export default class Bricks {
    constructor(color = "red", rows = 3, columns = 5, width = 75, height = 20, padding = 10, topOffset = 30, leftOffset = 30) {
        this.color = color;
        this.rows = rows;
        this.columns = columns;
        this.width = width;
        this.height = height;
        this.padding = padding;
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
}


