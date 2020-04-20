import { loadImage } from '../loaders.js';
import SpriteSheet from '../SpriteSheet.js';

const CHARS = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

export function loadFont() {
	return loadImage('./assets/font.png')
		.then(img => {
			const fontSprite = new SpriteSheet(img);
			const size = 8;
			const rowLen = img.width;

			for (let [ index, char ] of [ ...CHARS ].entries()) {
				const x = index * size % rowLen;
				const y = Math.floor(index * size / rowLen) * size;
				fontSprite.define(char, x, y, size, size);
			}

			return new Font(fontSprite, size);
		});
}

class Font {
	constructor(sprites, size) {
		this.sprites = sprites;
		this.size = size;
	}

	print(text, context, x, y) {
		[ ...text ].forEach((char, pos) => {
			this.sprites.draw(char, context, x + pos * this.size, y);
		})
	}
}
