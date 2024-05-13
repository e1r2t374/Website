var term = document.getElementById("term-window");
var console = document.getElementById("console-window");
var input = document.getElementById("input");
var output = document.getElementById("output");
var commands = [];
var histlog = [];
/*
TODO
-Fix all color -fg commands
-Error handling for empty history scrolling
- history command that prints history
- Parse no arguments as -h
- Emulated file system
- Special characters like "/ ~ . and .."
- HTB writeups page
- Blog page
- About me page
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
            if (input.value !== '') {
                let inputCmds = input.value;
                inputCmds.split(';').forEach(function(command) {
                    if (command.trim() !== '') {
                        commands.push(command.trim());
                    }
                });
                if (inputCmds.trim() !== '') {
                    histlog.push(inputCmds.trim());
                }
            }
            exec(commands);
            /* Clear terminal */
            input.value = "";
            histIndex = histlog.length;
            previousCommand = '';
        }
        else if (event.key === 'ArrowUp' && histIndex != 0) {
            event.preventDefault();
            if (histIndex > 0) {
                histIndex--;
                if (histlog[histIndex] !== undefined) {
                    input.value = histlog[histIndex];
                }
            } 
            else {
                input.value = histlog[histlog.length - 1];
                histIndex = histlog.length - 1;
            }
        }
        else if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (histIndex < histlog.length - 1) {
                histIndex++;
                if (histlog[histIndex] !== undefined) {
                    input.value = histlog[histIndex];
                }
            }
            else {
                input.value = histlog[0];
                histIndex = 0;
            }
        }
        else {
            previousCommand = input.value;
        }
    });
}
keypart();
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
            output.innerText += "(Try typing <command> -h for more details)\n\nhelp - Shows this message\nclear - Clears the console\nhide - Hides the console\nshow - Shows the console\ncolor - Changes the color of schemes of the website\necho - Display a line of text\n";
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
                                output.innerText += "color - Changes the color of schemes of the website\nUsage: color [-bg <background_color>] [-fg <foreground_color>] [...]\nOptions:\n-h - Displays this message\n[Main]:\n-bg <background_color> - Changes the background color of the website\n-fg <foreground_color> - Changes the foreground color of the website\n-bbg <button_background_color> - Changes the background color of the buttons\n-bfg <button_foreground_color> - Changes the foreground color of the buttons\n[Terminal]:\n-tbg <terminal_background_color> - Changes the background color of the terminal\n-tfg <terminal_foreground_color> - Changes the foreground color of the terminal\n-ibg <input_background_color> - Changes the background color of the input\n-ifg <input_foreground_color> - Changes the foreground color of the input\n[Console]:\n-cbg <console_background_color> - Changes the background color of the console\n-cfg <console_foreground_color> - Changes the foreground color of the console\n-ofg <output_foreground_color> - Changes the foreground color of the output\n-obg <output_background_color> - Changes the background color of the output\n";
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
                                    for(let i = 0; i < document.getElementsByTagName("header")[0].querySelectorAll("a").length;i++){
                                         document.getElementsByTagName("header")[0].querySelectorAll("a")[i].style.color = flags[colorFlags[j]];
                                    }
                                    for(let x = 0; x < document.getElementsByTagName("section").length;x++){
                                        for(let y = 0; y < document.getElementsByTagName("section")[x].querySelectorAll("p, h1, h2, h3").length;y++){
                                            document.getElementsByTagName("section")[x].querySelectorAll("p, h1, h2, h3")[y].style.color = flags[colorFlags[j]];
                                        }
                                    }
                                    output.innerText += "Foreground set to "+flags[colorFlags[j]]+"\n";
                                }
                                else{
                                    output.innerText += "Invalid flag usage:"+ colorFlags[j] + ": "+flags[colorFlags[j]]+"\n";
                                }
                                break;
                            case "-tbg":
                                if(checkClr(flags[colorFlags[j]])){
                                    document.getElementById("term-window").style.background = flags[colorFlags[j]];
                                    output.innerText += "Terminal background set to "+flags[colorFlags[j]]+"\n";
                                }
                                else{
                                    output.innerText += "Invalid flag usage:"+ colorFlags[j] + ": "+flags[colorFlags[j]]+"\n";
                                }
                                break;
                            case "-tfg":
                                if(checkClr(flags[colorFlags[j]])){
                                    output.innerText += "Terminal foreground set to "+flags[colorFlags[j]]+"\n";
                                }
                                else{
                                    output.innerText += "Invalid flag usage:"+ colorFlags[j] + ": "+flags[colorFlags[j]]+"\n";
                                }
                                break;
                            case "-cbg":
                                if(checkClr(flags[colorFlags[j]])){
                                    document.getElementById("console-window").style.background = flags[colorFlags[j]];
                                    output.innerText += "Console background set to "+flags[colorFlags[j]]+"\n";
                                }
                                else{
                                    output.innerText += "Invalid flag usage:"+ colorFlags[j] + ": "+flags[colorFlags[j]]+"\n";
                                }
                                break;
                            case "-cfg":
                                if(checkClr(flags[colorFlags[j]])){
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
                if (flags["-h"]) {
                    output.innerText += "echo - Display a line of text\nUsage: echo [-e <text>] [...]\nOptions:\n-h Displays this message\n-e <text> - Enable interpretation of backslash escapes\n-n <text> - Do not output the trailing newline\n";
                    }
                else if (flags["-n"]) {
                    output.innerText += flags["-n"].join(' ');
                    } 
                else if (flags["-e"]) {
                    output.innerText += flags["-e"].join(' ') + "\n";
                    } 
                    else{
                    output.innerText += "Unknown flag: " + currentFlag + "\n";
                }
                break;
        default:
            output.innerText += "Unknown command: " + command + "\n";
            break;
        }
    });
}
