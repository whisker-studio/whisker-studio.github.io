/** @type {HTMLCanvasElement}*/
console.time('部署')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const squareLength = 22
const squareWidthNumber = 45
const squareHeightNumber = 27
let map,
	gameOver,
	currentPlayer,
	eachRow = []
for (let i = 0; i < squareWidthNumber; i++) {
	eachRow.push(-1)
}
canvas.width = squareLength * squareWidthNumber
canvas.height = squareLength * squareHeightNumber
canvas.style.border = '3px double #090'
const presetPlayer = [
	{
		name: 'player 1',
		color: '#6cf',
		specialTerritory: [],
	},
	{
		name: 'player 2',
		color: '#fab',
		specialTerritory: [],
	},
	{
		name: 'player 3',
		color: '#37f',
		specialTerritory: [],
	},
	{
		name: 'player 4',
		color: '#7dd',
		specialTerritory: [],
	},
	{
		name: 'player 5',
		color: '#abc',
		specialTerritory: [],
	},
	{
		name: 'player 6',
		color: '#69e',
		specialTerritory: [],
	},
	{
		name: 'player 7',
		color: '#996',
		specialTerritory: [],
	},
]
let player = []



function init() {
	currentPlayer = 0
	document.querySelector('#showCurrentPlayer').textContent = player[currentPlayer].name
	document.querySelector('#showCurrentPlayer').style.color = player[currentPlayer].color
	gameOver = false
	// map初始化
	map = []
	for (let i = 0; i < squareHeightNumber; i++) {
		map.push(eachRow.slice()) // 深度克隆
	}
	// map[0]=eachRow.map(()=>-2)
	// map[map.length-1]=eachRow.map(()=>-2)
	// map[0][10] = -2
	ctx.beginPath()
	ctx.strokeStyle = '#000'
	ctx.fillStyle = '#000'
	ctx.lineWidth = 2
	// 绘制竖线
	for (let i = 0; i < squareWidthNumber; i++) {
		ctx.moveTo(i * squareLength, 0)
		ctx.lineTo(i * squareLength, squareHeightNumber * squareLength)
	}
	// 绘制横线
	for (let i = 0; i < squareHeightNumber; i++) {
		ctx.moveTo(0, i * squareLength)
		ctx.lineTo(squareWidthNumber * squareLength, i * squareLength)
	}
	ctx.stroke()
	// 将不可用的格子涂黑
	map.forEach((row, rowi) => {
		row.forEach((sq, sqi) => {
			if (sq === -2) {
				ctx.fillRect(sqi * squareLength, rowi * squareLength, squareLength, squareLength)
			}
		})
	})
}
console.timeEnd('部署')

// 单击下棋事件
canvas.addEventListener('click', e => {
	if (gameOver) return
	let w = Math.floor((e.clientX - canvas.offsetLeft - 2) / squareLength) // 鼠标所在格子为第w列
	let h = Math.floor((e.clientY - canvas.offsetTop - 2) / squareLength) // 鼠标所在格子为第h行
	// 如果是空格
	if (map[h][w] === -1) {
		if (!checkIfBeEaten(h, w)) {
			ctx.beginPath()
			ctx.fillStyle = player[currentPlayer].color
			ctx.fillRect(w * squareLength, h * squareLength, squareLength, squareLength)
			ctx.strokeRect(w * squareLength, h * squareLength, squareLength, squareLength)
			map[h][w] = currentPlayer // 插入当前玩家的序号至map中
			checkIfEat(w, h) // 检测是否可以吃棋
			checkIfWin(w, h) // 检测是否获胜
			currentPlayer = (currentPlayer + 1) % player.length // 更新当前玩家
			document.querySelector('#showCurrentPlayer').textContent = player[currentPlayer].name
			document.querySelector('#showCurrentPlayer').style.color = player[currentPlayer].color
		}
	}
})
// 检测是否会被吃的函数
function checkIfBeEaten(h, w) {
	let up = map[h - 1] ? map[h - 1][w] : -2,
		down = map[h + 1] ? map[h + 1][w] : -2
	return [up, map[h][w + 1], down, map[h][w - 1]].every(v => v != -1)
}
// 检测是否可以吃棋的函数
function checkIfEat(w, h) {
	let arr = [
		[h - 1, w],
		[h, w + 1],
		[h + 1, w],
		[h, w - 1],
	]
	arr.forEach(v => {
		if (map[v[0]] === undefined) return
		if (checkIfBeEaten(...v) && map[h][w] !== map[v[0]][v[1]] && map[v[0]][v[1]] !== undefined) {
			map[v[0]][v[1]] = -1
			ctx.beginPath()
			ctx.clearRect(v[1] * squareLength, v[0] * squareLength, squareLength, squareLength)
			ctx.strokeRect(v[1] * squareLength, v[0] * squareLength, squareLength, squareLength)
		}
	})
}
// 检测是否获胜的函数
function checkIfWin(w, h) {
	let arr1 = [],
		arr2 = [],
		arr3 = [],
		arr4 = []
	for (let i = -3; i < 4; i++) {
		if (h + i < squareHeightNumber && h + i > 0 && w + i < squareWidthNumber && w + i > 0) arr1.push(map[h + i][w + i])
		if (h + i < squareHeightNumber && h + i > 0 && w - i < squareWidthNumber && w - i > 0) arr2.push(map[h + i][w - i])
		if (w + i < squareWidthNumber && w + i > 0) arr3.push(map[h][w + i])
		if (h + i < squareHeightNumber && h + i > 0) arr4.push(map[h + i][w])
	}
	function checkIfConnected(arr) {
		return arr.some(
			(curr, index, thisArr) =>
				curr === thisArr[index + 1] &&
				thisArr[index + 1] === thisArr[index + 2] &&
				thisArr[index + 2] === thisArr[index + 3]
		)
	}
	if (checkIfConnected(arr1) || checkIfConnected(arr2) || checkIfConnected(arr3) || checkIfConnected(arr4)) {
		alertInfo(player[currentPlayer].name + '获胜！')
		gameOver = true
	}
}
// 摁下重新开始后进行初始化
document.querySelector('#replay').addEventListener('click', () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	init()
})
