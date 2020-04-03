window.addEventListener("load", () => {
	if (window.innerWidth < 800 && /(Android)|(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
		const option = document.querySelector("#option")
		const a = option.querySelectorAll("a");
		a[0].style.marginTop = "3.125rem";
		a[0].style.backgroundImage = "url(./images/comic.svg)";
		a[1].style.backgroundImage = "url(./images/music.svg)";
		option.addEventListener("mouseenter", () => {
			for (e of a) {
				e.textContent = '';
				e.classList.add("mobileLink")
				e.style.display = "inline-block";
			}
		})
	}
})
