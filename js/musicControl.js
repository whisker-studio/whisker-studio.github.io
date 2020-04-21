// ================================================================
// 初始化的一些量
const pause = document.querySelector('#pause')
const audio = document.querySelector('audio')
const playMode = document.querySelector('#play-mode')
const vol = document.querySelector('#volumn-control-bar')
let songList,
	albumList,
	rotateDeg = 0
audio.volume = 0.75
// ================================================================

// ================================================================
// 初始化函数
async function init() {
	// 初始化播放模式
	playMode.modeIndex = 1
	// initMusic
	songList = await controlList()
	songList.loadMusic()
	// initCover
	albumList = await getAlbumInfo()
	songList.showList()
}
// ================================================================

// ================================================================
// 闭包
// 控制音量的闭包
;(function () {
	let volMemory = 0 // 记录静音/取消静音前的音量
	vol.parentElement.addEventListener('click', function (e) {
		if (e.target !== this) return // 如果只是调节大小,弹出该函数
		;[volMemory, vol.value] = [vol.value, volMemory] // 交换当前音量和上一次音量
		updateVol()
	})
	vol.addEventListener('change', updateVol) // 音量滑块改变了就更改音量
	vol.addEventListener('mousemove', updateVol) // 移动了也更改音量
	document.addEventListener('keydown', e => {
		switch (e.keyCode) {
			case 38:
				vol.value -= -5
				e.preventDefault()
				break
			case 40:
				vol.value -= 5
				e.preventDefault()
				break
		}
		updateVol()
	})
	// 更新函数
	function updateVol() {
		if (volMemory && !audio.volume) volMemory = 0
		audio.volume = vol.value / 100
		vol.parentElement.style.backgroundImage = `url(./images/vol_${Math.ceil(vol.value / 25)}.svg)` // 根据音量选择图片
	}
})()
// 控制进度条的闭包
;(function () {
	const cp = document.querySelector('#current-point') // current point
	const pb = document.querySelector('#passed-bar') // passed bar
	cp.style.left = '0px' // 初始化对左值
	let down = false // 是否在小圈圈内按下鼠标
	let lastX = cp.getBoundingClientRect().left // 上一个小圈圈所在的x坐标
	const barLength = document.querySelector('#progress-bar').clientWidth // 进度条长度
	cp.addEventListener('mousedown', () => {
		down = true // 按下鼠标记录
		cp.classList.add('active')
	})
	document.addEventListener('mouseup', () => {
		down = false // 松开鼠标记录
		cp.classList.remove('active')
	})
	// 如果移动了鼠标
	document.addEventListener('mousemove', changeProgress)
	// 小圈圈随时间前进
	audio.addEventListener('timeupdate', function () {
		if (!audio.paused) document.querySelector('#cover').style.transform = `rotate(${++rotateDeg}deg)`
		cp.style.left = (this.currentTime / this.duration) * 100 + '%' // 修改样式
		pb.style.width = (this.currentTime / this.duration) * 100 + '%' // 修改样式
		lastX = cp.getBoundingClientRect().left // 记录坐标
	})
	cp.parentElement.addEventListener('click', e => {
		down = true // 按下鼠标记录
		changeProgress(e)
		down = false
	})

	function changeProgress(e) {
		if (!down) return // 未按下鼠标,返回
		let left =
			(((parseFloat(cp.style.left) * barLength) / 100 + (e.clientX - lastX - cp.clientWidth / 2)) / barLength) * 100 // 小圈圈对左的百分比
		if (left < 0 || left > 100) return // 如果移动距离能使小圈圈超出进度条则返回
		cp.style.left = left + '%' // 设置样式对左
		pb.style.width = left + '%'
		audio.currentTime = (left * audio.duration) / 100 // 将当前播放位置跳到对应位置
		lastX = cp.getBoundingClientRect().left // 记录坐标
		e.preventDefault() // 避免默认行为
	}
})()
// ================================================================

// ================================================================
// 音乐的主控函数
// 暂停音乐
function pauseOrPlay() {
	if (audio.paused) {
		audio.play()
		pause.style.backgroundImage = 'url(./images/pause.svg)'
	} else {
		audio.pause()
		pause.style.backgroundImage = 'url(./images/play.svg)'
	}
}
// 上一首
function pre() {
	songList.currentIndex = songList.currentIndex <= 0 ? songList.songsLength - 1 : songList.currentIndex - 1
	songList.loadMusic()
	audio.play()
	pause.style.backgroundImage = 'url(./images/pause.svg)'
}
// 下一首
function next() {
	if (playMode.modeIndex == 1) {
		songList.currentIndex = (songList.currentIndex + 1) % songList.songsLength
	} else {
		songList.currentIndex = Math.floor(Math.random() * songList.songsLength)
	}
	songList.loadMusic()
	audio.play()
	pause.style.backgroundImage = 'url(./images/pause.svg)'
}

// 播放模式切换
playMode.addEventListener('click', () => {
	const mode = ['loop', 'retweet', 'random']
	playMode.modeIndex = (playMode.modeIndex + 1) % mode.length
	playMode.querySelector('i').classList = 'iconfont icon-' + mode[playMode.modeIndex]
	audio.loop = !playMode.modeIndex
})
// 循环情况下的切换歌曲
audio.addEventListener('ended', () => {
	if (!songList.songsLength) {
		audio.currentTime = 0
		pause.style.backgroundImage = 'url(./images/play.svg)'
		return
	}
	if (playMode.modeIndex == 1) {
		songList.currentIndex = (songList.currentIndex + 1) % songList.songsLength
	} else {
		songList.currentIndex = Math.floor(Math.random() * songList.songsLength)
	}
	songList.loadMusic()
	audio.play()
})
// ================================================================

// ================================================================
// 控制数据的接口
// 控制歌单
function controlList() {
	// songs:关于歌单内歌曲的信息
	let songs = [
		{
			name: 'Koala',
			singner: 'Whisker',
			cover: 'rescue_koala.jpg',
			src: 'koala.mp3',
		},
		{
			name: 'Push Away',
			singner: 'Whisker',
			cover: 'push_away.jpg',
			src: 'push_away.mp3',
		},
	] // 这个数组是初始化后歌单内的歌曲
	const list = document.querySelector('#current-songs') // 这里是需要渲染歌单数据的List容器
	// 管理歌曲列表的对象
	const songList = {
		currentIndex: 0, // 当前的歌曲所在的索引值
		songsLength: songs.length, // 歌单总长度
		// 渲染待播放歌曲的信息
		loadMusic() {
			rotateDeg = 0 // 专辑旋转度数调零
			audio.src = songs[this.currentIndex].abs
				? songs[this.currentIndex].src
				: `https://whisker_studio.gitee.io/music/songs/${songs[this.currentIndex].src}` // 更新音乐地址
			document.querySelector('#cover').src = `https://whisker_studio.gitee.io/music/cover/${songs[this.currentIndex].cover}` // 加载专辑封面
			document.querySelector('#info').textContent = `${songs[this.currentIndex].name} - ${
				songs[this.currentIndex].singner
			}` // 输出歌曲信息(歌名 - 歌手)
		},
		// 向歌单中添加歌曲
		addMusic(arr) {
			songs.push(...arr)
			this.songsLength = songs.length
		},
		// 渲染歌单到容器内的函数
		showList() {
			const list = songs
				.map(
					v => `<div class="song-item">
						<span title="${v.name}">${v.name}</span>
							<div class="btn-box">
								<span class="iconfont icon-play">
								</span><span class="iconfont icon-del"></span>
							</div>
					</div>`
				)
				.join('')
			document.querySelector('#current-songs').innerHTML = list
		},
		// 播放单首歌曲
		play(index) {
			this.currentIndex = index
			this.loadMusic()
			audio.play()
			pause.style.backgroundImage = 'url(./images/pause.svg)'
		},
		// 从歌单内删除单个歌曲
		del(index) {
			list.removeChild(list.children[index])
			songs.splice(index, 1)
			this.songsLength = songs.length
			if (index <= this.currentIndex) {
				this.currentIndex--
			}
		},
	}
	return Promise.resolve(songList) // 返回控制闭包内部数据的接口(管理歌曲列表的对象)
}
// 控制专辑
async function getAlbumInfo() {
	// 异步抓取专辑数据
	const response = await fetch('./files/album-list.json')
	const albums = await response.json()
	const coverList = document.querySelector('#cover-list') // 渲染专辑的容器
	// 渲染
	for (let i = 0; i < albums.length; i++) {
		document.querySelector('#cover-list').innerHTML += `
		<div class="cover-item"><img src='https://whisker_studio.gitee.io/music/cover/${albums[i].src}'></div>
		`
	}
	const imgs = Array.from(coverList.querySelectorAll('img'))
	// 委派事件
	coverList.addEventListener('click', e => {
		if (imgs.includes(e.target)) {
			songList.addMusic(albumList.getSongs(imgs.indexOf(e.target)))
			songList.showList()
		}
	})
	// 获取专辑信息的接口对象
	const music = {
		getSongs: index => albums[index].songs,
	}
	return Promise.resolve(music) // 返回接口
}
// ================================================================

document.querySelector('#current-songs').addEventListener('click', e => {
	const { target } = e
	if (target.classList[0] == 'iconfont') {
		songList[target.classList[1].slice(5)](
			Array.from(document.querySelectorAll('.' + target.classList[1])).indexOf(e.target)
		)
	}
})
// ================================================================
// 绑定监听事件
// 绑定初始化加载事件
window.addEventListener('load', init)
pause.addEventListener('click', pauseOrPlay)
document.querySelector('#pre').addEventListener('click', pre)
document.querySelector('#next').addEventListener('click', next)
document.addEventListener('keydown', e => {
	switch (e.keyCode) {
		case 32:
			pauseOrPlay()
			e.preventDefault()
			break
		case 37:
			pre()
			e.preventDefault()
			break
		case 39:
			next()
			e.preventDefault()
			break
	}
})
// ================================================================
