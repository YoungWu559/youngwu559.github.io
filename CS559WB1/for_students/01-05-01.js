let timestamp = 0;

// cause things to change on click
document.getElementById("start").onclick = function() {
    // read the clock at the beginning when we run
    // and set the change
    timestamp = performance.now();
    document.getElementById("future0").innerHTML = "This was changed";
    // schedule the next function to be called in the future
    window.requestAnimationFrame(future1);
}

// change the span to say how far into the future we are
function future1() {
    document.getElementById("future1").innerHTML = 
        `Hello from ${(performance.now() - timestamp).toFixed(1)} ms in the future`;
    // schedule another function 16ms later
    window.requestAnimationFrame(future2);        
}
function future2() {
    document.getElementById("future2").innerHTML = 
        `Hello from ${(performance.now() - timestamp).toFixed(1)} ms in the future`;
        window.requestAnimationFrame(future3);        
    }
function future3() {
    document.getElementById("future3").innerHTML = 
        `Hello from ${(performance.now() - timestamp).toFixed(1)} ms in the future`;
    }