var menu = 1;
function toggle_menu(){
	if(menu === 1){
		menu = 0;
		document.getElementById('menu-contents').style.display = 'block';
		document.getElementById('menu-btn').innerText= 'Menu v';
	}
	else{
		menu = 1;
		document.getElementById('menu-contents').style.display = 'none';
		document.getElementById('menu-btn').innerText = 'Menu >';
	}
}

