const linkContainers = document.querySelectorAll('.linkField')
async function loadLink() {
	const response = await fetch('./files/comic.json')
	const comics = await response.json()
	comics.forEach((e, i) => {
		let linkArr = e.map((link, j) => `<li><a href="./comic_reader.html?a=${i}&b=${j}">Chapter ${j + 1}</a></li>`)
		linkContainers[i].innerHTML = `<span>章节目录:</span><ul>${linkArr.reduce((c, e) => c + e)}</ul>`
	})
}
loadLink()
