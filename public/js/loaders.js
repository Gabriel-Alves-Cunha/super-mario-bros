import SpriteSheet from './SpriteSheet.js';
import { createAnimation } from './animation.js';

export function loadImage(url) {
	return new Promise(resolve => {
		const img = new Image();
		img.addEventListener('load', () => {
			resolve(img);
		});
		img.src = url;
	});
}

export function loadJSON(url) {
	return fetch(url).then(r => r.json());
	// if `{ r.json() }` would return nothing!!
}

export async function loadSpriteSheet(name) {
	return loadJSON(`/sprites/${name}.json`)
		.then(sheetSpec => Promise.all([
			sheetSpec,
			loadImage(sheetSpec.imgURL),
		])).then(([ sheetSpec, img ]) => {
			const sprites = new SpriteSheet(
				img,
				sheetSpec.tileWidth,
				sheetSpec.tileHeight
			);

			if (sheetSpec.tiles) {
				sheetSpec.tiles.forEach(tileSpec => {
					sprites.defineTile(
						tileSpec.name,
						tileSpec.index[ 0 ],
						tileSpec.index[ 1 ]
					);
				});
			}

			if (sheetSpec.frames) {
				sheetSpec.frames.forEach(frameSpec => {
					sprites.define(
						frameSpec.name,
						...frameSpec.rect
					);
				});
			}

			if (sheetSpec.animations) {
				sheetSpec.animations.forEach(animSpec => {
					const anim = createAnimation(
						animSpec.frames,
						animSpec.frameLen
					);

					sprites.defineAnimation(animSpec.name, anim);
				});
			}

			return sprites;
		});
}
