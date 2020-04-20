;(function () {
	let themeCss, field
	const themeSet = [
		{ set: 'a', name: 'blue' },
		{ set: 'b', name: 'green' },
		{ set: 'c', name: 'yellow' },
	]
	let currentThemeIndex = 1
	function nextMusicTheme() {
		currentThemeIndex = (currentThemeIndex + 1) % themeSet.length
		themeCss.href = `./css/theme_${themeSet[currentThemeIndex].set}.css`
		field.textContent = themeSet[currentThemeIndex].name
		field.style.fontSize = 180 / field.textContent.length + 'px'
	}
	function preMusicTheme() {
		currentThemeIndex = currentThemeIndex - 1 < 0 ? themeSet.length - 1 : currentThemeIndex - 1
		themeCss.href = `./css/theme_${themeSet[currentThemeIndex].set}.css`
		document.querySelector('#show-theme-field').textContent = themeSet[currentThemeIndex].name
		field.style.fontSize = 180 / field.textContent.length + 'px'
	}
	window.addEventListener('load', () => {
		themeCss = document.querySelector('#themeStyleSheet')
		field = document.querySelector('#show-theme-field')
		field.style.fontSize = 180 / field.textContent.length + 'px'
		document.querySelector('#next-theme').addEventListener('click', nextMusicTheme)
		document.querySelector('#pre-theme').addEventListener('click', preMusicTheme)
	})
})()
