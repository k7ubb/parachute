class Game {
	ROTATE_SPEED_COEF = .02;

	constructor() {
		this.angle = Math.PI / 2;
		this.bullets = [];
		this.helis = [];
		this.people = [];
		this.score = 0;
	}

	random(chance) {
		return Math.floor(Math.random() * chance) === 0;
	}

	shot() {
		this.bullets.push({
			x: 150 + 40 * Math.cos(this.angle),
			y: 168 - 40 * Math.sin(this.angle),
			vx: 12 * Math.cos(this.angle),
			vy: -12 * Math.sin(this.angle),
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
		let gameoverFlg = false;
		const distance = (a, b) => (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);

		// ヘリの発生(乱数)
		if (this.random(30 - Math.min(this.score, 20)) && this.helis.length < 3) {
			const way = Math.floor(Math.random() * 2);
			this.helis.push({
				x: [-50, 350][way],
				y: Math.floor(Math.random() * 3 + 1) * 20,
				v: [1, -1][way] * (1 + Math.log(this.score + 1) / 10) * 2
			});
		}

		// 人の発生
		for (const heli of this.helis) {
			if (this.random(150 - Math.min(this.score * 2 , 90)) && heli.x > 46 && heli.x < 286) {
				this.people.push({
					x: Math.floor(heli.x / 16) * 16,
					y: heli.y,
					v: 2
				});
			}
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

		// 人の移動
		for (const person of this.people) {
			if (!person.v) { continue; }
			person.y += person.v;
			let y = 188;
			for (const person_ of this.people) {
				if (person.x === person_.x && person_.v === 0) {
					y -= 24;
				}
			}
			if (person.y > y) {
				person.y = y;
				person.v = 0;
				if (person.x >= 128 && person.x <= 176) {
					gameoverFlg = true;
				}
				if (this.people.filter(people => people.v === 0).length > 3) {
					gameoverFlg = true;
				}
			}
		}

		// あたり判定
		for (const bullet of this.bullets) {
			for (const heli of this.helis) {
				if (distance(bullet, heli) < 100) {
					this.bullets = this.bullets.filter(_ => _ !== bullet);
					this.helis = this.helis.filter(_ => _ !== heli);
					this.score += 4;
				}
			}
			for (const person of this.people) {
				if (distance(bullet, person) < 100) {
					this.bullets = this.bullets.filter(_ => _ !== bullet);
					this.people = this.people.filter(_ => _ !== person);
					this.score += 3;
				}
			}
		}

		$.update();
		return gameoverFlg;
	}

}