
var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');
c.strokeStyle = 'black';
var x;
var y;
var draw = false;
var canvasInput = document.getElementById('sig-field');
var drawData;

canvas.addEventListener('mousedown', function(e) {
    x = e.offsetX;
    y = e.offsetY;
    draw = true;
});

canvas.addEventListener('mousemove', function(e) {
    if (draw) {
        c.moveTo(x, y);
        x = e.offsetX;
        y = e.offsetY;
        c.lineTo(x, y);
        c.stroke();
    }
});

canvas.addEventListener('mouseup', function(e) {
    draw = false;
    drawData = canvas.toDataURL();
    canvasInput.value = drawData;
    console.log("canvas.toDataURL:",canvas.toDataURL());
});
