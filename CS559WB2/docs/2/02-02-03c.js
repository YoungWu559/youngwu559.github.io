/**
 * page 02-02-03c.js - a simple JavaScript file that gets loaded with
 * page 2 of Workbook 2 (CS559)
 * 
 * written by Michael Gleicher, January 2019
 * modified by Florian Heimerl, August 2019
 * modified by Wiley Corning and Gleicher, January 2021
 */

// make vscode happy - see other files for details
// @ts-check
/* jshint -W069, -W141, esversion:6 */
export {};

/**
 * Example 3 (Drawing Order and Transparency)
 * Part C
 */
// alpha blending example
/** @type {HTMLCanvasElement} */
let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("box3canvas3"));
let context = canvas.getContext('2d');

// make some things to cover over
context.lineWidth = 3;
context.strokeStyle = "black";
context.fillStyle = "darkgray";
context.fillRect(20,40,220,20);
context.strokeRect(20,40,220,20);

context.strokeStyle = "darkred";
context.fillStyle = "lightpink";
context.fillRect(20,80,220,20);
context.strokeRect(20,80,220,20);

context.strokeStyle = "darkblue";
context.fillStyle = "lightblue";
context.fillRect(20,120,220,20);
context.strokeRect(20,120,220,20);

context.strokeStyle = "darkgreen";
context.fillStyle = "lightgreen";
context.fillRect(20,160,220,20);
context.strokeRect(20,160,220,20);

// make a series of red squares - increasing transparency
context.lineWidth = 5;
for(let x=0; x<4; x++) {
    context.strokeStyle = `rgba(80,0,0,     ${(x+1)/4.0})`;
    context.fillStyle =   `rgba(255,170,170,${(x+1)/4.0}`;
    context.fillRect(40+x*50,30,30,180);
    context.strokeRect(40+x*50,30,30,180);
}
