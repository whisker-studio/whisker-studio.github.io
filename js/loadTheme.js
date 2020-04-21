function setTheme() {
	document.querySelector('body').style.backgroundColor = localStorage.getItem('theme')
	if (localStorage.getItem('theme') == '#34495e') {
		document.body.style.color = '#fff'
	} else {
		document.body.style.color = '#000'
	}
	document.querySelector(`.theme:nth-child(${+localStorage.getItem('themeKey') + 1})`).style.border =
		'5px solid #fbc531'
}

function setSize() {
	if (localStorage.getItem('sizeKey') === '') localStorage.setItem('sizekey', 1)
	document.querySelector(`.size:nth-child(${+localStorage.getItem('sizeKey') + 1})`).style.border = '2px dashed #fbc531'
	document.querySelector('main').classList = localStorage.getItem('width') || 'normal'
}
window.onload = () => {
	setSize()
	setTheme()
	loadImg()
}
