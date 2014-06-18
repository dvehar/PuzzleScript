/* setup callback for click on sound buttons */
for (var i=0;i<10;i++) {
	var idname = "newsound"+i;
	var el = document.getElementById(idname);
  el.addEventListener("click", (function(n){return function(){return newSound(n);};})(i), false);
}

/* var for the rgts webworker */ 
var worker = null;
/* setup callback for click on rgts buttons */
for (var i=0;i<1;i++) {
	var idname = "rgtsbutton"+i;
	var el = document.getElementById(idname);
  
  if (i === 0) { // the start / stop toggle button
    /* TODO change the file path and/or how this is detected. */
    /* if turned on we start the worker 
     * if turned of we terminate the worker and then restart and redraw the level*/
    el.addEventListener("click", (function(n){return function(){ 
        // if (el.firstChild.attributes[1].nodeValue === "/home/desmond/Gamelan/puzzle/PuzzleScript_new/rgts/images/rgts_go.gif") {
          console.log("starting the rgts");
          
          worker = new Worker('js/rgts_worker.js');
          // setup the message receiver
          worker.addEventListener('message', function(e) {
            console.log(e.data);
            if (e === "restart and redraw") {
              DoRestart(true);
              redraw();
            } else {
              
            }
          }, false);
<<<<<<< HEAD
          worker.postMessage({'cmd': 'start', 'msg': editor.getValue(), 'lvl': curlevel}); // send a message telling the worker to start
=======
          worker.postMessage({'cmd': 'start', 'msg': editor.getValue(), 'lvl':curlevel}); // send a message telling the worker to start
>>>>>>> 9feb524230b89c6a1c95808f9123b7a731ebec5f
          el.firstChild.attributes[1].nodeValue = "/home/desmond/Gamelan/puzzle/PuzzleScript_new/rgts/images/rgts_stop.gif" 
        // } else {
        //   console.log("stopping the rgts");
        //   worker.terminate(); // stop the worker
        //   DoRestart(true);
        //   redraw();
        //   el.firstChild.attributes[1].nodeValue = "/home/desmond/Gamelan/puzzle/PuzzleScript_new/rgts/images/rgts_go.gif";
      //  } 
			};})(i), false);
  } else { // TODO remove ?
    el.addEventListener("click", (function(n){return function(){console.log("rgts_button" + n + " was pressed.");};})(i), false);
  }
}

//var soundButtonPress = document.getElementById("soundButtonPress");
//soundButtonPress.addEventListener("click", buttonPress, false);

var runClickLink = document.getElementById("runClickLink");
runClickLink.addEventListener("click", runClick, false);

var saveClickLink = document.getElementById("saveClickLink");
saveClickLink.addEventListener("click", saveClick, false);

var rebuildClickLink = document.getElementById("rebuildClickLink");
rebuildClickLink.addEventListener("click", rebuildClick, false);

var shareClickLink = document.getElementById("shareClickLink");
shareClickLink.addEventListener("click", shareClick, false);

var levelEditorClickLink = document.getElementById("levelEditorClickLink");
levelEditorClickLink.addEventListener("click", levelEditorClick_Fn, false);

var exportClickLink = document.getElementById("exportClickLink");
exportClickLink.addEventListener("click", exportClick, false);

var exportDebugClickLink = document.getElementById("exportDebugClickLink");
exportDebugClickLink.addEventListener("click", exportDebugClick, false);

var exampleDropdown = document.getElementById("exampleDropdown");
exampleDropdown.addEventListener("change", dropdownChange, false);

var loadDropDown = document.getElementById("loadDropDown");
loadDropDown.addEventListener("change", loadDropDownChange, false);

var leftHorizontalDragbar = document.getElementById("lefthorizontaldragbar");
leftHorizontalDragbar.addEventListener("mousedown", leftHorizontalDragbarMouseDown, false);

var rightHorizontalDragbar = document.getElementById("righthorizontaldragbar");
rightHorizontalDragbar.addEventListener("mousedown", rightHorizontalDragbarMouseDown, false);

var verticalDragbar = document.getElementById("verticaldragbar");
verticalDragbar.addEventListener("mousedown", verticalDragbarMouseDown, false);

window.addEventListener("resize", resize_all, false);
window.addEventListener("load", reset_panels, false);

/* https://github.com/ndrake/PuzzleScript/commit/de4ac2a38865b74e66c1d711a25f0691079a290d */
window.onbeforeunload = function (e) {
  var e = e || window.event;
  var msg = 'You have unsaved changes!';

  if(_editorDirty) {      

    // For IE and Firefox prior to version 4
    if (e) {
      e.returnValue = msg;
    }

    // For Safari
    return msg;
  }
};

var gestureHandler = Mobile.enable();
if (gestureHandler) {
    gestureHandler.setFocusElement(document.getElementById('gameCanvas'));
}
