/**
 * @description: CS559 2023_Spring solution
 * @date: Jun.15 2023
 */

// @ts-check
export {};

// get sliders
const s1 = /** @type {HTMLInputElement} */ (document.getElementById("slider1"));
const s2 = /** @type {HTMLInputElement} */ (document.getElementById("slider2"));
const s3 = /** @type {HTMLInputElement} */ (document.getElementById("slider3"));

// Notes:
// 1. we can set arbitrary number for slider.1 and slider.2's min and max values
// 2. but we must make sure: min <= max
// 3. we can set negative numbers to max and min
// 4. s2 - s1 could also be negtive numbers
// 5. we can use float numbers to min, max ans step, but here we use integers

s1.min = '50';
s1.max = '100';  

s2.min = '-20';
s2.max = '-10';    

// 6. we need carefully set the min and max of s3, such that:
s3.min = (Number(s2.min) - Number(s1.max)).toString();
s3.max = (Number(s2.max) - Number(s1.min)).toString();

// 7. initialize slider values in valid range
s1.value = s1.min;
s2.value = s2.min;
s3.value = (Number(s2.value) - Number(s1.value)).toString();


// 8. add event handler to slider-1, updating s3 such that: s3 = s2 - s1
s1.oninput = function () {
    s3.value = (Number(s2.value) - Number(s1.value)).toString();
    displayValues();
};

// 9. add event handler to slider-2, updating s3 such that: s3 = s2 - s1
s2.oninput = function () {
    s3.value = (Number(s2.value) - Number(s1.value)).toString();
    displayValues();
};

// 10. add event handler to slider-3, do the following updates:
//     assigns s1 = s2 - s3;
//     assigns s2 = s1 + s3;
s3.oninput = function () {

    // each time s3 moves, s1's value is updated
    // if it receiveds an unvalid number (less than min or greater than max)
    // it is still bounded in its valid range
    s1.value = (Number(s2.value) - Number(s3.value)).toString();

    // if s1 is signed with a valid number, s2' value holds
    // otherwise, s2 updates it value
    s2.value = (Number(s1.value) + Number(s3.value)).toString();
    displayValues();
};
// solution ends here -------------------------------------------------------------------


// add a `reset` button to reset each slider's value to the initial value
/** @type {HTMLButtonElement} */
(document.getElementById("reset")).onclick = function () {
    s1.value = s1.min;
    s2.value = s2.min;
    s3.value = (Number(s2.value) - Number(s1.value)).toString();

    s1.disabled = false;
    s2.disabled = false;
    s3.disabled = false;

    displayValues();
};

// add some spans showing current sliders' value
const span1 = /** @type {HTMLElement}*/ (document.getElementById('span1'));
const span2 = /** @type {HTMLElement}*/ (document.getElementById('span2'));
const span3 = /** @type {HTMLElement}*/ (document.getElementById('span3'));
  
[span1, span2, span3].forEach(span => span.style.fontFamily = 'consolas');

/**
 * display values of each slider
 */
function displayValues() {
    span1.innerHTML = formattingOutPut(s1);
    span2.innerHTML = formattingOutPut(s2);
    span3.innerHTML = formattingOutPut(s3);

    const n1 = Number(s1.value);
    const n2 = Number(s2.value);
    const n3 = Number(s3.value);

    if (n3 != n2 - n1) {
        console.log("Found Error:");
        console.log(`(n2 - n1) is ${n2 - n1} != n3:${n3}`);
        s1.disabled = true;
        s2.disabled = true;
        s3.disabled = true;
    }
    else {
        console.log("Equation holds.");
    }
};
displayValues();

/**
 * 1. use padStart(), we could align ouput string
 * 2. use '\xa0', we could add multiple whitespace in html
 * 
 * @param {HTMLInputElement} s - slider
 * @return - string: shows the slider's range and current value
 */
function formattingOutPut(s) {
    return `${s.id}'s range [
        ${(s.min).padStart(4, '\xa0')}, 
        ${(s.max).padStart(4, '\xa0')}], current at 
        ${(s.value).padStart(4, '\xa0')}`;
}

