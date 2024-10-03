"use strict";

const gameScene = () => {
	const GAME_SCREEN_W = 810;
	const GAME_SCREEN_H = 540;
	const GAME_SCREEN_X = (900 - GAME_SCREEN_W) / 2;
	const GAME_SCREEN_Y = 100;

	const game = new Game();
	let gameoverFlg = false;
	let isPaused = false;

	$.reset();
	
	$.addItem({
		draw: () => {
			const path = new Path2D();
			const points = [
				[GAME_SCREEN_X, GAME_SCREEN_Y],
				[GAME_SCREEN_X, GAME_SCREEN_Y + GAME_SCREEN_H],
				[GAME_SCREEN_X + GAME_SCREEN_W, GAME_SCREEN_Y + GAME_SCREEN_H],
				[GAME_SCREEN_X + GAME_SCREEN_W, GAME_SCREEN_Y]
			];
			const radius = 8;
			path.rect(0, 0, 900, 1600);
			path.moveTo(points[0][0] + radius, points[0][1]);
			path.arc(points[0][0] + radius, points[0][1] + radius, radius, Math.PI * 1.5, Math.PI, true);
			path.lineTo(points[1][0], points[1][1] - radius);
			path.arc(points[1][0] + radius, points[1][1] - radius, radius, Math.PI, Math.PI * .5, true);
			path.lineTo(points[2][0] - radius, points[2][1]);
			path.arc(points[2][0] - radius, points[2][1] - radius, radius, Math.PI * .5, 0, true);
			path.lineTo(points[3][0], points[3][1] + radius);
			path.arc(points[3][0] - radius, points[3][1] + radius, radius, 0, Math.PI * 1.5, true);
			$.ctx.fillStyle = "#fff";
			$.ctx.fill(path, "evenodd");
			$.ctx.bbStroke({rect: [GAME_SCREEN_X, GAME_SCREEN_Y, GAME_SCREEN_W ,GAME_SCREEN_H], radius}, {width: 2, color: "#999"});
		}
	});

	const [pauseButton] = $.addItem({
		path: {
			center: {x: 120, y: 750},
			radius: 70
		},
		draw: function() {
			$.ctx.bbStroke(this.path, {color: "#999", width: 2});
			$.ctx.bbText("PAUSE", 120, 750, {size: 25, align: "center", baseline: "middle", color: "#999"});
		},
		onHover: function() {
			$.ctx.bbFill(this.path, "rgba(0 0 0 / .1)");
		},
		onClick: () => {
			isPaused = !isPaused;
			controller.disabled = isPaused;
			$.update();
		}
	});

	const [controller] = $.addItem(new Controller(
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
		for (const heli of game.helis) {
			if (heli.v > 0) {
				$.ctx.drawImage(images.heli[0], heli.x - 16, heli.y - 10);
			} else{
				$.ctx.drawImage(images.heli[1], heli.x - 16, heli.y - 10);
			}
		}

		// 人
		for (const person of game.people) {
			$.ctx.drawImage(images.person, person.x - 12, person.y - 12);
		}

		$.ctx.bbText(("000" + game.score).slice(-4), 2, 0, {color: "#000", size: 24, font: "DotGothic16"});

		if (gameoverFlg) {
			$.ctx.bbFill({rect: [48, 60, 204, 80]}, "#000");
			$.ctx.bbFill({rect: [50, 62, 200, 76]}, "#fff");
			$.ctx.bbText("GAME OVER", 150, 90, {color: "#000", size: 24, align: "center", baseline: "alphabetic", font: "DotGothic16"});
			$.ctx.bbText("SCORE: " + ("000" + game.score).slice(-4), 150, 130, {color: "#000", size: 28, align: "center", baseline: "alphabetic", font: "DotGothic16"});
		}
		if (isPaused) {
			$.ctx.bbFill({rect: [80, 60, 140, 76]}, "#000");
			$.ctx.bbFill({rect: [82, 62, 136, 72]}, "#fff");
			$.ctx.bbText("PAUSE", 150, 114, {color: "#000", size: 40, align: "center", baseline: "alphabetic", font: "DotGothic16"});
		}

		$.ctx.restore();
	};

	$.update();

	const main = () => {
		if (!isPaused && (gameoverFlg = game.main())) {
			controller.disabled = true;
			pauseButton.disabled = true;
			$.update();
		} else {
			setTimeout(main, 1000 / 30);
		}
	};
	main();
};
