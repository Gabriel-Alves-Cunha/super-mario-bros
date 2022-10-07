import { ground } from "./tiles/ground.js";
import { brick } from "./tiles/brick.js";
import TileResolver from "./TileResolver.js";

const handlers = { brick, ground };

export default class TileCollider {
	constructor(tileMatrix) {
		this.tiles = new TileResolver(tileMatrix);
	}

	checkY(entity) {
		let y;
		if (entity.vel.y > 0) y = entity.bounds.bottom;
		else if (entity.vel.y < 0) y = entity.bounds.top;
		else return;

		const matches = this.tiles.searchByRange(
			entity.bounds.left,
			entity.bounds.right,
			y,
			y
		);

		matches.forEach(match => this.handle(1, entity, match));
	}

	checkX(entity) {
		let x;
		if (entity.vel.x > 0) x = entity.bounds.right;
		else if (entity.vel.x < 0) x = entity.bounds.left;
		else return;

		const matches = this.tiles.searchByRange(
			x,
			x,
			entity.bounds.top,
			entity.bounds.bottom
		);

		matches.forEach(match => this.handle(0, entity, match));
	}

	handle(index, entity, match) {
		const _handlers = handlers[match.tile.type];
		if (_handlers) _handlers[index](entity, match);
	}
}
