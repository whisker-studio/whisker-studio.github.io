const pause = document.querySelector("#pause");
const audio = document.querySelector("audio");
const cp = document.querySelector("#current-point");
cp.style.left = "0px";
pause.addEventListener("click", function() {
	if (audio.paused) {
		audio.play();
		this.style.backgroundImage = "url(./images/pause.svg)";
	} else {
		audio.pause();
		this.style.backgroundImage = "url(./images/play.svg)";
	}
})
audio.addEventListener("timeupdate", function() {
	cp.style.left = (this.currentTime / this.duration * 100) + "%";
});

(function() {
	let down = false;
	let lastX = cp.getBoundingClientRect().left;
	const barLength = document.querySelector("#progress-bar").clientWidth;
	cp.addEventListener("mousedown", () => down = true);
	document.addEventListener("mouseup", () => down = false);
	document.addEventListener("mousemove", (e) => {
		if (!down) return;
		let left = (parseFloat(cp.style.left) * barLength / 100 + (e.clientX - lastX)) / barLength * 100;
		if (left < 0 || left > 100) return;
		cp.style.left = left + "%";
		audio.currentTime = left * audio.duration / 100;
		lastX = e.clientX;
		e.preventDefault()
	})
})();
