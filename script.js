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
		console.style.display = "none";
		document.getElementById("term-toggle").innerText = "Show Term";
	} 
	else {
		toggle = 1;
		term.style.display = "block";
		console.style.display = "block";
		document.getElementById("term-toggle").innerText = "Hide Term";
	}
}
termToggle();

/* Set terminal to initial position */
function termRest() {
	term.style.top = "110px";
	term.style.left = "9px";
	console.style.top = "110px";
	console.style.left = "9px";
	input.innerText = "";
	output.innerText = "";
	commands = [];
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
/* Execute commands (Currently bugged with mutliple commands) */
function exec(commands) {
	/* Flag parsing */
	commands.forEach(function(command) {
	let flags = {};
	let currentFlag = null;
	let parts = command.split(' ');
	//ensures flags do no have another command in them
	for(let i = 1; i < parts.length; i++){
		if(parts[i].startsWith('-')){
			currentFlag = parts[i];
			flags[currentFlag] = [];
		}
		else{
			if (flags[currentFlag] !== undefined){
				flags[currentFlag].push(parts[i]);
			}
			else{
				output.innerText += "Unknown command: " + command + "\n";
				return;
			}
		}
	}
	/* Command Execution */
	switch(parts[0]){
		case "help":
			output.innerText += "help - Shows this message\n";
			output.innerText += "clear - Clears the console\n";
			output.innerText += "hide - Hides the console\n";
			output.innerText += "show - Shows the console\n";
			output.innerText += "color\n";
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
			/*
		Main
			bg - background color
			fg - foreground color
			fc - font color
			bc - button color
			bfc - button font color
			hlc - highlight color
			lhfc - ling hover font color
		Terminal
			tbg - terminal background color
			tfg - terminal foreground color
			tfc - terminal font color
			tbc - terminal border color

			cbg - console background color
			cfg - console foreground color
			cfc - console font color
			cbc - console border color

		Other
			h - help
			*/
			function checkClr(color){
				let s = new Option().style;
				s.color = color;
				return s.color == color;
			}
			let colorFlags = ["-bg", "-fg", "-fc", "-bc", "-bfc", 
					  "-hlc", "-lhfc", "tbg", "tfg", "tfc", 
					  "tbc", "cbg", "cfg", "cfc" ,"cbc"]
				for(let j = 0; j < colorFlags.length; j++){
					if(colorFlags[j] in flags && currentFlag in colorFlags){
						switch(colorFlags[j]) {
							case "-bg":
								if( checkClr(flags[colorFlags[j]])){
									document.body.style.background = flags[colorFlags[j]];
								}
								else{
									output.innerText += "Invalid flag usage:"+ colorFlags[j] + ": "+flags[colorFlags[j]]+"\n";
								}
								break;
							case "-fg":
							case "-fc":
							case "-bc":
							case "-bfc":
							case "-hlc":
							case "-lhfc":
							case "-tbg":
							case "-tfg":
							case "-tfc":
							case "-tbc":
							case "-cbg":
							case "-cfg":
							case "-cfc":
							case "-cbc":
							/* All Cases above Fallthroughs */
								output.innerText += "Other Flag executed\n";
								break;
							default:
								output.innerText += "Unexpected Flag Error!\n";
								break;
						}
					}
					else{
						/* TODO: Fix */
						if(!(currentFlag.forEach in colorFlags)){
							output.innerText += currentFlag+" Invalid flag!\n";
							return;
						}
					}
				}
				break;
		case "echo":
			let echoFlags = ["-e"];
			output.innerText += flags[echoFlags] + "\n";
			break;
		default:
			output.innerText += "Unknown command: " + command + "\n";
			break;
		}
	});
}
keypart();
