const pause = document.querySelector("#pause");
const audio = document.querySelector("audio");
const cp = document.querySelector("#current-point");
const pb = document.querySelector("#passed-bar");
const loop = document.querySelector("#loop");
let songList;
pause.addEventListener("click", () => {
	if (audio.paused) {
		audio.play();
		pause.style.backgroundImage = "url(./images/pause.svg)";
	} else {
		audio.pause();
		pause.style.backgroundImage = "url(./images/play.svg)";
	}
});
document.querySelector("#next").addEventListener("click", () => {
	songList.currentOrder++;
	songList.loadMusic();
});
document.querySelector("#pre").addEventListener("click", () => {
	songList.currentOrder--;
	songList.loadMusic();
});
loop.addEventListener("click", () => {
	const img = ["loop", "retweet"]
	loop.style.backgroundImage = `url(./images/${img[+audio.loop]}.svg)`;
	audio.loop = !audio.loop;
});
audio.addEventListener("ended", () => {
	pause.style.backgroundImage = "url(./images/play.svg)";
});
// 控制进度条的闭包
(function() {
	cp.style.left = "0px"; // 初始化对左值
	let down = false; // 是否在小圈圈内按下鼠标
	let lastX = cp.getBoundingClientRect().left; // 上一个小圈圈所在的x坐标
	const barLength = document.querySelector("#progress-bar").clientWidth; // 进度条长度
	cp.addEventListener("mousedown", () => {
		down = true; // 按下鼠标记录
		cp.classList.add("active");
	});
	document.addEventListener("mouseup", () => {
		down = false; // 松开鼠标记录
		cp.classList.remove("active");
	});
	// 如果移动了鼠标
	document.addEventListener("mousemove", (e) => {
		if (!down) return; // 未按下鼠标,返回
		let left = (parseFloat(cp.style.left) * barLength / 100 + (e.clientX - lastX - cp.clientWidth / 2)) / barLength *
			100; // 小圈圈对左的百分比
		if (left < 0 || left > 100) return; // 如果移动距离能使小圈圈超出进度条则返回
		cp.style.left = left + "%"; // 设置样式对左
		pb.style.width = left + "%";
		audio.currentTime = left * audio.duration / 100; // 将当前播放位置跳到对应位置
		lastX = cp.getBoundingClientRect().left; // 记录坐标
		e.preventDefault(); // 避免默认行为
	});
	// 小圈圈随时间前进
	audio.addEventListener("timeupdate", function() {
		cp.style.left = (this.currentTime / this.duration * 100) + "%"; // 修改样式
		pb.style.width = (this.currentTime / this.duration * 100) + "%"; // 修改样式
		lastX = cp.getBoundingClientRect().left; // 记录坐标
	});
})();

async function getMusicInfo() {
	const response = await fetch("./files/music.json");
	const songs = await response.json();
	console.log(songs);
	const obj = {
		currentOrder: 0,
		loadMusic() {
			// audio.src = songs[order].src
			// audio.src = `https://whisker_studio.gitee.io/${songs[order].src}`
			audio.src = `http://127.0.0.1/whisker_studio/${songs[this.currentOrder].src}`;
			document.querySelector("#cover").src = songs[this.currentOrder].cover;
			document.querySelector("#info").textContent = songs[this.currentOrder].name;
		}
	}
	return Promise.resolve(obj);
};
async function loadMusic() {
	songList = await getMusicInfo();
	songList.loadMusic(0);
}
window.addEventListener("load", loadMusic);
