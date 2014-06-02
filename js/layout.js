var soundbarwidth = 100;
var leftlowerbarheight = document.getElementById("rgtsbar").clientHeight;
var rightlowerbarheight = document.getElementById("soundbar").clientHeight;
var upperbarheight = document.getElementById("uppertoolbar").clientHeight;
var winwidth = window.innerWidth;
var winheight = window.innerHeight;
var verticaldragbarWidth = document.getElementById("verticaldragbar").clientWidth;
var leftHorizontaldragbarHeight = document.getElementById("lefthorizontaldragbar").clientHeight;
var rightHorizontaldragbarHeight = document.getElementById("righthorizontaldragbar").clientHeight;
var minimumDimension = 100;

function resize_widths(verticaldragbarX){
  var left_pannel_x = verticaldragbarX + "px";
  var right_pannel_x = verticaldragbarX + verticaldragbarWidth + "px";
  var vertical_dragbar_x = verticaldragbarX + "px";
  
	document.getElementById("lefttophalf").style.width = left_pannel_x;
  document.getElementById("lefthorizontaldragbar").style.width = left_pannel_x;
  document.getElementById("leftbottomhalf").style.width = left_pannel_x;
  
	document.getElementById("righttophalf").style.left = right_pannel_x;
	document.getElementById("rightbottomhalf").style.left = right_pannel_x;
	document.getElementById("righthorizontaldragbar").style.left = right_pannel_x;
  
	document.getElementById("verticaldragbar").style.left = vertical_dragbar_x;
	canvasResize();
}

function resize_heights(lefthorizontaldragbarY, righthorizontaldragbarY){
  if (lefthorizontaldragbarY !== null) {
    document.getElementById("lefttophalf").style.height = lefthorizontaldragbarY - upperbarheight + "px";
    document.getElementById("leftbottomhalf").style.top = lefthorizontaldragbarY + leftHorizontaldragbarHeight + "px";
    document.getElementById("lefthorizontaldragbar").style.top = lefthorizontaldragbarY + "px";
  }
  
	document.getElementById("verticaldragbar").style.height = (window.innerHeight - upperbarheight) + "px";/*lefthorizontaldragbarY - upperbarheight + "px";*/
	
  if (righthorizontaldragbarY !== null) {
    document.getElementById("righttophalf").style.height = righthorizontaldragbarY - upperbarheight + "px";
    document.getElementById("rightbottomhalf").style.top = righthorizontaldragbarY + rightHorizontaldragbarHeight + "px";
    document.getElementById("righthorizontaldragbar").style.top = righthorizontaldragbarY + "px";
  }
	canvasResize();
}

function resize_all(e){
	smallmovelimit = 100;
	
  /* vertical dragebar */
	hdiff = window.innerWidth - winwidth;
	verticaldragbarX = parseInt(document.getElementById("verticaldragbar").style.left.replace("px",""));
	
	if(hdiff > -smallmovelimit && hdiff < smallmovelimit){
		verticaldragbarX += hdiff;
	} else {
		verticaldragbarX *= window.innerWidth/winwidth;
	};
	
	if ((verticaldragbarX <= minimumDimension)){
		verticaldragbarX = minimumDimension;
	} else if ((window.innerWidth - verticaldragbarX) < soundbarwidth){
		verticaldragbarX = window.innerWidth - soundbarwidth;
	};
	resize_widths(verticaldragbarX);
	
	
	/* right horozontal drag bar */
	righthorizontaldragbarY = parseInt(document.getElementById("righthorizontaldragbar").style.top.replace("px",""));
	rightvdiff = window.innerHeight - winheight;
	
	if(rightvdiff > -smallmovelimit && rightvdiff < smallmovelimit){
		righthorizontaldragbarY += rightvdiff;
	} else {
		righthorizontaldragbarY *= window.innerHeight/winheight;
	};
	
	if ((righthorizontaldragbarY <= upperbarheight + minimumDimension)){
		righthorizontaldragbarY = upperbarheight + minimumDimension;
	} else if ((window.innerHeight - righthorizontaldragbarY) < (rightlowerbarheight + minimumDimension)){
		righthorizontaldragbarY = window.innerHeight - (rightlowerbarheight + minimumDimension + 5);
	};
  
  
  /* left horizontal drag bar */
  lefthorizontaldragbarY = parseInt(document.getElementById("lefthorizontaldragbar").style.top.replace("px",""));
	leftvdiff = window.innerHeight - winheight;
	
	if(leftvdiff > -smallmovelimit && leftvdiff < smallmovelimit){
		lefthorizontaldragbarY += leftvdiff;
	} else {
		lefthorizontaldragbarY *= window.innerHeight/winheight;
	};
	
	if ((lefthorizontaldragbarY <= upperbarheight + minimumDimension)){
		lefthorizontaldragbarY = upperbarheight + minimumDimension;
	} else if ((window.innerHeight - lefthorizontaldragbarY) < leftlowerbarheight + minimumDimension){
		lefthorizontaldragbarY = window.innerHeight - (leftlowerbarheight + minimumDimension + 5);
	};
  
	resize_heights(lefthorizontaldragbarY , righthorizontaldragbarY); 
	
	winwidth = window.innerWidth;
	winheight = window.innerHeight;
};

function verticalDragbarMouseDown(e) {
	e.preventDefault();
	document.body.style.cursor = "col-resize";
	window.addEventListener("mousemove", verticalDragbarMouseMove, false);
	window.addEventListener("mouseup", verticalDragbarMouseUp, false);
};

function verticalDragbarMouseMove(e) {
	if (e.pageX <= minimumDimension){
		resize_widths(minimumDimension);
	} else if ((window.innerWidth - e.pageX) > soundbarwidth){
		resize_widths(e.pageX - 1);
	} else {
		resize_widths(window.innerWidth - soundbarwidth);
	};
};

function verticalDragbarMouseUp(e) {
	document.body.style.cursor = "";
	window.removeEventListener("mousemove", verticalDragbarMouseMove, false);
};

function leftHorizontalDragbarMouseDown(e) {
	e.preventDefault();
	document.body.style.cursor = "row-resize";
	window.addEventListener("mousemove", leftHorizontalDragbarMouseMove, false);
	window.addEventListener("mouseup", leftHorizontalDragbarMouseUp, false);
};

function leftHorizontalDragbarMouseMove(e) {  
  console.log("Hey1");
	if (e.pageY <= (upperbarheight + minimumDimension)) {
		resize_heights(upperbarheight + minimumDimension, null);
	} else if ((window.innerHeight - e.pageY) > (leftlowerbarheight + minimumDimension)){
		resize_heights(e.pageY - 1, null);
	} else {
		resize_heights(window.innerHeight - leftlowerbarheight - minimumDimension, null);
	}
};

function leftHorizontalDragbarMouseUp(e) {
	document.body.style.cursor = "";
	window.removeEventListener("mousemove", leftHorizontalDragbarMouseMove, false);
};

function rightHorizontalDragbarMouseDown(e) {
	e.preventDefault();
	document.body.style.cursor = "row-resize";
	window.addEventListener("mousemove", rightHorizontalDragbarMouseMove, false);
	window.addEventListener("mouseup", rightHorizontalDragbarMouseUp, false);
};

function rightHorizontalDragbarMouseMove(e) {
	if (e.pageY <= (upperbarheight + minimumDimension)) {
		resize_heights(null, upperbarheight + minimumDimension);
	} else if ((window.innerHeight - e.pageY) > (rightlowerbarheight + minimumDimension)){
		resize_heights(null, e.pageY - 1);
	} else {
		resize_heights(null, window.innerHeight - rightlowerbarheight - minimumDimension);
	}
};

function rightHorizontalDragbarMouseUp(e) {
	document.body.style.cursor = "";
	window.removeEventListener("mousemove", rightHorizontalDragbarMouseMove, false);
};

function reset_panels(){
	resize_widths(Math.floor(window.innerWidth/2));
  console.log("hey2");
  resize_heights(Math.floor(window.innerHeight/2), Math.floor(window.innerHeight/2));
	winwidth = window.innerWidth;
	winheight = window.innerHeight;
};
