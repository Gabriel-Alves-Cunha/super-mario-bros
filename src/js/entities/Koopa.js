import { loadSpriteSheet } from "../loaders.js";
import Entity, { Trait } from "../Entity.js";
import PendulumMove from "../traits/PendulumMove.js";
import Killable from "../traits/Killable.js";
import Physics from "../traits/Physics.js";
import Solid from "../traits/Solid.js";

export async function loadKoopa() {
	return loadSpriteSheet("koopa").then(createKoopaFactory);
}

function createKoopaFactory(sprite) {
	const walkAnimation = sprite.animation.get("walk");
	const wakeAnimation = sprite.animation.get("wake");

	function routeAnimation(koopa) {
		if (koopa.behavior.state === STATE_HIDING) {
			if (koopa.behavior.hideTime > 3)
				return wakeAnimation(koopa.behavior.hideTime);

			return "hiding";
		}

		if (koopa.behavior.state === STATE_PANIC) return "hiding";

		return walkAnimation(koopa.lifetime);
	}

	function drawKoopa(context) {
		sprite.draw(routeAnimation(this), context, 0, 0, this.vel.x < 0);
	}

	return function createKoopa() {
		const koopa = new Entity();
		koopa.size.set(16, 16);
		koopa.offset.y = 8;

		koopa.addTrait(new PendulumMove());
		koopa.addTrait(new Killable());
		koopa.addTrait(new Behavior());
		koopa.addTrait(new Physics());
		koopa.addTrait(new Solid());

		koopa.draw = drawKoopa;

		return koopa;
	};
}

const STATE_WALKING = Symbol("walking");
const STATE_HIDING = Symbol("hiding");
const STATE_PANIC = Symbol("panic");

class Behavior extends Trait {
	constructor() {
		super("behavior");

		this.state = STATE_WALKING;
		this.hideDuration = 4;
		this.panicSpeed = 300;
		this.walkSpeed = null;
		this.hideTime = 0;
	}

	collides(us, them) {
		if (us.killable.dead) return;

		if (them.stomper) {
			if (them.vel.y > us.vel.y) this.handleStomp(us, them);
			else this.handleNudge(us, them);
		}
	}

	handleNudge(us, them) {
		if (this.state === STATE_WALKING) them.killable.kill();
		else if (this.state === STATE_HIDING) this.panic(us, them);
		else {
			const impactDir = Math.sign(us.pos.x - them.pos.x);
			const travelDir = Math.sign(us.vel.x);

			if (travelDir !== 0 && travelDir !== impactDir) them.killable.kill();
		}
	}

	handleStomp(us, them) {
		if (this.state === STATE_WALKING) this.hide(us);
		else if (this.state === STATE_HIDING) {
			us.killable.kill();
			us.vel.set(100, -200);
			us.solid.obstructs = false;
		} else this.hide(us);
	}

	hide(us) {
		us.vel.x = 0;
		us.pendulumMove.enabled = false;
		if (this.walkSpeed === null) this.walkSpeed = us.pendulumMove.speed;

		this.hideTime = 0;
		this.state = STATE_HIDING;
	}

	panic(us, them) {
		us.pendulumMove.enabled = true;
		us.pendulumMove.speed = this.panicSpeed * Math.sign(them.vel.x);
		this.state = STATE_PANIC;
	}

	unhide(us) {
		us.pendulumMove.enabled = true;
		us.pendulumMove.speed = this.walkSpeed;
		this.state = STATE_WALKING;
	}

	update(us, deltaTime) {
		if (this.state === STATE_HIDING) {
			this.hideTime += deltaTime;

			if (this.hideTime > this.hideDuration) this.unhide(us);
		}
	}
}
