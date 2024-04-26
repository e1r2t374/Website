var term = document.getElementById("term");
var console = document.getElementById("console");
var input = document.getElementById("input");
var output = document.getElementById("output");
var commands = [];

/* Makes the terminal draggable */
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
dragDiv(term);
dragDiv(console);

/* Toggle terminal visibility */
var toggle = 1;
function termToggle() {
    if (toggle) {
	toggle = 0;
	term.style.display = "none";
	document.getElementById("term-toggle").innerHTML = "Show Term";
    } else {
	toggle = 1;
	term.style.display = "block";
	document.getElementById("term-toggle").innerHTML = "Hide Term";
    }
}
termToggle();

/* Set terminal to initial position */
function termRest() {
    term.style.top = "110px";
    term.style.left = "9px";
}

/* Check if ENTER key is pressed and execute command in terminal if so */
function keypart() {
    document.addEventListener("keydown", function (event) {
	if (event.key === 'Enter') {
	    event.preventDefault();
	    /* Sanitize input */
	    input.value = input.value.replace(/[&<>"']/g, function(match) {
		return {
		    '&': '&amp;',
		    '<': '&lt;',
		    '>': '&gt;',
		    '"': '&quot;',
		    "'": '&#x27;',
		    "$": '&#36;',
		    "\\": '&#92;',
		    "`": '&#96;'
		}[match]
	    }).trim();

	    var inputCommands = input.value.split(';');
	    inputCommands.forEach(function(command) {
		if (command.trim() !== "") {
		    commands.push(command.trim());
		}
	    });

	    executeCommands(commands);

	    /* Clear terminal */
	    input.value = "";
	}
    });
}

function executeCommands(commands) {
    output.innerHTML = "";
    commands.forEach(function(command) {
	switch(command){
	    case "help":
		output.innerHTML += "help - Shows this message<br>";
		break;
	    case "clear":
		output.innerHTML = "";
		break;
	    case "console-hide":
		console.style.display = "none";
		break;
	    case "console-show":
		console.style.display = "block";
		break;
	    default:
		output.innerHTML += "Unknown command: " + command + "<br>";
		break;
	}
    });
}
keypart();
