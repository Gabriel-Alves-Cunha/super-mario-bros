import EntityCollider from "./EntityCollider.js";
import TileCollider from "./TileCollider.js";
import Compositor from "./Compositor.js";

export default class Level {
	constructor() {
		this.comp = new Compositor();
		this.entities = new Set();
		this.tileCollider = null;
		this.gravity = 1500;
		this.totalTime = 0;

		this.entityCollider = new EntityCollider(this.entities);
	}

	setCollisionGrid(matrix) {
		this.tileCollider = new TileCollider(matrix);
	}

	update(gameContext) {
		this.entities.forEach(entity => entity.update(gameContext, this));

		this.entities.forEach(entity => this.entityCollider.check(entity));

		this.entities.forEach(entity => entity.finalize());

		this.totalTime += gameContext.deltaTime;
	}
}
