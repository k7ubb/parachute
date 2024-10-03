const IS_SMARTPHONE = "ontouchstart" in window;

const sleep = t => new Promise(resolve => setTimeout(resolve, t));

const loadImage = async (path) => {
	const img = new Image();
	return new Promise(
		(resolve) => {
			img.src = path;
			img.onload = () => resolve(img);
		}
	);
};

const images = {};
const lib = new AutoresizeCanvas(document.getElementById("game"), 900, 1600);
const $ = new ItemsCanvas(lib.context, lib.getMouseCoordinates, lib.isScaledPointInPath);
lib.onResize = () => $.update();

(async () => {
	images.heli = [
		await loadImage("heli1.png"),
		await loadImage("heli2.png")
	];
 	images.person = await loadImage("person.png");
	gameScene();
})();
