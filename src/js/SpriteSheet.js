export default class SpriteSheet {
	constructor(img, width, height) {
		this.animation = new Map();
		this.tiles = new Map();
		this.height = height;
		this.width = width;
		this.img = img;
	}

	defineAnimation(name, anim) {
		this.animation.set(name, anim);
	}

	define(name, x, y, width, height) {
		const buffers = [false, true].map(flip => {
			const buffer = document.createElement("canvas");
			buffer.height = height;
			buffer.width = width;

			const context = buffer.getContext("2d");

			if (flip) {
				context.scale(-1, 1);
				context.translate(-width, 0);
			}

			context.drawImage(this.img, x, y, width, height, 0, 0, width, height);

			return buffer;
		});

		this.tiles.set(name, buffers);
	}

	defineTile(name, x, y) {
		this.define(name, x * this.width, y * this.height, this.width, this.height);
	}

	draw(name, context, x, y, flip = false) {
		const buffer = this.tiles.get(name)[flip ? 1 : 0];

		context.drawImage(buffer, x, y);
	}

	drawTile(name, context, x, y) {
		this.draw(name, context, x * this.width, y * this.height);
	}

	drawAnimation(name, context, x, y, distance) {
		const anim = this.animation.get(name);

		this.drawTile(anim(distance), context, x, y);
	}
}
