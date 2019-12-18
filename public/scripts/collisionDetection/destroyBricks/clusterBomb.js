/*
    brickX and brickY are the coordinates of the brick that was hit
    destroy all the bricks that are adjacent to this brick
*/

export default function clusterBomb(global, bricks, brickLayout, brickX, brickY) {

    // loop from left column through right column
    for(var i = -1; i < 2; i++) {

        // loop from above row through below row
        for(var j = -1; j < 2; j++) {

            // check if the x-coordinate of the brick is in bounds
            if(brickX + i >= 0 && brickX + i < brickLayout.columns) {

                // check if the y-coordinate of the brick is in bounds
                if(brickY + j >= 0 && brickY + j < brickLayout.rows) {

                    // if the brick has not been destroyed
                    if(bricks[brickX + i][brickY + j].status == 1) {
                        
                        // destroy the brick
                        bricks[brickX + i][brickY + j].status = 0;

                        // increase the score by five
                        global.score += 5;
                    }
                }
            }
        }
    }
}

