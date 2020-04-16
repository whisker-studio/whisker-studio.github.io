let themes = document.querySelectorAll('.theme')
let sizes = document.querySelectorAll('.size')
themes.forEach((theme, thiskey) => {
	theme.addEventListener('click', () => {
		localStorage.setItem('theme', theme.dataset.theme)
		localStorage.setItem('themeKey', thiskey)
		themes.forEach((theme, key) => {
			if (key != thiskey) {
				theme.style.border = '5px solid #bdc3c7'
			}
		})
		setTheme()
	})
})
sizes.forEach((size, thiskey) => {
	size.addEventListener('click', () => {
		localStorage.setItem('width', size.dataset.size)
		localStorage.setItem('sizeKey', thiskey)
		sizes.forEach((size, key) => {
			if (key != thiskey) {
				size.style.border = '2px dashed #bdc3c7'
			}
		})
		setSize()
	})
})
