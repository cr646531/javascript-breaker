/* 
    brickX is the x-coordinate of the brick that was hit
    destroy all the bricks within the same column
*/

export default function columnBlaster(global, bricks, brickLayout, brickX) {

    // loop through all the bricks in the column
    for(var i = 0; i < brickLayout.rows; i++) {

        // if the brick has not been destroyed
        if(bricks[brickX][i].status == 1) {

            // destroy the brick
            bricks[brickX][i].status = 0;

            // increase the score by five
            global.score += 5;
        }
    }
}