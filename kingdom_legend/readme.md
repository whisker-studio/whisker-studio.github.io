# 战国传奇 Kingdom Legend

这是一款极具乐趣的趣味小游戏，在游戏中，你可以找到童年的乐趣。

## 游戏规则

## 操作提示

1. 进入首页![first](.\aboutMD\first.jpg)

2. 点击`游戏设置` 进行游戏设置![second](.\aboutMD\second.jpg)

3. 设置游戏人数(3 ≦游戏人数≦7),设置完毕后点击`保存人数` 以加载其余依赖于游戏人数的设置

	> **必须先保存人数设置再确定**,否则游戏内是默认的3位玩家

4. 设置玩家详细信息![fourth](.\aboutMD\fourth.jpg)
  - 玩家名称 如果不填则会根据顺序为`player n`
  - 玩家强调色(如果不填则会使用预置的7种颜色)

5. 进入游戏界面后![fifth](.\aboutMD\fifth.jpg)
  - 左侧为主要的游戏区域,点击相应格子即可落棋
  - 右侧状态框对应功能依次为
	  - 游戏名称
	   - 当前待下棋玩家信息
	   - 弹出修改信息的框
	   - 重新开始游戏

## 内部原理

> 这里只展示了部分功能的原理,省略了细节

> 通过一个二维数组将每个格子作为一个数据，修改后映射到Canvas画布上

数组中的数据为以下几种:

- `0` - `6` : 七个玩家的序号
- `-1` : 空格
- `-2` : 死格
- `-3` : 传送格
- `-20` - `-14` : 玩家基地格,为 `玩家序号-20`

第一轮放置基地时,在空格内放置玩家基地格序号

检测是否胜出通过检测各个对应位置的值是否等于当前放置格的值

```javascript
// 检测是否获胜的函数
function checkIfWin(w, h) {
	let arr1 = [],
		arr2 = [],
		arr3 = [],
		arr4 = []
	for (let i = -3; i < 4; i++) {
		if (h + i < squareHeightNumber &&
            h + i > 0 && w + i < squareWidthNumber &&
            w + i > 0) arr1.push(map[h + i][w + i])
		if (h + i < squareHeightNumber &&
            h + i > 0 &&
            w - i < squareWidthNumber &&
            w - i > 0) arr2.push(map[h + i][w - i])
		if (w + i < squareWidthNumber &&
            w + i > 0) arr3.push(map[h][w + i])
		if (h + i < squareHeightNumber &&
            h + i > 0) arr4.push(map[h + i][w])
	}
	function checkIfConnected(arr) {
		return arr.some(
			(curr, index, thisArr) =>
				curr === thisArr[index + 1] &&
				thisArr[index + 1] === thisArr[index + 2] &&
				thisArr[index + 2] === thisArr[index + 3]
		)
	}
	if (checkIfConnected(arr1) ||
        checkIfConnected(arr2) ||
        checkIfConnected(arr3) ||
        checkIfConnected(arr4)) {
		gameOver = true
	}
}
```

`arr1` `arr2` `arr3` `arr4` 为四个数组分别代表着四个方向上的值：斜下方，斜上方，水平方向，竖直方向

在这一段位置中，只要有一小段是相连的且数值相同，则判定为赢，game over！

落棋前检测当前位置是否能放，当检测当前放置格为空格(-1)时,将该位置改为玩家序号，如果是死格或者放入会被吃，则无效落棋

``` javaScript
if (map[h][w] === -1) {
	if (!checkIfBeEaten(h, w)) {
		// code...
	}
}
```

落棋后检测当前棋子落下是否会吃掉其他棋子

``` javascript
// 检测是否会被吃的函数
function checkIfBeEaten(h, w) {
	if (map[h][w] < -1 && map[h][w] > -14) return // 防止吃掉非空功能格
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
		if (
			map[v[0]][v[1]] !== -1 &&
            // 确认不是空格(不在checkIfBeEaten中做检测是因为防止往围起来的中间放所导致的Bug)
			map[v[0]][v[1]] !== undefined && // 确认不是边缘
			map[h][w] !== map[v[0]][v[1]] && // 确认不是同色棋
			checkIfBeEaten(...v)
		) {
			// code...
		}
	})
}
```

`arr` 为当前落棋位置四周的坐标的集合数组,通过做同色棋检测，以及对特殊情况的判断来控制

如果当前放置格的四周有基地格,则该格的值-20变为基地格,同时将四周等于原先值的格子连接为基地格

## 版本日志

- v0.1 Alpha内测版
	- 此版本为内部人员测试使用
	- 版本主要更新内容 ：
		- HTML结构上`h1` `h2` `canvas` 三部分,以此为大标题,胜利说明,游戏区域
		- JS上:
			1. 定义了一个二维数组表示格子, `-1` 为空格, `-2` 为死格, `0及以上` 为游戏玩家
			2. 加入了检测方式检测是否胜利
- v0.1.1 Alpha内测版
	- 修复Bug: 疏忽一种情况
	- 去除冗余代码
- v0.2 Alpha内测版
	- 修复Bug: 无法胜利
	- 修复Bug: Flex布局拉伸canvas,使用了绝对定位
	- 修改页面样式
	- 轻量化代码
	- 工程化项目
	- 增加弹出框显示以及平滑动画
	- 可方便地重新开始游戏
	- 修复Bug: 检测机制错误
- v0.3 Alpha内测版
	- 初步实现吃棋(最后一个是异色棋,且四周包围)
	- 加大线条对比度
	- 简易自定义人数和颜色
- v0.4 Alpha内测版
	- 加入开始界面
	- 大量美化界面
	- 内部架构改动
	- 对游戏进行高级设置
- v0.4.1 Alpha内测版
	- 修改开始界面背景并更改搭配颜色
- v0.5 Alpha内测版
	- 修复Bug: 人数可能异常
	- 修复Bug: 可以吃掉功能格
	- 实现吃掉后增加机会且最多增加3次机会的机制
	- 修改弹出信息以及实现自适应名称大小
	- 大量修改并完善布局,更加兼容!
	- 去除英文小标题
	- 增加`关于游戏` 的界面(该README文档)

