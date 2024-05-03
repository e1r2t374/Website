var term = document.getElementById("term");
var console = document.getElementById("console");
var input = document.getElementById("input");
var output = document.getElementById("output");
var commands = [];
/*
TODO
- Math
- HTB writeups page
- Blog page
- About me page
- Terminal Linux emulation
- Method of saving configurations
- Web proxying
- AI (maybe)
*/
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
			commandIndex = commands.length;
			previousCommand = '';
		} 
		else if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (commandIndex > 0) {
				commandIndex--;
				input.value = commands[commandIndex];
			}
		} 
		else if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (commandIndex < commands.length - 1) {
				commandIndex++;
				input.value = commands[commandIndex];
			} 
			else {
				/* Restore the current input value if at the end of history */
				if (commandIndex === commands.length - 1) {
					input.value = previousCommand;
				}
			}
		} 
		else {
			previousCommand = input.value;
		}
	});
}
keypart();
/* Execute commands */
function exec(commands) {
	/* Flag parsing */
	commands.forEach(function(command) {
	let flags = {};
	let currentFlag = null;
	let parts = command.split(' ');
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
			output.innerText += "(Try typing <command> -h for more details)\n\nhelp - Shows this message\nclear - Clears the console\nhide - Hides the console\nshow - Shows the console\ncolor - Changes the color of schemes of the website\n";
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
			function checkClr(color){
				let s = new Option().style;
				s.color = color;
				return s.color == color;
			}
			let colorFlags = ["-h","-bg","-fg","-tbg","-tfg","-cbg","-cfg","-ibg","-ifg","-ofg","-obg","-bbg","-bfg"]
				for(let j = 0; j < colorFlags.length; j++){
					if(colorFlags[j] in flags){
						switch(colorFlags[j]) {
							case "-h":
								output.innerText += "color - Changes the color of schemes of the website\nUsage: color [-bg <background_color>] [-fg <foreground_color>] [...]\nFlags:\n-h - Shows this message\n[Main]:\n-bg <background_color> - Changes the background color of the website\n-fg <foreground_color> - Changes the foreground color of the website\n-bbg <button_background_color> - Changes the background color of the buttons\n-bfg <button_foreground_color> - Changes the foreground color of the buttons\n[Terminal]:\n-tbg <terminal_background_color> - Changes the background color of the terminal\n-tfg <terminal_foreground_color> - Changes the foreground color of the terminal\n-ibg <input_background_color> - Changes the background color of the input\n-ifg <input_foreground_color> - Changes the foreground color of the input\n[Console]:\n-cbg <console_background_color> - Changes the background color of the console\n-cfg <console_foreground_color> - Changes the foreground color of the console\n-ofg <output_foreground_color> - Changes the foreground color of the output\n-obg <output_background_color> - Changes the background color of the output\n";
								break;
							case "-bg":
								if(checkClr(flags[colorFlags[j]])){
									document.body.style.background = flags[colorFlags[j]];
									output.innerText += "Background color set to "+flags[colorFlags[j]]+"\n";
								}
								else{
									output.innerText += "Invalid flag usage:"+ colorFlags[j] + ": "+flags[colorFlags[j]]+"\n";
								}
								break;
							case "-fg":
								if(checkClr(flags[colorFlags[j]])){
									document.getElementsByTagName("h1")[0].style.color = flags[colorFlags[j]];
									//Chrome Safari
									document.getElementsByTagName("hr")[0].style.borderColor = flags[colorFlags[j]];
									//IE7+
									document.getElementsByTagName("hr")[0].style.color = flags[colorFlags[j]];
									//Firefox and Opera
									document.getElementsByTagName("hr")[0].style.backgroundColor = flags[colorFlags[j]];
									for(let i=0;i< document.getElementsByTagName("a").length;i++){
										document.getElementsByTagName("a")[i].style.color = flags[colorFlags[j]];
									}
									output.innerText += "Foreground set to "+flags[colorFlags[j]]+"\n";
								}
								else{
									output.innerText += "Invalid flag usage:"+ colorFlags[j] + ": "+flags[colorFlags[j]]+"\n";
								}
								break;
							case "-tbg":
								if(checkClr(flags[colorFlags[j]])){
									document.getElementById("term").style.background = flags[colorFlags[j]];
									output.innerText += "Terminal background set to "+flags[colorFlags[j]]+"\n";
								}
								else{
									output.innerText += "Invalid flag usage:"+ colorFlags[j] + ": "+flags[colorFlags[j]]+"\n";
								}
								break;
							case "-tfg":
								if(checkClr(flags[colorFlags[j]])){
									document.getElementsByTagName("h1")[1].style.color = flags[colorFlags[j]];
									document.getElementsByTagName("p1")[0].style.color = flags[colorFlags[j]];
									document.getElementsByTagName("p2")[0].style.color = flags[colorFlags[j]];
									document.getElementsByTagName("p3")[0].style.color = flags[colorFlags[j]];
									output.innerText += "Terminal foreground set to "+flags[colorFlags[j]]+"\n";
								}
								else{
									output.innerText += "Invalid flag usage:"+ colorFlags[j] + ": "+flags[colorFlags[j]]+"\n";
								}
								break;
							case "-cbg":
								if(checkClr(flags[colorFlags[j]])){
									document.getElementById("console").style.background = flags[colorFlags[j]];
									output.innerText += "Console background set to "+flags[colorFlags[j]]+"\n";
								}
								else{
									output.innerText += "Invalid flag usage:"+ colorFlags[j] + ": "+flags[colorFlags[j]]+"\n";
								}
								break;
							case "-cfg":
								if(checkClr(flags[colorFlags[j]])){
									document.getElementsByTagName("h1")[2].style.color = flags[colorFlags[j]];
									output.innerText += "Console foreground set to "+flags[colorFlags[j]]+"\n";
								}
								else{
									output.innerText += "Invalid flag usage:"+ colorFlags[j] + ": "+flags[colorFlags[j]]+"\n";
								}
								break;
							case "-ibg":
								if(checkClr(flags[colorFlags[j]])){
									document.getElementsByTagName("textarea")[0].style.background = flags[colorFlags[j]];
									output.innerText += "Terminal background set to "+flags[colorFlags[j]]+"\n";
								}
								else{
									output.innerText += "Invalid flag usage:"+ colorFlags[j] + ": "+flags[colorFlags[j]]+"\n";
								}
								break;
							case "-ifg":
								if(checkClr(flags[colorFlags[j]])){
									document.getElementsByTagName("textarea")[0].style.color = flags[colorFlags[j]];
									output.innerText += "Terminal foreground set to "+flags[colorFlags[j]]+"\n";
								}
								else{
									output.innerText += "Invalid flag usage:"+ colorFlags[j] + ": "+flags[colorFlags[j]]+"\n";
								}
								break;
							case "-obg":
								if(checkClr(flags[colorFlags[j]])){
									document.getElementById("output").style.background = flags[colorFlags[j]];
									output.innerText += "Console output background set to "+flags[colorFlags[j]]+"\n";
								}
								else{
									output.innerText += "Invalid flag usage:"+ colorFlags[j] + ": "+flags[colorFlags[j]]+"\n";
								}
								break;
							case "-ofg":
								if(checkClr(flags[colorFlags[j]])){
									document.getElementById("output").style.color = flags[colorFlags[j]];
									output.innerText += "Console output foreground set to "+flags[colorFlags[j]]+"\n";
								}
								else{
									output.innerText += "Invalid flag usage:"+ colorFlags[j] + ": "+flags[colorFlags[j]]+"\n";
								}
								break;
							case "-bbg":
								if(checkClr(flags[colorFlags[j]])){
									for(let i=0;i< document.getElementsByTagName("button").length;i++){
										document.getElementsByTagName("button")[i].style.background = flags[colorFlags[j]];
									}
									output.innerText += "Button backgrounds set to "+flags[colorFlags[j]]+"\n";
								}
								else{
									output.innerText += "Invalid flag usage:"+ colorFlags[j] + ": "+flags[colorFlags[j]]+"\n";
								}
								break;
							case "-bfg":
								if(checkClr(flags[colorFlags[j]])){
									for(let i=0;i< document.getElementsByTagName("button").length;i++){
										document.getElementsByTagName("button")[i].style.color = flags[colorFlags[j]];
									}
									output.innerText += "Button foregrounds set to "+flags[colorFlags[j]]+"\n";
								}
								else{
									output.innerText += "Invalid flag usage:"+ colorFlags[j] + ": "+flags[colorFlags[j]]+"\n";
								}
								break;
							default:
								output.innerText += "Unexpected Flag Error!\n";
								break;
						}
					}
					else{
						if (!(colorFlags.includes(currentFlag))){
							output.innerText += "Unknown flag: " + currentFlag + "\n";
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
