/* 
    brickX and brickY are the coordinates of the brick that was hit
    destroy a chain of adjacent bricks, within the same row, that are touching the brick
*/

export default function rowBlaster(global, bricks, brickLayout, brickX, brickY) {

    // set the index equal to the x-coordinate of the brick that was hit
    var index = brickX;

    // destroy the brick that was hit, and all the adjacent bricks to the right
    while(index < brickLayout.columns) {

        // if the brick is active
        if(bricks[index][brickY].status == 1) {

            // destroy the brick
            bricks[index][brickY].status = 0;

            // increase the score by five
            global.score += 5;

        } else {

            // if the brick was not active, break the loop
            index = brickLayout.columns;
        }

        // move to the brick on the right
        index++;
    }

    // set the index equal to the x-coordinate of the brick to the left of the brick that was hit
    index = brickX - 1;

    // destroy all the adjacent bricks to the left
    while(index >= 0) {

        // if the brick is active
        if(bricks[index][brickY].status == 1) {

            // destroy the brick
            bricks[index][brickY].status = 0;
            
            // increase the score by five
            global.score += 5;

        } else {

            // if the brick was not active, break the loop
            index = -1;
        }

        // move to the brick on the left
        index --;
    }
}