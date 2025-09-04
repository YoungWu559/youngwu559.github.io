/**
 * @description: CS559 2023 Spring Workbook Solution
 * @date: Jan.27 2023
 */

// @ts-check
export {};

// get HTML elements
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
const context = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
const button = /** @type {HTMLButtonElement} */ (document.getElementById("button1"));

/**
 * draw the box with a triangle in it - the jump flag says if the
 * button is pressed (if it is, the triangle should move to the right)
 * 
 * The student should fix this function - without using any negative numbers!
 * 
 * @param {number} jump - 0 or 1, representing false or true
 */
function draw(jump) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // solution: we use a pair of context.save() and context.restore()
    // to wrap the code that modifies context transformations or
    // context styles
    context.save();
    {
        if (jump) {
            context.translate(20, 0);
            context.fillStyle = "blue";
        } else {
            context.fillStyle = "red";
        }
        context.beginPath();
        context.moveTo(20, 10);
        context.lineTo(10, 30);
        context.lineTo(30, 30);
        context.fill();
    }
    context.restore();
}
// draw the initial triangle
draw(0);

// now make the button work
button.onmousedown = () => draw(1);
button.onmouseup   = () => draw(0);
