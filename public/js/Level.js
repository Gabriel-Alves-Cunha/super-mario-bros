import Compositor from './Compositor.js';
import TileCollider from './TileCollider.js';
import EntityCollider from './EntityCollider.js';

export default class Level {
	constructor() {
		this.gravity = 1500;
		this.totalTime = 0;
		this.tileCollider = null;
		this.entities = new Set();
		this.comp = new Compositor();
		this.entityCollider = new EntityCollider(this.entities);
	}

	setCollisionGrid(matrix) {
		this.tileCollider = new TileCollider(matrix);
	}

	update(gameContext) {
		this.entities.forEach(entity => {
			entity.update(gameContext, this);
		});

		this.entities.forEach(entity => {
			this.entityCollider.check(entity);
		});

		this.entities.forEach(entity => {
			entity.finalize();
		});

		this.totalTime += gameContext.deltaTime;
	}
}