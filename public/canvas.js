
var canvas = document.createElement('canvas');
var sign = $('#sign');
var context = canvas.getContext("2d");
var cordX =[];
var cordY =[];
var startX ;
var startY ;
var draw;
canvas.addEventListener('mousedown', function(e){
    startX = e.offsetX;
    startY = e.offsetY;
    draw = true;
});
canvas.addEventListener('mousemove', function(e){
    if(draw){
        cordX.push(e.offsetX);
        cordY.push(e.offsetY);
        print();
    }
});

canvas.addEventListener('mouseup',function(e){
    draw = false;
    cordX = [];
    cordY = [];
    startX = null;
    startY = null;
    sign.val(canvas.toDataURL());
});
function print(mousemove)
{
    context.linejoin = 'round';
    context.linewidth = 1;
    for(var i = 0; i < cordX.length; i++){
        context.beginPath();
        context.moveTo(cordX[i-1], cordY[i-1]);
        context.lineTo(cordX[i], cordY[i]);
        context.stroke();
    }
}
