/**
 * @description: CS559 2023 Spring Workbook Solution
 * @date: Jan.17 2023
 */

//@ts-check
export { };

// get canvas and context
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
const context = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));

/**
 * Some general notes:
 * 1. For each shape, we put code into a block { } that is between 
 *    context.save() and context.restore(). In doing so, we do an
 *    insolation, which means that drawing one shape will not affect
 *    drawing another shape. Meanwhile, we could declare variables
 *    (vis `let` and `const`) with the same name, since they are in
 *    different block scope.
 * 
 * 2. We have not learned translation and other form of transformation
 *    (we will learn this soon, and transformation is a VERY important
 *    topic in computer graphics), to easily adjust the position of  a
 *    whole shape, we could use a reference point to help.
 * 
 * 3. Rather than hard code each point (for this exercise, we can hard
 *    code each point), I use some variables to refer the key geometric
 *    parameters of each shape, such as radius, height, width, etc.
 * 
 * 4. Since we repeatly use fill and stroke statement, we could write a
 *    function `fillAndStroke()` to handle them.
 */


// 1. Draw circle: blue
context.save();
{
    // reference point: 
    // We draw the center of the circle at (x = 95, y = 55)
    // on canvas coordinate system
    const p = { x: 95, y: 55 };
    const r = 35;                 // radius

    // build path
    context.beginPath();
    context.arc(p.x, p.y, r, 0, Math.PI * 2, true);
    context.closePath();

    fillAndStroke('#4285F4', '#2F35E4', 6);
}
context.restore();


// 2. Draw triangle: red
//
//             A
//           *   *
//         *       *
//       *           *
//     B * * * * * * * C
//
context.save();
{
    const p = { x: 95, y: 120 };   // reference point: A
    const ht = 60;                 // height
    const wd = 36;                 // 1/2 of dx between B and C
    
    // build path
    context.beginPath();
    context.moveTo(p.x,      p.y     );  // A
    context.lineTo(p.x - wd, p.y + ht);  // B
    context.lineTo(p.x + wd, p.y + ht);  // C
    context.closePath();

    fillAndStroke('#DB4437', '#BD2C22', 6);
}
context.restore();


// Note -----------------------------------------------------------------------
// The origin of canvas system is at TOP-LEFT corner, which means that
// the positive 90 degree points to the bottom and the -90 degree points
// to the top.
// ----------------------------------------------------------------------------
// 3. Draw capsule: yellow              // Angles in canvas coordinate system
//                                      //
//          B ---(lineTo)---> C         //                -90 deg
//        /                     \       //                  |
//    (arc) #                   (arc)   //    180 deg <---- O ----> 0 deg
//        \                     /       //                  |
//          A <---(close)---- D         //                 90 deg
//                                      //
//--------------------------------------//-------------------------------------
context.save();
{
    const p = { x: 220, y: 55 }; // reference point #, the center of left circle
    const r = 35;                // radius of circle
    const w = 75;                // distance between two circle's center
    const d90 = Math.PI * 0.5;   // 90 degree
    
    context.beginPath();
    context.arc(p.x,     p.y, r, d90, -d90, false);  // A->B (arc)
    context.lineTo(p.x + w, p.y - r);                // B->C (lineTo)
    context.arc(p.x + w, p.y, r, -d90, d90, false);  // C->D (arc)
    context.closePath();                             // D->A (close)

    fillAndStroke('#F4B400', '#AC7C1B', 6);
}
context.restore();


// 4. Draw sawtooth: green
//
//       E       C
//     *   *   *   *
//   F       D       B
//   *               *
//   G ---(close)--> A
//
context.save();
{
    const p = { x: 257.5, y: 145 };  // position of point D
    const a = 36;                    // dx between B and C
    const b = 72;                    // dx between B and D
    const h = 35;                    // dy between B and A

    // build path
    context.beginPath();
    context.moveTo(p.x + b, p.y + h);  // A
    context.lineTo(p.x + b, p.y    );  // B
    context.lineTo(p.x + a, p.y - h);  // C
    context.lineTo(p.x    , p.y    );  // D
    context.lineTo(p.x - a, p.y - h);  // E
    context.lineTo(p.x - b, p.y    );  // F
    context.lineTo(p.x - b, p.y + h);  // G
    context.closePath();    // links G to A

    fillAndStroke('#0F9D58', '#0D6E41', 6);
}
context.restore();


/**
 * This function fills and strokes the current path.
 * 
 * @param {string} s1 - fill style
 * @param {string} s2 - stroke style
 * @param {number} lw - line width
 */
function fillAndStroke(s1, s2, lw) {
    // fill the path
    context.fillStyle = s1;
    context.fill();

    // stroke the path
    context.lineWidth = lw;
    context.strokeStyle = s2;
    context.stroke();
}
