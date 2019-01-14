
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
// var canvas = document.createElement('canvas');
// var sign = $('#sign');
// var context = canvas.getContext("2d");
// var cordX =[ ];
// var cordY =[ ];
// //var startX ;
// //var startY ;
// var draw;
// canvas.addEventListener('mousedown', function(e){
//     var startX = e.offsetX;
//     var startY = e.offsetY;
//     draw = true;
//     console.log(startX);
//     console.log(startY);
// });
// canvas.addEventListener('mousemove', function(e){
//     if(draw){
//         cordX.push(e.offsetX);
//         cordY.push(e.offsetY);
//         print();
//     }
// });
//
// canvas.addEventListener('mouseup',function(){
//     draw = false;
//     cordX = [];
//     cordY = [];
//     var startX = null;
//     var startY = null;
//     sign.val(canvas.toDataURL());
//     console.log(startX);
//     console.log(startY);
// });
// function print()//mousemove
// {
//     context.linejoin = 'round';
//     context.linewidth = 1;
//     for(var i = 0; i < cordX.length; i++){
//         context.beginPath();
//         context.moveTo(cordX[i-1], cordY[i-1]);
//         context.lineTo(cordX[i], cordY[i]);
//         context.stroke();
//     }
// }
