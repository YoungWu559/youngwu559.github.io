// @ts-check
/* jshint -W069, esversion:6 */

// those two comments above tell Visual Studio Code to (1) check my code
// for type errors and (2) that I am using "modern" javascript, so it
// shouldn't flag usage of modern javascript (like const) as a warning

// the web browser knows I am using modern javascript because I say "module"
// in the script tag
const para = document.createElement("p");
para.innerHTML = "This is paragraph 1";
document.body.appendChild(para);