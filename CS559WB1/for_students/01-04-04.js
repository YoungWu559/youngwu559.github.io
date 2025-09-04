/**
 * Have the sliders change each other
 */
/** @type{HTMLInputElement} */ let slider41 = (/** @type{HTMLInputElement} */ document.getElementById("box4-slider1"));
/** @type{HTMLInputElement} */ let slider42 = (/** @type{HTMLInputElement} */ document.getElementById("box4-slider2"));
slider41.onchange = function() {
    slider42.value = slider41.value;
};
slider42.oninput = function() {
    slider41.value = slider42.value;
};