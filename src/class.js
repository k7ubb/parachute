class Game {
	ROTATE_SPEED_COEF = .02;

	constructor() {
		this.angle = Math.PI / 2;
		this.bullets = [];
		this.helis = [];
		this.score = 0;
	}

	random(chance) {
		return Math.floor(Math.random() * chance) === 0;
	}

	shot() {
		this.bullets.push({
			x: 150 + 40 * Math.cos(this.angle),
			y: 168 - 40 * Math.sin(this.angle),
			vx: 8 * Math.cos(this.angle),
			vy: -8 * Math.sin(this.angle),
		});
		this.score--;
		if (this.score < 0) { this.score = 0; }
	}

	rotate(deg) {
		this.angle += deg * this.ROTATE_SPEED_COEF;
		if (this.angle < 0) { this.angle = 0; }
		if (this.angle > Math.PI) { this.angle = Math.PI; }
	}

	main() {
		// ヘリの発生(乱数)
		if (this.random(60 - Math.min(this.score, 40))) {
			const way = Math.floor(Math.random() * 2);
			this.helis.push({
				x: [-50, 350][way],
				v: [1, -1][way] * (1 + Math.log(this.score + 1) / 10)
			});
		}

		// 弾の移動
		for (const bullet of this.bullets) {
			bullet.x += bullet.vx;
			bullet.y += bullet.vy;
			if (bullet.x < 0 || bullet.x > 300 || bullet.y < 0) {
				this.bullets = this.bullets.filter(_ => _ !== bullet);
			}
		}

		// ヘリの移動
		for (const heli of this.helis) {
			heli.x += heli.v;
			if (heli.x < -100 || heli.x > 400) {
				this.helis = this.helis.filter(_ => _ !== heli);
			}
		}

		$.update();
	}

}