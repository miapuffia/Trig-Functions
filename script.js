// get canvas related references
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var BB = canvas.getBoundingClientRect();
var offsetX = BB.left;
var offsetY = BB.top;
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

var angle0Button = document.getElementById("angle0");
var angle30Button = document.getElementById("angle30");
var angle45Button = document.getElementById("angle45");
var angle60Button = document.getElementById("angle60");
var anglePlus90Button = document.getElementById("anglePlus90");
var anglePlus180Button = document.getElementById("anglePlus180");
var anglePlus270Button = document.getElementById("anglePlus270");

var thetaInput = document.getElementById("thetaInput");
var sinInput = document.getElementById("sinInput");
var cosInput = document.getElementById("cosInput");
var tanInput = document.getElementById("tanInput");
var cscInput = document.getElementById("cscInput");
var secInput = document.getElementById("secInput");
var cotInput = document.getElementById("cotInput");
var tanLineInput = document.getElementById("tanLineInput");

var sizeSlider = document.getElementById("sizeSlider");

var radiusSlider = document.getElementById("radiusSlider");

var showLabels = document.getElementById("showLabels");
var fontSlider = document.getElementById("fontSlider");

var enableCheckboxes = document.getElementsByClassName("enable");

var enableCircle = document.getElementById("enableCircle");
var enableRadius = document.getElementById("enableRadius");
var enableSin = document.getElementById("enableSin");
var enableCos = document.getElementById("enableCos");
var enableTan = document.getElementById("enableTan");
var enableCsc = document.getElementById("enableCsc");
var enableSec = document.getElementById("enableSec");
var enableCot = document.getElementById("enableCot");

var circleRadius = HEIGHT / radiusSlider.value;
var circleUnitRadius = circleRadius / (HEIGHT / 6);

var theta = 45;

angle0Button.onclick = function() {
	theta = 0;
	
	draw();
}

angle30Button.onclick = function() {
	theta = 30;
	
	draw();
}

angle45Button.onclick = function() {
	theta = 45;
	
	draw();
}

angle60Button.onclick = function() {
	theta = 60;
	
	draw();
}

anglePlus90Button.onclick = function() {
	theta += 90;
	
	draw();
}

anglePlus180Button.onclick = function() {
	theta += 180;
	
	draw();
}

anglePlus270Button.onclick = function() {
	theta += 270;
	
	draw();
}

sizeSlider.oninput = function() {
	canvas.setAttribute("width", sizeSlider.value);
	canvas.setAttribute("height", sizeSlider.value);
	
	WIDTH = canvas.width;
	HEIGHT = canvas.height;
	
	circleRadius = HEIGHT / radiusSlider.value;
	
	draw();
}

radiusSlider.oninput = function() {
	circleRadius = HEIGHT / radiusSlider.value;
	
	draw();
}

showLabels.oninput = function() {
	draw();
}

fontSlider.oninput = function() {
	draw();
}

for(var i = 0; i < enableCheckboxes.length; i++) {
	enableCheckboxes[i].oninput = function() {
		draw();
	}
}

// drag related variables
var dragok = false;
var startX;
var startY;

// an array of objects that define different shapes
var shapes = [];
// define 2 rectangles
//shapes.push({x:10,y:100,width:30,height:30,fill:"#444444",isDragging:false});
//shapes.push({x:80,y:100,width:30,height:30,fill:"#ff550d",isDragging:false});

//Y-axis
shapes.push({
	y1: 0,
	stroke: "black",
	width: 2,
	draggable: false,
	draw: function() {
		drawLine(this);
	},
	recalculate: function() {
		this.x1 = WIDTH / 2;
		this.x2 = WIDTH / 2;
		this.y2 = HEIGHT;
	}
});

var ticHalfLength = Math.sqrt(WIDTH * HEIGHT) / 50;

//Y-axis tic marks
for(let i of [1, 2, 4, 5]) {
	//Y-axis
	shapes.push({
		stroke: "black",
		width: 2,
		draggable: false,
		draw: function() {
			drawLine(this);
		},
		recalculate: function() {
			this.x1 = (WIDTH / 2) - (WIDTH / 50);
			this.y1 = (HEIGHT / 6) * i;
			this.x2 = (WIDTH / 2) + (WIDTH / 50);
			this.y2 = (HEIGHT / 6) * i;
		}
	});
}

//X-axis
shapes.push({
	x1: 0,
	stroke: "black",
	width: 2,
	draggable: false,
	draw: function() {
		drawLine(this);
	},
	recalculate: function() {
		this.y1 = HEIGHT / 2;
		this.x2 = WIDTH;
		this.y2 = HEIGHT / 2;
	}
});

//X-axis tic marks
for(let i of [1, 2, 4, 5]) {
	//Y-axis
	shapes.push({
		stroke: "black",
		width: 2,
		draggable: false,
		draw: function() {
			drawLine(this);
		},
		recalculate: function() {
			this.x1 = (WIDTH / 6) * i;
			this.y1 = (HEIGHT / 2) - (WIDTH / 50);
			this.x2 = (WIDTH / 6) * i;
			this.y2 = (HEIGHT / 2) + (WIDTH / 50);
		}
	});
}

//Center circle
shapes.push({
	sAngle: 0,
	eAngle: 2 * Math.PI,
	counterclockwise: false,
	stroke: "black",
	width: 2,
	draggable: false,
	draw: function() {
		drawArc(this);
	},
	recalculate: function() {
		this.visible = getEnabled(enableCircle);
		
		this.x = WIDTH / 2;
		this.y = HEIGHT / 2;
		this.r = circleRadius;
	}
});

//Hypotenuse
shapes.push({
	stroke: "black",
	width: 2,
	draggable: false,
	draw: function() {
		drawLine(this);
	},
	recalculate: function() {
		this.visible = getEnabled(enableRadius);
		
		this.x1 = WIDTH / 2;
		this.y1 = HEIGHT / 2;
		this.x2 = (WIDTH / 2) + (circleRadius * Math.cos(toRadians(theta)));
		this.y2 = (HEIGHT / 2) - (circleRadius * Math.sin(toRadians(theta)));
	}
});

//Sin-length line
shapes.push({
	width: 2,
	draggable: false,
	draw: function() {
		drawLine(this);
	},
	recalculate: function() {
		this.stroke = getSegmentColor(sinInput);
		
		this.visible = getEnabled(enableSin);
		
		this.x1 = (WIDTH / 2) + (circleRadius * Math.cos(toRadians(theta)));
		this.y1 = (HEIGHT / 2) - (circleRadius * Math.sin(toRadians(theta)));
		this.y2 = HEIGHT / 2;
		this.x2 = (WIDTH / 2) + (circleRadius * Math.cos(toRadians(theta)));
	}
});

//Cos-length line
shapes.push({
	width: 2,
	draggable: false,
	draw: function() {
		drawLine(this);
	},
	recalculate: function() {
		this.stroke = getSegmentColor(cosInput);
		
		this.visible = getEnabled(enableCos);
		
		this.x1 = (WIDTH / 2) + (circleRadius * Math.cos(toRadians(theta)));
		this.y1 = (HEIGHT / 2) - (circleRadius * Math.sin(toRadians(theta)));
		this.x2 = WIDTH / 2;
		this.y2 = (HEIGHT / 2) - (circleRadius * Math.sin(toRadians(theta)));
	}
});

//Tan-length tangent line
shapes.push({
	width: 2,
	draggable: false,
	draw: function() {
		drawLine(this);
	},
	recalculate: function() {
		this.stroke = getSegmentColor(tanInput);
		
		this.visible = getEnabled(enableTan);
		
		this.x1 = (WIDTH / 2) + (circleRadius * sec(toRadians(theta)));
		this.y1 = HEIGHT / 2;
		this.x2 = (HEIGHT / 2) + (circleRadius * Math.cos(toRadians(theta)));
		this.y2 = (HEIGHT / 2) - (circleRadius * Math.sin(toRadians(theta)));
	}
});

//Csc-length line
shapes.push({
	width: 2,
	draggable: false,
	draw: function() {
		drawLine(this);
	},
	recalculate: function() {
		this.stroke = getSegmentColor(cscInput);
		
		this.visible = getEnabled(enableCsc);
		
		this.x1 = WIDTH / 2;
		this.y1 = HEIGHT / 2;
		this.x2 = WIDTH / 2;
		this.y2 = (WIDTH / 2) - (circleRadius * csc(toRadians(theta)));
	}
});

//Sec-length line
shapes.push({
	width: 2,
	draggable: false,
	draw: function() {
		drawLine(this);
	},
	recalculate: function() {
		this.stroke = getSegmentColor(secInput);
		
		this.visible = getEnabled(enableSec);
		
		this.x1 = WIDTH / 2;
		this.y1 = HEIGHT / 2;
		this.x2 = (WIDTH / 2) + (circleRadius * sec(toRadians(theta)));
		this.y2 = HEIGHT / 2;
	}
});

//Cot-length tangent line
shapes.push({
	width: 2,
	draggable: false,
	draw: function() {
		drawLine(this);
	},
	recalculate: function() {
		this.stroke = getSegmentColor(cotInput);
		
		this.visible = getEnabled(enableCot);
		
		this.x1 = WIDTH / 2;
		this.y1 = (WIDTH / 2) - (circleRadius * csc(toRadians(theta)));
		this.x2 = (WIDTH / 2) + (circleRadius * Math.cos(toRadians(theta)));
		this.y2 = (HEIGHT / 2) - (circleRadius * Math.sin(toRadians(theta)));
	}
});

//Sin label
shapes.push({
	fontFamily: "Arial",
	text: "sin(\u{03B8})",
	fill: true,
	textAlign: "center",
	verticalAlign: "middle",
	rotateAngle: 90,
	draggable: false,
	draw: function() {
		drawText(this);
	},
	recalculate: function() {
		this.fontSize = circleUnitRadius * fontSlider.value;
		
		this.color = getSegmentColor(sinInput);
		
		this.visible = getEnabled(enableSin) && showLabels.checked;
		
		this.x = (WIDTH / 2) + (circleRadius * Math.cos(toRadians(theta)));
		this.y = (HEIGHT / 2) - ((circleRadius * Math.sin(toRadians(theta))) / 2);
	}
});

//Cos label
shapes.push({
	fontFamily: "Arial",
	text: "cos(\u{03B8})",
	fill: true,
	textAlign: "center",
	verticalAlign: "middle",
	draggable: false,
	draw: function() {
		drawText(this);
	},
	recalculate: function() {
		this.fontSize = circleUnitRadius * fontSlider.value;
		
		this.color = getSegmentColor(sinInput);
		
		this.visible = getEnabled(enableCos) && showLabels.checked;
		
		this.x = (WIDTH / 2) + ((circleRadius * Math.cos(toRadians(theta))) / 2);
		this.y = (HEIGHT / 2) - (circleRadius * Math.sin(toRadians(theta)));
	}
});

//Tan label
shapes.push({
	fontFamily: "Arial",
	text: "tan(\u{03B8})",
	fill: true,
	textAlign: "center",
	verticalAlign: "middle",
	draggable: false,
	draw: function() {
		drawText(this);
	},
	recalculate: function() {
		this.fontSize = circleUnitRadius * fontSlider.value;
		
		this.color = getSegmentColor(sinInput);
		
		this.rotateAngle = 90 - theta;
		
		if(theta < 0) {
			this.rotateAngle += 180;
		}
		
		this.visible = getEnabled(enableTan) && showLabels.checked;
		
		this.x = (WIDTH / 2) + (circleRadius * Math.cos(toRadians(theta))) + (((circleRadius * sec(toRadians(theta))) - (circleRadius * Math.cos(toRadians(theta)))) / 2)
		this.y = (HEIGHT / 2) - (circleRadius * Math.sin(toRadians(theta))) + ((circleRadius * Math.sin(toRadians(theta))) / 2)
	}
});

//Csc label
shapes.push({
	fontFamily: "Arial",
	text: "csc(\u{03B8})",
	fill: true,
	textAlign: "center",
	verticalAlign: "middle",
	rotateAngle: 90,
	draggable: false,
	draw: function() {
		drawText(this);
	},
	recalculate: function() {
		this.fontSize = circleUnitRadius * fontSlider.value;
		
		this.color = getSegmentColor(sinInput);
		
		if(theta < 0) {
			this.rotateAngle += 180;
		}
		
		this.visible = getEnabled(enableCsc) && showLabels.checked;
		
		this.x = WIDTH / 2;
		this.y = (HEIGHT / 2) - ((circleRadius * csc(toRadians(theta))) / 2);
	}
});

//Sec label
shapes.push({
	fontFamily: "Arial",
	text: "sec(\u{03B8})",
	fill: true,
	textAlign: "center",
	verticalAlign: "middle",
	draggable: false,
	draw: function() {
		drawText(this);
	},
	recalculate: function() {
		this.fontSize = circleUnitRadius * fontSlider.value;
		
		this.color = getSegmentColor(sinInput);
		
		if(theta < 0) {
			this.rotateAngle += 180;
		}
		
		this.visible = getEnabled(enableSec) && showLabels.checked;
		
		this.x = (WIDTH / 2) + ((circleRadius * sec(toRadians(theta))) / 2);
		this.y = HEIGHT / 2;
	}
});

//Cot label
shapes.push({
	fontFamily: "Arial",
	text: "cot(\u{03B8})",
	fill: true,
	textAlign: "center",
	verticalAlign: "middle",
	draggable: false,
	draw: function() {
		drawText(this);
	},
	recalculate: function() {
		this.fontSize = circleUnitRadius * fontSlider.value;
		
		this.color = getSegmentColor(sinInput);
		
		this.rotateAngle = 90 - theta;
		
		if(theta < 0) {
			this.rotateAngle += 180;
		}
		
		this.visible = getEnabled(enableCot) && showLabels.checked;
		
		this.x = (WIDTH / 2) + ((circleRadius * Math.cos(toRadians(theta))) / 2);
		this.y = (HEIGHT / 2) - (circleRadius * Math.sin(toRadians(theta))) - (((circleRadius * csc(toRadians(theta))) - (circleRadius * Math.sin(toRadians(theta)))) / 2);
	}
});

//Draggable point
shapes.push({
	r: 8,
	fill: "black",
	draggable: true,
	isDragging: false,
	dragHandler: function(pX, pY) {
		var cX = WIDTH / 2;
		var cY = HEIGHT / 2;
		
		var vX = pX - cX;
		var vY = pY - cY;
		
		var magV = Math.sqrt((vX * vX) + (vY * vY));
		
		var aX = cX + vX / magV * circleRadius;
		var aY = cY + vY / magV * circleRadius;
		
		this.x = aX;
		this.y = aY;
		
		theta = toDegrees(Math.atan2((HEIGHT / 2) - aY, aX - (WIDTH / 2)));
		
		for(var i = 0; i < shapes.length; i++){
			if(typeof shapes[i].recalculate !== "undefined") {
				shapes[i].recalculate();
			}
		}
	},
	draw: function() {
		drawCircle(this);
	},
	recalculate: function() {
		this.visible = getEnabled(enableRadius);
		
		this.x = (WIDTH / 2) + (circleRadius * Math.cos(toRadians(theta)));
		this.y = (HEIGHT / 2) - (circleRadius * Math.sin(toRadians(theta)));
	}
});

// listen for mouse events
canvas.onmousedown = myDown;
canvas.onmouseup = myUp;
canvas.onmousemove = myMove;

// call to draw the scene
draw();

function drawLine(l) {
	ctx.strokeStyle = l.stroke;
	ctx.lineWidth = l.width;
	ctx.beginPath();
	ctx.moveTo(l.x1, l.y1);
	ctx.lineTo(l.x2, l.y2);
	ctx.stroke();
}

function drawRect(r) {
	ctx.fillStyle = r.fill;
	ctx.fillRect(r.x, r.y, r.width, r.height);
}

function drawCircle(c) {
	ctx.fillStyle = c.fill;
	ctx.beginPath();
	ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
	ctx.closePath();
	ctx.fill();
}

function drawArc(a) {
	ctx.strokeStyle = a.stroke;
	ctx.lineWidth = a.width;
	ctx.beginPath();
	ctx.arc(a.x, a.y, a.r, a.sAngle, a.eAngle, a.counterclockwise);
	ctx.stroke();
}

function drawText(t) {
	if(typeof t.fontSize !== "undefined" && typeof t.fontFamily !== "undefined") {
		ctx.font = t.fontSize + "px " + t.fontFamily;
	}
	
	if(typeof t.textAlign !== "undefined") {
		ctx.textAlign = t.textAlign;
	}
	
	ctx.textBaseline = "bottom";
	
	var x = 0;
	var y = 0;
	
	if(typeof t.rotateAngle === "undefined") {
		x = t.x;
		y = t.y;
	}
	
	if(typeof t.verticalAlign !== "undefined") {
		if(t.verticalAlign === "bottom") {
			y += t.fontSize;
		} else if(t.verticalAlign === "middle") {
			y += (t.fontSize / 2);
		}
	}
	
	if(t.fill) {
		ctx.fillText(t.text, x, y);
	} else {
		ctx.strokeText(t.text, x, y);
	}
}

function rotate(o) {
	ctx.translate(o.x, o.y);
	ctx.rotate(toRadians(o.rotateAngle));
}

// clear the canvas
function clear() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// redraw the scene
function draw() {
	clear();
	
	circleUnitRadius = circleRadius / (HEIGHT / 6);
	
	// redraw each shape in the shapes[] array
	for(var i = 0; i < shapes.length; i++){
		var s = shapes[i];
		
		if(typeof s.recalculate !== "undefined") {
			s.recalculate();
		}
		
		//Prepare for transformations
		ctx.save();
		
		if(typeof s.rotateAngle !== "undefined") {
			rotate(s);
		}
		
		if(typeof s.visible === "undefined" || s.visible == true) {
			s.draw(s);
		}
		
		ctx.restore();
	}
	
	thetaInput.value = theta;
	sinInput.value = circleUnitRadius * Math.sin(toRadians(theta));
	cosInput.value = circleUnitRadius * Math.cos(toRadians(theta));
	tanInput.value = circleUnitRadius * Math.tan(toRadians(theta));
	secInput.value = circleUnitRadius * sec(toRadians(theta));
	cscInput.value = circleUnitRadius * csc(toRadians(theta));
	cotInput.value = circleUnitRadius * cot(toRadians(theta));
	tanLineInput.value = Math.abs(circleUnitRadius * (Math.tan(toRadians(theta)) + cot(toRadians(theta))));
}

// handle mousedown events
function myDown(e){
	// tell the browser we're handling this mouse event
	e.preventDefault();
	e.stopPropagation();
	
	BB = canvas.getBoundingClientRect();
	offsetX = BB.left;
	offsetY = BB.top;
	
	// get the current mouse position
	var mx = parseInt(e.clientX - offsetX);
	var my = parseInt(e.clientY - offsetY);
	
	// test each shape to see if mouse is inside
	dragok = false;
	for(var i = 0; i < shapes.length; i++){
		var s = shapes[i];
		
		if(s.draggable) {
			// decide if the shape is a rect or circle				 
			if(s.width){
				// test if the mouse is inside this rect
				if(
					mx > s.x
					&& mx < s.x + s.width
					&& my > s.y
					&& my < s.y + s.height
				){
					// if yes, set that rects isDragging=true
					dragok=true;
					s.isDragging=true;
				}
			} else{
				var dx = s.x - mx;
				var dy = s.y - my;
				// test if the mouse is inside this circle
				if(dx * dx + dy * dy < s.r * s.r){
					dragok = true;
					s.isDragging = true;
				}
			}
		}
	}
	// save the current mouse position
	startX = mx;
	startY = my;
}

// handle mouseup events
function myUp(e){
	// tell the browser we're handling this mouse event
	e.preventDefault();
	e.stopPropagation();
	
	// clear all the dragging flags
	dragok = false;
	for(var i = 0;i < shapes.length; i++){
		if(shapes[i].draggable) {
			shapes[i].isDragging = false;
		}
	}
}

// handle mouse moves
function myMove(e){
	// if we're dragging anything...
	if (dragok){
		// tell the browser we're handling this mouse event
		e.preventDefault();
		e.stopPropagation();
	
		BB = canvas.getBoundingClientRect();
		offsetX = BB.left;
		offsetY = BB.top;
	
		// get the current mouse position
		var mx = parseInt(e.clientX - offsetX);
		var my = parseInt(e.clientY - offsetY);
	
		// calculate the distance the mouse has moved
		// since the last mousemove
		var dx = mx - startX;
		var dy = my - startY;
	
		// move each rect that isDragging 
		// by the distance the mouse has moved
		// since the last mousemove
		for(var i = 0; i < shapes.length; i++){
			var s = shapes[i];
			
			if(s.draggable && s.isDragging){
				//Let objects handle drag if they want
				if(typeof s.dragHandler !== "undefined") {
					s.dragHandler(mx, my);
				} else {
					s.x += dx;
					s.y += dy;
				}
			}
		}
	
		// redraw the scene with the new rect positions
		draw();
	
		// reset the starting mouse position for the next mousemove
		startX = mx;
		startY = my;
	}
}

function toRadians(degrees){
	return degrees * (Math.PI / 180);
}

function toDegrees(radians){
	return radians / (Math.PI / 180);
}

function sec(radians) {
	return 1 / Math.cos(radians);
}

function csc(radians) {
	return 1 / Math.sin(radians);
}

function cot(radians) {
	return 1 / Math.tan(radians);
}

function getSegmentColor(elem) {
	return window.getComputedStyle(elem.previousElementSibling).color;
}

function getEnabled(elem) {
	return elem.checked && elem.parentElement.parentElement.firstElementChild.lastElementChild.checked;
}