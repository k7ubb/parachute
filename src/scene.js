"use strict";

const gameScene = () => {
	const GAME_SCREEN_W = 810;
	const GAME_SCREEN_H = 540;
	const GAME_SCREEN_X = (900 - GAME_SCREEN_W) / 2;
	const GAME_SCREEN_Y = 100;

	const game = new Game();

	$.reset();
	
	$.addItem({
		draw: () => {
			$.ctx.bbFill({rect: [0, 0, 900, GAME_SCREEN_Y]}, "#fff");
			$.ctx.bbFill({rect: [0, 0, GAME_SCREEN_X, 1600]}, "#fff");
			$.ctx.bbFill({rect: [GAME_SCREEN_X + GAME_SCREEN_W, 0, GAME_SCREEN_X, 1600]}, "#fff");
			$.ctx.bbFill({rect: [0, GAME_SCREEN_Y + GAME_SCREEN_H, 900, 1600 - GAME_SCREEN_Y - GAME_SCREEN_H]}, "#fff");
		}
	});

	$.addItem(new Controller(
		{x: 450, y: 1100},
		300,
		() => game.shot(),
		(deg) => game.rotate(deg)
	));
	
	$.draw = () => {
		$.ctx.save();
		$.ctx.translate(GAME_SCREEN_X, GAME_SCREEN_Y);
		$.ctx.scale(GAME_SCREEN_W / 300, GAME_SCREEN_H / 200);
		$.ctx.bbFill({rect: [0, 0, 300, 200]}, "#fff");
		$.ctx.bbStroke({rect: [0, 0, 300, 200]}, {color: "#999", width: 1});
		
		// 砲台
		$.ctx.bbFill({rect: [132, 170, 36, 20]}, "#000");
		$.ctx.bbFill({rect: [114, 180, 72, 20]}, "#000");
		$.ctx.bbFill({center: {x: 150, y: 168}, radius: 18}, "#000");
		$.ctx.bbStroke({points: [
			[150, 168],
			[150 + 30 * Math.cos(game.angle), 168 - 30 * Math.sin(game.angle)]
		]}, {color: "#000", width: 8});

		// 弾
		for (const bullet of game.bullets) {
			$.ctx.bbFill({rect: [bullet.x - 2, bullet.y - 2, 4, 4]}, "#000");
		}
		
		// ヘリ
		// 1: 本当はheli.yを定義しておく
		for (const heli of game.helis) {
			if (heli.v > 0) {
				$.ctx.drawImage(images.heli[0], heli.x - 16, 1 * 20);
			} else{
				$.ctx.drawImage(images.heli[1], heli.x - 16, 1 * 20);
			}
		}

		$.ctx.bbText(("00" + game.score).slice(-3), 2, 0, {color: "#000", size: 24, font: "DotGothic16"});

		$.ctx.restore();
	};

	$.update();

	const main = () => {
		game.main();
		setTimeout(main, 1000 / 30);
	};
	main();
};
