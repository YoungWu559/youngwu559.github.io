/*
    * 
    * Here, use the 3 sliders and catch different events
    */
// note the weird comments to declare type information!
// these aren't necessary, but they can be useful for type checking
/** @type{HTMLInputElement} */ let slider31 = (/** @type{HTMLInputElement} */ document.getElementById("box3-slider1"));
/** @type{HTMLInputElement} */ let slider32 = (/** @type{HTMLInputElement} */ document.getElementById("box3-slider2"));

// for this one, we'll use a safe cast - not an unsafe one
// we'll really check the type
let slider33 = document.getElementById("box3-slider3");
if (!(slider33 instanceof HTMLInputElement))
        throw new Error("Expected Slider - but didn't get one");

if (slider31 && slider32 && slider33) { // are we in box 3?

    // respond to different events on each
    slider31.onchange = function() {
        document.getElementById("box3-li1").innerHTML = `Slider 1 - <b>onchange</b> - new value ${slider31.value}`;
    };
    slider32.oninput = function() {
        document.getElementById("box3-li2").innerHTML = `Slider 2 - <b>oninput</b> - new value ${slider32.value}`;
    };
    slider33.onclick = function() {
        document.getElementById("box3-li3").innerHTML = `Slider 3 - <b>onclick</b> - new value ${slider33.value}`;
    };
}
