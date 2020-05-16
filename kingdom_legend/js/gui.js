let hasSet = false,
	numberOfPlayers = 3
// 定义一个弹窗输出指定文字
function alertInfo(info, duration = '.7s') {
	document.querySelector('#showInfoField').innerHTML = info
	document.querySelector('.info').style.animation = `show ${duration} forwards`
	document.querySelector('.info').style.border = '2px dashed #fff'
}
// 摁下确定后弹窗消失
document.querySelector('.confrim').addEventListener('click', () => {
	document.querySelector('.info').style.animation = null
	document.querySelector('.info').style.border = null
})
// 开始游戏
document.querySelector('#startGame').addEventListener('click', () => {
	if (!hasSet) {
		alertInfo('请先对游戏进行设置', '.4s')
		return
	}
	// 移除初始界面
	document.querySelector('#cover').style.transform = 'translate(0,-100%)'
	// let numberOfPlayers = prompt('输入游戏人数(不输或输入-1即可直接6人版预置)') || -1
	// if (numberOfPlayers == -1) {
	// 	player = presetPlayer
	// }
	init()
})
document.querySelector('#setting').addEventListener('click', () => {
	document.querySelector('#settingBox').style.display = 'flex'
})
document.querySelector('#setNumber').addEventListener('click', () => {
	let number = document.querySelector('#numberOfPlayers').value
	if (number < 3 || number > 7) {
		alertInfo('请输入大于3小于7的游戏人数')
		return
	}
	numberOfPlayers = number
	const modifyModule = `<div class='modifyInfo'>
        <span>玩家信息：</span>
        <input type='text' class='name' placeholder='不填则为默认'>
        <input type='color' class='color'>
    </div>`
	document.querySelector('#infoSetting').innerHTML = modifyModule.repeat(numberOfPlayers)
})
document.querySelector('#setAll').addEventListener('click', () => {
	hasSet = true
	const names = Array.from(document.querySelector('#infoSetting').querySelectorAll('.name')).map(e => e.value)
	const colors = Array.from(document.querySelector('#infoSetting').querySelectorAll('.color')).map(e => e.value)
	for (let i = 0; i < numberOfPlayers; i++) {
		player.push({
			name: names[i] || presetPlayer[i].name,
			color: colors[i] && colors[i] !== '#000000' ? colors[i] : presetPlayer[i].color,
			specialTerritory: [],
		})
	}
	document.querySelector('#settingBox').style.display = null
})
