function toD(str) {
	const map = "jmn5bci6lfgh_apqrst1 89uvwxyz027odek34";
	let strArr = [...str];
	let randomPlace = Math.floor(Math.random() * strArr.length);
	let randomNum = Math.floor(Math.random() * 17 + 30);
	let arr = [randomPlace < 10 ? "0" + randomPlace : randomPlace];
	for (let i = 0; i < strArr.length; i++) {
		let value = strArr[i];
		let v = map.indexOf(value.toLowerCase());
		if (value != value.toLowerCase()) v += map.length;
		v = v + 16 ^ 10;
		if (v < 10) v = "0" + v;
		if (i == randomPlace) {
			arr.push(randomNum < 10 ? "0" + randomNum : randomNum);
		}
		arr.push(v);
	}
	return arr.join("");
}

function toS(str) {
	const map = "jmn5bci6lfgh_apqrst1 89uvwxyz027odek34";
	str = str;
	let strArr = [...str],
		arr = [];
	let randomWhere = str.slice(0, 2);
	for (let i = 2; i < strArr.length; i += 2) {
		if (i == randomWhere * 2 + 2) continue;
		let up = false;
		let va = ((strArr[i] + strArr[i + 1]) ^ 10) - 16;
		if (va > map.length) {
			up = true;
			va -= map.length;
		}
		let v = map[va];
		if (up) v = v.toUpperCase();
		arr.push(v);
	}
	return arr.join("");
}
