import { loadSpriteSheet } from '../loaders.js';
import Entity, { Trait } from '../Entity.js';
import PendulumMove from '../traits/PendulumMove.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';
import Killable from '../traits/Killable.js';

export async function loadGoomba() {
	return loadSpriteSheet('goomba').then(createGoombaFactory);
}

function createGoombaFactory(sprite) {
	const walkAnimation = sprite.animation.get("walk");

	function routeAnimation(goomba) {
		if (goomba.killable.dead) return 'flat';

		return walkAnimation(goomba.lifetime);
	}

	function drawGoomba(context) {
		sprite.draw(routeAnimation(this), context, 0, 0);
	};

	return function createGoomba() {
		const goomba = new Entity();
		goomba.size.set(16, 16);

		goomba.addTrait(new Physics());
		goomba.addTrait(new Solid());
		goomba.addTrait(new PendulumMove());
		goomba.addTrait(new Behavior());
		goomba.addTrait(new Killable());

		goomba.draw = drawGoomba;

		return goomba;
	};
}

class Behavior extends Trait {
	constructor() {
		super('behavior');
	}

	collides(us, them) {
		if (us.killable.dead) return;

		if (them.stomper) {
			if (them.vel.y > us.vel.y) {
				us.killable.kill();
				us.pendulumMove.speed = 0;
			} else them.killable.kill();
		}
	}
}
