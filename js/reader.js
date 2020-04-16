const s = location.search
	.slice(1)
	.split('&')
	.map(e => e.slice(e.indexOf('=') + 1))
let comics
async function loadImg() {
	const response = await fetch('./files/comic.json')
	comics = await response.json()
	const comicLen = comics[s[0]][s[1]]
	for (let i = 0; i < comicLen; i++) {
		num = i < 10 ? '0' + i : i
		let img = document.createElement('img')
		img.width = screen.width * window.imgWidth
		img.src = `https://whisker_studio.gitee.io/comic/${s[0] + s[1] + num}.webp`
		document.querySelector('main').appendChild(img)
	}
}

function next() {
	s[1] -= -1
	if (+s[1] + 1 > comics[s[0]].length) {
		if (+s[0] + 2 > comics.length) {
			s[1] -= 1
			return
		}
		s[0] -= -1
		s[1] = 0
	}
	location.search = 'a=' + s[0] + '&b=' + s[1]
}

function pre() {
	s[1] -= 1
	if (+s[1] < 0) {
		if (+s[0] - 1 < 0) {
			s[1] -= -1
			return
		}
		s[0] -= 1
		s[1] = comics[s[0]].length - 1
	}
	location.search = 'a=' + s[0] + '&b=' + s[1]
}

function ifToTop() {
	if (scrollY >= 50) {
		document.querySelector('#backToTop').style.display = 'block'
	} else {
		document.querySelector('#backToTop').style.display = 'none'
	}
}

document.querySelector('#leftArr').addEventListener('click', pre)
document.querySelector('#rightArr').addEventListener('click', next)
window.addEventListener('scroll', ifToTop)
