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
		document.getElementById("term-toggle").innerText = "Show Term";
	} 
	else {
		toggle = 1;
		term.style.display = "block";
		document.getElementById("term-toggle").innerText = "Hide Term";
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
			var inputCmds = input.value.split(';');
			inputCmds.forEach(function(command) {
				if (command.trim() !== "") {
					commands.push(command.trim());
				}
			});
			exec(commands);
			/* Clear terminal */
			input.value = "";
		}
	});
}

function exec(commands) {
	output.innerText = "";
	commands.forEach(function(command) {
	// Example: color -c blue -h red -b green
	var flags = {};
	var currentFlag = null;
	var parts = command.split(' ');
	for(var i = 1; i < parts.length; i++){
		if(parts[i].startsWith('-')){
			currentFlag = parts[i];
			flags[currentFlag] = [];
		}
		else{
			flags[currentFlag].push(parts[i]);
		}
	}
	switch(parts[0]){
		case "help":
			output.innerText += "help - Shows this message\n";
			output.innerText += "clear - Clears the console\n";
			output.innerText += "hide - Hides the console\n";
			output.innerText += "show - Shows the console\n";
			break;
		case "clear":
			output.innerText = "";
			break;
		case "hide":
			console.style.display = "none";
			break;
		case "show":
			console.style.display = "block";
			break;
		case "color":
			let colorFlags = ["-c", "-h", "-b"];  
				for(var j = 0; j < colorFlags.length; j++){
					if(colorFlags[j] in flags){
						output.innerText += colorFlags[j] + ": " + flags[colorFlags[j]] + "\n";
					}
				}
				break;
		default:
			output.innerText += "Unknown command: " + command + "\n";
			break;
		}
	});
}
keypart();
