var term = document.getElementById("term");
var input = document.getElementById("input");
var output = document.getElementById("output");
dragDiv(term);
function dragDiv(div) {
	let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
	div.onmousedown = dragMouseDown;
	function dragMouseDown(c) {
		x1 = c.clientX;
		y1 = c.clientY;
		document.onmouseup = stopDrag;
		document.onmousemove = startDrag;
	}
	function startDrag(c) {
		x2 = x1 - c.clientX;
		y2 = y1 - c.clientY;
    		x1 = c.clientX;
    		y1 = c.clientY;
		c.preventDefault();
		div.style.top = (div.offsetTop - y2) + "px";
    		div.style.left = (div.offsetLeft - x2) + "px";
  	}
	function stopDrag() {
   		document.onmouseup = null;
    		document.onmousemove = null;
 	}
}
var toggle=1;
function termToggle(){
	if (toggle){
		toggle=0;
		term.style.display = "none";
		document.getElementById("term-toggle").innerHTML="Show Term";
	}
	else{
		toggle=1;
		term.style.display = "block";
		document.getElementById("term-toggle").innerHTML="Hide Term";
	}
}
termToggle()

function termRest(){
	term.style.top = "110px";
	term.style.left = "9px";
}
function keypart() {
	document.addEventListener("keydown", function (event) {
	if (event.key === 'Enter') {
		event.preventDefault();
		switch(input.value){
			case "help":
				output.innerText = "help - Shows this message\nclear - Clears the terminal\n";
				break;
			case "clear":
				output.innerText = "";
				break;
			default:
				output.innerText = "Unknown command: " + input.value+"\n";
				break;
		}
		input.value = "";
	}
  });
}
keypart();
