import { Vec2 } from "./math.js";
import EventEmitter from "./EventEmitter.js";
import BoundingBox from "./BoundingBox.js";
import AudioBoard from "./AudioBoard.js";

export const Sides = {
	BOTTOM: "bottom",
	RIGHT: "right",
	LEFT: "left",
	TOP: "top",
};

export class Trait {
	constructor(name) {
		this.events = new EventEmitter();
		this.NAME = name;
		this.tasks = [];
	}

	obstruct() {}

	collides(us, them) {}

	update() {}

	queue(task) {
		this.tasks.push(task);
	}

	finalize() {
		this.tasks.forEach(task => task());
		this.tasks.length = 0;
	}
}

export default class Entity {
	constructor() {
		this.offset = new Vec2(0, 0);
		this.size = new Vec2(0, 0);
		this.pos = new Vec2(0, 0);

		this.bounds = new BoundingBox(this.pos, this.size, this.offset);

		this.audio = new AudioBoard();
		this.vel = new Vec2(0, 0);
		this.sounds = new Set();
		this.lifetime = 0;
		this.traits = [];
	}

	addTrait(trait) {
		this.traits.push(trait);
		this[trait.NAME] = trait;
	}

	update(gameContext, level) {
		this.traits.forEach(trait => trait.update(this, gameContext, level));

		this.playSounds(this.audio, gameContext.audioContext);
		this.lifetime += gameContext.deltaTime;
	}

	obstruct(side, match) {
		this.traits.forEach(trait => trait.obstruct(this, side, match));
	}

	collides(candidate) {
		this.traits.forEach(trait => trait.collides(this, candidate));
	}

	draw() {}

	finalize() {
		this.traits.forEach(trait => trait.finalize());
	}

	playSounds(audioBoard, audioContext) {
		this.sounds.forEach(name => audioBoard.playAudio(name, audioContext));

		this.sounds.clear();
	}
}
