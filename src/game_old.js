"use strict";

const gameScene = () => {
	$.reset();
	
	let ang = Math.PI / 2;	// 砲台の角度

	// 弾, ヘリコプター, 人
	const bul = new Array(40).fill().map(() => ({en: false, x: 0, y: 0, vx: 0, vy: 0}));
	const heli = new Array(3).fill().map(() => ({en: false, x: 0, y: 0}));
	const person = new Array(20).fill().map(() => ({en: false, x: 0, y: 0, v: 0}));
	
	let vcont = 8;
	
	let posx = (420 - 300) / 2;
	let posy = 10;
	
	let centerx = 420 / 2;
	let centery = 316;
		
	let score = 0;
	let score_saved = false;
	let pause = false;
	let rankingview = 0;
	let gameover = false;

	// 前フレームのマウス位置
	let mouselx = undefined;
	let mousely = undefined;
	ranking.sort(function(a,b){return b[1] - a[1];})
	
	// scoreに依存する値
	const fheli = () => 60 - Math.min(score, 40);
	const fperson = () => 300 - Math.min(score*2, 180);
	const vheli = () => 1 + Math.log(score+1)/10;

	const distance = (o1, o2, i) => {
		if(i !== undefined){ return (o1.x-o2.x)*(o1.x-o2.x) + (o1.y-i*10+5)*(o1.y-i*10+5); }
		return (o1.x-o2.x)*(o1.x-o2.x) + (o1.y-o2.y)*(o1.y-o2.y);
	};

	const buttons = [
		new Item({
			rect: [20, 300, 24, 90],
			draw: function() {
				$.ctx.bbFill(new Path({rect: [30, 304, 4, 90]}), "#999");
				$.ctx.bbFill(new Path({rect: [24, 304 + vcont * 10 - 4, 16, 8]}), "#f00");
			},
			onClick: function() {
				vcont = ($.mouseY - 300) / 10;
			}
		}),
		new Item({
			rect: [42, 412, 70, 24],
			draw: function() {
				$.ctx.bbText("PAUSE", 42, 412, {color: "#000", size: 22});
				$.ctx.bbFill(new Path({rect: [14, 436, 136, 2]}), "#000");
			},
			onHover: function() {
				$.ctx.bbText("PAUSE", 42, 412, {color: "#999", size: 22});
				$.ctx.bbFill(new Path({rect: [14, 436, 136, 2]}), "#999");
			},
			onClick: function() {
				pause = !pause;
			}
		}),
		new Item({
			rect: [420 - 130, 412, 100, 24],
			draw: function() {
				$.ctx.bbText("RANKING", 420 - 130, 412, {color: "#000", size: 22});
				$.ctx.bbFill(new Path({rect: [420 - 150, 436, 136, 2]}), "#000");
			},
			onHover: function() {
				$.ctx.bbText("RANKING", 420 - 130, 412, {color: "#999", size: 22});
				$.ctx.bbFill(new Path({rect: [420 - 150, 436, 136, 2]}), "#999");
			},
			onClick: function() {
				rankingview = rankingview? 0:1;
			}
		})
	];

	const controller = [
		new Item({
			path: new Path({center: {x: centerx, y: centery}, radius: 100}),
			draw: function() {
				$.ctx.bbFill(new Path({center: {x: centerx, y: centery}, radius: 100}), "#999");
				$.ctx.bbFill(new Path({center: {x: centerx, y: centery}, radius: 99}), "#fff");
			}
		}),
		new Item({
			path: new Path({center: {x: centerx, y: centery}, radius: 38}),
			draw: function() {
				$.ctx.bbFill(new Path({center: {x: centerx, y: centery}, radius: 38}), "#999");
				$.ctx.bbFill(new Path({center: {x: centerx, y: centery}, radius: 37}), "#fff");
			},
			onClick: function() {
					// Lib.key(32)も
					let i = 0; for (; i < 39 && bul[i].en; i++);
					bul[i].en = true;
					bul[i].x = 150 + 40 * Math.cos(ang);
					bul[i].y = 168 - 40 * Math.sin(ang);
					bul[i].vx = 8 * Math.cos(ang);
					bul[i].vy = -8 * Math.sin(ang);
					score--;
					if (score < 0) { score = 0; }
			}
		}),
	];

	$.addItem(buttons);
	$.addItem(controller);
	
	const main = () => {
		if (gameover == false && pause == false && rankingview == false) {
//			if(Lib.key(37, 1)){ ang+=.15; }
//			if(Lib.key(39, 1)){ ang-=.15; }
			const moused = Math.sqrt(($.mouseX-centerx)**2 + ($.mouseY-centery)**2);

			if ($.isMousePress && moused > 38 && moused < 100) {
				if (mouselx === undefined) {
					mouselx = $.mouseX - 160;
					mousely = $.mouseY - 316;
				}
				else{
					let x = $.mouseX - centerx;
					let y = $.mouseY - centery;
					let atan = Math.atan((x*mousely-y*mouselx) / (x*mouselx+y*mousely));
					let deg = atan *180 / Math.PI;
					mouselx = x;
					mousely = y;
					ang += deg * (10 - vcont) / 200;
				}
			}
			if (ang < 0) { ang = 0; }
			if (ang > Math.PI) { ang = Math.PI; }

			if (!$.isMousePress){
				mouselx = mousely = undefined;
			}
						
			// ヘリの発生(乱数)
			if (Math.floor(Math.random() * fheli()) === 0) {
				let i = 0; for (; i < 3 && heli[i].en; i++);
				if (i != 3) {
					let f = Math.floor(Math.random() * 2);
					heli[i].en = true;
					heli[i].x = f * 400 - 50;
					heli[i].v = -(f * 2 - 1) * vheli();
				}
			}

			// 人の発生(乱数)
			for (let i = 0; i < 3; i++) {
				if (heli[i].en) {
					if (Math.floor(Math.random()*fperson()) === 0 && heli[i].x > 23 && heli[i].x < 143) {
						let j = 0; for(; j<19 && person[j].en; j++);
						person[j].en = true;
						person[j].x = Math.floor(heli[i].x/16) * 16;
						person[j].y = i * 10;
						person[j].v = 1;
					}
				}
			}
			
			// 弾の移動・消失処理
			for (let i = 0; i < 20; i++) {
				if (bul[i].en) {
					bul[i].x += bul[i].vx;
					bul[i].y += bul[i].vy;
					if (bul[i].x < 0 || bul[i].x > 300 || bul[i].y < 0) {
						bul[i].en = false;
					}
				}
			}

			// ヘリの移動・消失処理
			for (let i = 0; i < 3; i++) {
				if (heli[i].en) {
					heli[i].x += heli[i].v;
					if (heli[i].x < -100 || heli[i].x > 400) {
						heli[i].en = false;
					}
				}
			}

			// 人の移動・消失処理
			for (let i = 0; i < 20; i++) {
				if (person[i].en && person[i].v) {
					person[i].y += person[i].v;
					var dy = 188;
					for (let j = 0; j < 20; j++) {
						if (i != j && person[i].x == person[j].x && person[j].v == 0) {
							dy -= 12;
						}
					}
					if (person[i].y > dy) {
						person[i].y = dy; person[i].v = 0;
						if (person[i].x == 128 || person[i].x == 180) {
//							alert("GAME OVER");
							gameover = true;
						} else {
							let k = 0;
							for (let j = 0; j < 20; j++) {
								if (person[j].en && person[j].v == 0) { k++; }
							}
							if (k > 3) {
//								alert("GAME OVER");
								gameover = true;
							}
						}
					}
				}
			}
			
			// あたり判定
			for (let i = 0; i < 40; i++) {
				for (let j = 0; j < 20; j++) {
					if (bul[i].en && person[j].en && distance(bul[i], person[j]) < 100) {
						bul[i].en = person[j].en = false;
						score += 4;
					}
				}
				for (let j = 2; j > -1; j--) {
					if (bul[i].en && heli[j].en && distance(bul[i], heli[j], j) < 100) {
						bul[i].en = heli[j].en = false;
						score += 3;
					}
				}
			}
		}
		
		$.update();

		setTimeout(main, 1000 / 60);
	};
	main();
	
	$.draw = () => {
		// ドット絵風にするため、1/2倍のピクセルで描画していた
		$.ctx.save();
		$.ctx.translate(posx, posy);
		$.ctx.bbFill(new Path({rect: [0, 0, 300, 200]}), "#fff");

		for (let i = 0; i < 3; i++) {
			if (heli[i].en) {
				if (heli[i].v > 0) {
					$.ctx.drawImage(heli_img[0], heli[i].x - 16, i * 20);
				} else{
					$.ctx.drawImage(heli_img[1], heli[i].x - 16, i * 20);
				}
			}
		}
		for (let i = 0; i < 20; i++) {
			if (person[i].en) {
				$.ctx.drawImage(person_img, person[i].x - 12, person[i].y - 12);
			}
		}

		// 砲台
		$.ctx.bbFill(new Path({rect: [132, 170, 36, 20]}), "#000");
		$.ctx.bbFill(new Path({rect: [114, 180, 72, 20]}), "#000");
		$.ctx.bbFill(new Path({center: {x: 150, y: 168}, radius: 18}), "#000");
		$.ctx.bbStroke(new Path({points: [
			[150, 168],
			[150 + 30 * Math.cos(ang), 168 - 30 * Math.sin(ang)]
		]}), "#000", 8);

		// 弾
		for (let i = 0; i < 20; i++) {
			if (bul[i].en) {
				$.ctx.bbFill(new Path({rect: [Math.round(bul[i].x) - 2, Math.round(bul[i].y) - 2, 4, 4]}), "#000");
			}
		}
		$.ctx.bbText(("0000" + score).slice(-4), 2, 0, {color: "#000", size: 24});

		if (pause) {
			$.ctx.bbFill(new Path({rect: [80, 60, 140, 76]}), "#000");
			$.ctx.bbFill(new Path({rect: [82, 62, 136, 72]}), "#fff");
			$.ctx.bbText("PAUSE", 94, 72, {color: "#000", size: 40});
		}

		if (gameover) {
			$.ctx.bbFill(new Path({rect: [48, 60, 204, 80]}), "#000");
			$.ctx.bbFill(new Path({rect: [50, 62, 200, 76]}), "#fff");
			$.ctx.bbText("GAME OVER", 54, 52, {color: "#000", size: 24});
			$.ctx.bbText("SCORE:" + ("0000" + score).slice(-4), 54, 100, {color: "#000", size: 28});
/*
			if(score > Number(ranking[ranking.length-1][1]) && score_saved == false){
				Lib.color = "#000";
				Lib.fillRect(40, 72, 86, 24);
				Lib.color = "#fff";
				Lib.fillRect(41, 73, 84, 22);
				Lib.color = "#000";
				Lib.font = "15px";
				if(Lib.mouse(mouse_command, posx+40*2, posy+72*2, 86*2, 24*2)){
					Lib.color = "#000";
					Lib.fillRect(41, 73, 84, 22);
					Lib.color = "#fff";
				}
				if(Lib.mouse("short_click", posx+40*2, posy+72*2, 86*2, 24*2)){
					var name = prompt("名前を入力してください");
					if(name){
						ranking[ranking.length] = [name, ("0000" + score).slice(-4)];
						ranking.sort(function(a,b){return b[1] - a[1];})
						score_saved = true;
						var req = new XMLHttpRequest();
						req.open("get", "save.cgi?data=" + JSON.stringify([name, ("0000" + score).slice(-4)]));
						req.send();
						req.onload = function(){ alert("保存しました"); }
					}
				}
				Lib.drawString(45, 74, "SAVE SCORE");
			}
*/
}
		if (rankingview) {
			$.ctx.bbFill(new Path({rect: [28, 28, 244, 140]}), "#000");
			$.ctx.bbFill(new Path({rect: [30, 30, 240, 136]}), "#fff");
			$.ctx.bbText("RANKING", 54, 52, {color: "#000", size: 24});
/*
			Lib.font = "15px";
			for(var i=0; i<3; i++){
				Lib.drawString(17, 36+15*i, (i+rankingview*3-2 + ":"));
//				Lib.drawString(34, 36+15*i, ranking[i][0]);
				Lib.drawString(98, 36+15*i, ranking[i+rankingview*3-3][1]);
			}
			
			Lib.color = "#000";
			Lib.fillRect(14, 85, 14, 14);
			Lib.color = "#fff";
			Lib.fillRect(15, 86, 12, 12);
			if(Lib.mouse(mouse_command, posx+14*2, posy+85*2, 14*2, 14*2)){
				Lib.color = "#000";
				Lib.fillRect(15, 86, 12, 12);
				Lib.color = "#fff";
			}
			else{ Lib.color = "#000"; }
			if(Lib.mouse("short_click", posx+14*2, posy+85*2, 14*2, 14*2)){
				rankingview--;
				if(rankingview==0){ rankingview = 1; }
			}
			Lib.font = "PixelMplus12 14px";
			Lib.drawString(14, 85, "▲");
			
			Lib.color = "#000";
			Lib.fillRect(30, 85, 14, 14);
			Lib.color = "#fff";
			Lib.fillRect(31, 86, 12, 12);
			if(Lib.mouse(mouse_command, posx+30*2, posy+85*2, 14*2, 14*2)){
				Lib.color = "#000";
				Lib.fillRect(31, 86, 12, 12);
				Lib.color = "#fff";
			}
			else{ Lib.color = "#000"; }
			if(Lib.mouse("short_click", posx+30*2, posy+85*2, 14*2, 14*2)){
				rankingview++;
				if(rankingview==Math.ceil(ranking.length/3)){ rankingview--; }
			}
			Lib.font = "PixelMplus12 14px";
			Lib.drawString(30, 85, "▼");
*/
		}
		if (!rankingview && (pause || gameover)) {
			$.ctx.bbFill(new Path({rect: [84, 8, 132, 48]}), "#000");
			$.ctx.bbFill(new Path({rect: [86, 10, 128, 44]}), "#fff");
/*
			Lib.color = "#000";
			Lib.font = "15px";
			if(Lib.mouse(mouse_command, posx+32*2, posy+4*2, 66*2, 24*2)){
				Lib.color = "#000";
				Lib.fillRect(42, 4, 66, 24);
				Lib.color = "#fff";
			}
			Lib.drawString(54, 6, "RESET");
			if(Lib.mouse("short_click", posx+32*2, posy+4*2, 66*2, 24*2)){
				if(confirm("リセットしますか?")){ Lib.moveScene("game"); return; }
			}
*/
		}
		
		$.ctx.restore();
/*
		// ランキング 名前表示のみここに書いた
		Lib.color = "#000";
		Lib.font = "PixelMplus12 30px";
		if(rankingview){
			for(var i=0; i<3; i++){
				Lib.drawString(34*2+posx, (38+15*i)*2+posy, ranking[i+rankingview*3-3][0]);
			}
		}
		if(rankingview){ Lib.twoColor(0); }
*/

		$.ctx.bbFill(new Path({rect: [0, 0, 420, posy]}), "#eee");
		$.ctx.bbFill(new Path({rect: [0, posy + 200, 420, 400 - posy]}), "#eee");
		$.ctx.bbFill(new Path({rect: [0, posy, posx, 200]}), "#eee");
		$.ctx.bbFill(new Path({rect: [posx + 300, posy, posx, 200]}), "#eee");
	};
};
