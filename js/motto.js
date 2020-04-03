async function getMottoInfo() {
	const date = new Date();
	const response = await fetch("./files/motto.json");
	const mottos = await response.json();
	const todayPerson = date.getDate() % mottos.length;
	const whose = mottos[todayPerson];
	const name = whose.name;
	const hourMotto = date.getHours() % whose.mottos.length;
	const motto = whose.mottos[hourMotto];
	return Promise.resolve([name, motto]);
}

async function load() {
	const motto = document.querySelector("#motto");
	const mottoInfo = await getMottoInfo();
	motto.innerHTML = `${mottoInfo[1]}<span id="person">----${mottoInfo[0]}</span>`;
}
window.addEventListener("load",load);
