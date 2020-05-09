/** @type {HTMLCanvasElement}*/
console.time('部署')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const squareLength = 15
const squareWidthNumber = 50
const squareHeightNumber = 50
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
let player = [
	{
		name: 'player 1',
		color: '#f00',
	},
	{
		name: 'player 2',
		color: '#0f0',
	},
	{
		name: 'player 2',
		color: '#00f',
	},
]
function init() {
	currentPlayer = 0
	gameOver = false
	map = []
	for (let i = 0; i < squareHeightNumber; i++) {
		map.push(eachRow.slice()) // 深度克隆
	}
	// 绘制竖线
	for (let i = 0; i < squareWidthNumber; i++) {
		ctx.moveTo(i * squareLength, 0)
		ctx.lineTo(i * squareLength, squareHeightNumber * squareLength)
	}
	// 绘制横线
	for (let i = 0; i < squareHeightNumber; i++) {
		ctx.moveTo(0, i * squareLength)
		ctx.lineTo(squareWidthNumber * squareLength, i * squareLength)
		// console.log(i*squareLength,squareWidthNumber*squareLength)
	}
	ctx.stroke()
	// 将不可用的格子涂黑
	map.forEach((row, rowi) => {
		row.forEach((sq, sqi) => {
			if (sq === -2) {
				// ctx.moveTo()
				// ctx.moveTo((sqi+1)*squareLength,rowi*squareLength)
				ctx.fillRect(sqi * squareLength, rowi * squareLength, squareLength, squareLength)
			}
		})
	})
}
init()
console.timeEnd('部署')
// 单击下棋事件
canvas.addEventListener('click', e => {
	if (gameOver) return
	let w = Math.floor((e.clientX - canvas.offsetLeft - 2) / squareLength) // 鼠标所在格子为第w列
	let h = Math.floor((e.clientY - canvas.offsetTop - 2) / squareLength) // 鼠标所在格子为第h行
	if (map[h][w] === -1) {
		// 如果是空格
		ctx.beginPath()
		ctx.fillStyle = player[currentPlayer].color
		ctx.fillRect(w * squareLength, h * squareLength, squareLength, squareLength)
		map[h][w] = currentPlayer
		checkIfWin(w, h)
		currentPlayer = (currentPlayer + 1) % player.length
	}
})

function checkIfWin(w, h) {
	let arr1 = [],
		arr2 = [],
		arr3 = [],
		arr4 = []
	for (let i = -3; i < 4; i++) {
		if (h + i < squareHeightNumber && h + i > 0 && w + i < squareWidthNumber && w + i > 0) arr1.push(map[h + i][w + i])
		if (h - i < squareHeightNumber && h + i > 0 && w - i < squareWidthNumber && w - i > 0) arr2.push(map[h + i][w - i])
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
		document.querySelector('#showInfoField').textContent = player[currentPlayer].name + ' wins!'
		document.querySelector('.info').style.animation = 'show .7s forwards'
		gameOver = true
	}
}
document
	.querySelector('.confrim')
	.addEventListener('click', () => (document.querySelector('.info').style.animation = null))
document.querySelector('#replay').addEventListener('click', () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	init()
})
