function setTheme() {
	document.querySelector("body").style.backgroundColor = localStorage.getItem("theme");
	if (localStorage.getItem("theme") == "#34495e") {
		document.body.style.color = "#fff";
	} else {
		document.body.style.color = "#000";
	}
	document.querySelector(`.theme:nth-child(${+localStorage.getItem("themeKey")+1})`).style.border = "5px solid #fbc531";
}

function setSize() {
	window.imgWidth = localStorage.getItem("width") || ".5";
	document.querySelector(`.size:nth-child(${+localStorage.getItem("sizeKey")+1})`).style.border = "2px dashed #fbc531";
}
window.onload = () => {
	setSize();
	setTheme();
};
