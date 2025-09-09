/**
 * @description: CS559 2023 Spring Workbook Solution
 * @date: Jan.26 2023
 */

//@ts-check
export { };

///////////////////////////////////////////////////////////////////////////////////
/*
 * use styles        : done
 * use transparency  : done
 * drawing order     : done
 * complicated shapes: tree, house, background
 * 
 * credit: https://www.shopify.com/tools/logo-maker
 * this simple picture is adapted from one logo found in the above website
 */
///////////////////////////////////////////////////////////////////////////////////

// get cavans and other HTML elements
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
const context = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));

// defines global constant
const CX = canvas.width / 2;
const CY = canvas.height / 2 + 20;
const PI = Math.PI;
const P2 = PI * 2;

// colors used in this picture
const colorList = {
    bg0:    getRGBA([255, 204, 0, 0.85]),   // yellow
    pink:   getRGBA([255, 102, 102, 1]),    // pink-red
    tree:   getRGBA([41, 89, 121, 1]),      // tree
    roof:   getRGBA([59,169,202,1]),        // roof
    shadow: getRGBA([50,62,153,1]),         // shadow
    bg1:    getRGBA([240, 240, 210, 0.7]),  // background-1
    bg2:    getRGBA([250, 250, 230, 1]),    // background-2
    text:   getRGBA([180, 150, 110, 0.7]),  // text
};


// draws the picture by calling functions in the following order
{
    fillCircle(CX, CY, 100, 'pink');
    drawHouse(CX + 40, CY - 60, 30, 45, 110, 'roof', 'shadow');
    drawBackground(100, 'bg0');

    drawTree(CX -  90, CY - 75, CY + 40, 20, 'tree');  // middle tree
    drawTree(CX -  45, CY - 45, CY + 35, 15, 'tree');  // right tree
    drawTree(CX - 135, CY + 25, CY + 85, 15, 'tree');  // left tree

    drawHouse(CX + 140, CY,     -30, 45, -85, 'roof', 'shadow');
    drawHouse(CX -  40, CY + 60, 30, 45, 110, 'roof', 'shadow');

    drawBackground(150, 'bg1');
    drawBackground(200, 'bg2');
    showText('text');
}


/**
 * Draws a house
 * 
 * @param {number} x  - x pos of top roof
 * @param {number} y  - y pos of top roof
 * @param {number} dx - x offset of bottom roof
 * @param {number} dy - y offset of bottom roof
 * @param {number} w  - width of whole roof
 * @param {string} s1 - style of roof
 * @param {string} s2 - syyle of wall
 */
function drawHouse(x , y, dx, dy, w, s1, s2) {
    const roof = [
        [x, y],
        [x + dx, y + dy],
        [x + dx + w, y + dy],
        [x + w, y],
    ];
    fillPath(roof, colorList[s1]);  // roof

    const HT = 150;
    const wall = [
        [x, y],
        [x + dx, y + dy],
        [x + dx, y + dy + HT],
        [x - dx, y + dy + HT],
        [x - dx, y + dy]
    ];
    fillPath(wall, "white");  // wall

    fillRect(x + dx, y + dy, w, HT, colorList[s2]);  // side-wall
    fillRect(x - 8, y + 40, 16, 25, colorList[s1]);  // window
}


/**
 * Fill a path that build ONLY from the lineTo() function
 * 
 * @param {number[][]} path - points define a path 
 * @param {string} style - fill style
 */
function fillPath(path, style) {
    context.save();
    {
        context.beginPath();
        context.moveTo(path[0][0], path[0][1]);
        path.forEach(p => {
            context.lineTo(p[0], p[1]);
        });
        context.closePath();

        context.fillStyle = style;
        context.fill();
    }   
    context.restore();
}


/**
 * Draws a background, a shape = square - circle
 * 
 *    C ############## B
 *    ##################
 *    ######     #######
 *    ####    O    R # A
 *    ######     #######
 *    ##################
 *    D ############## E
 * 
 * @param {number} r - radius
 * @param {string} s - key in colorlist 
 */
function drawBackground(r, s) {
    context.save();
    {
        context.beginPath();
        // draw a circle, "pen head" starts from and stops at point R
        context.arc(CX, CY, r, P2, 0, false);  // R~>R
        context.lineTo(CX * 2, CY);            // R->A
        context.lineTo(CX * 2, 0);             // A->B
        context.lineTo( 0, 0);                 // B->C
        context.lineTo( 0, CY * 2);            // C->D
        context.lineTo(CX * 2, CY * 2);        // D->E
        context.lineTo(CX * 2, CY);            // E->A
        context.closePath();                   // A->R

        context.fillStyle = colorList[s];
        context.fill();
    }
    context.restore();
}


/**
 * Draws a tree, which consists of a capsule
 * and a thin rectanglar
 * 
 * @param {number} x1 - x pos of top/bottom circle
 * @param {number} y1 - y pos of top circle
 * @param {number} y2 - y pos of bottom circle
 * @param {number} r  - radius of circle
 * @param {string} s  - key in colorList
 */
function drawTree(x1, y1, y2, r, s) {
    context.save();
    {
        context.beginPath();
        context.arc(x1, y1, r, PI, 0, false);
        context.lineTo(x1 + r, y2);
        context.arc(x1, y2, r, 0, PI, false);
        context.closePath();

        context.fillStyle = colorList[s];
        context.fill();

        // trunk
        context.fillRect(x1 - 3, y2 + r, 6, 150);
    }
    context.restore();
}


/**
 * Helper function that fills a circle
 * 
 * @param {number} x - x pos
 * @param {number} y - y pos
 * @param {number} r - radius
 * @param {string} s - key in colorList 
 */
function fillCircle(x, y, r, s) {
    context.save();
    {
        context.beginPath();
        context.arc(x, y, r, 0, P2, false);
        context.closePath();

        context.fillStyle = colorList[s];
        context.fill();
    }
    context.restore();
}


/**
 * Helper function that fills rectanglar
 * 
 * @param {number} x - x pos of init
 * @param {number} y - y pos of init
 * @param {number} w - width
 * @param {number} h - height
 * @param {string} style
 */
function fillRect(x, y, w, h, style) {
    context.save();
    {
        context.fillStyle = style;
        context.fillRect(x, y, w, h);
    }
    context.restore();
}


/**
 * Display some texts
 * 
 * @param {string} s - key in colorList
 */
function showText(s) {
    context.save();
    {
        context.fillStyle = colorList[s]; 
        context.font = '22px sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('CS559 EXAMPLE SOLUTION', canvas.width / 2, 40);
    }
    context.restore();
}


/**
 * 
 * @param {number[]} c - color  
 * @returns {string} rgba formmat
 */
function getRGBA(c) {
    return `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`;
}
