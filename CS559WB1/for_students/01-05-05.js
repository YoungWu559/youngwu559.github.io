/**
 * A function that makes an HTML element blink
 * 
 * This creates a function that does the blinking, and makes an animation loop
 * with requestAnimationFrame
 * 
 * @param {string} id - which element to find
 * @param {number} [rate=250] - blink rate in milliseconds
 * @param {Array<string>} [blinkColors=["red","yellow","green"]] - colors to cycle through
 */
function makeBlink(id, rate, blinkColors) {
    rate = rate ? rate : 250;
    blinkColors = blinkColors ? blinkColors : ["red","yellow","green"];
    let toblink = document.getElementById(id);
    let lastBlinkTime = 0;
    let lastBlinkColor = 0;
    function blinker(time) {
        if ((time-lastBlinkTime) > rate) {
            lastBlinkTime = time;
            toblink.style.backgroundColor = blinkColors[lastBlinkColor % blinkColors.length];
            lastBlinkColor++;
        }
        window.requestAnimationFrame(blinker);
    }
    window.requestAnimationFrame(blinker);
}


makeBlink("span1");
makeBlink("span2",500);
makeBlink("span3",350,["lightpink","lightyellow","lightgreen"]);
