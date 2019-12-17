/* 
    brickX is the x-coordinate of the brick that was hit
    destroy all the bricks within the same column
*/

export default function columnBlaster(global, bricks, brickLayout, brickX) {

    // loop through all the bricks in the column
    for(var i = 0; i < brickLayout.rows; i++) {

        // destroy the block
        bricks[brickX][i].status = 0;

        // increase the score by one
        global.score++;
    }
}