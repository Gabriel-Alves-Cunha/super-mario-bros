import { loadAudioBoard } from "../loaders/audio.js";
import { findPlayers } from "../player.js";
import Emitter from "../traits/Emitter.js";
import Entity from "../Entity.js";

const HOLD_FIRE_THRESHOLD = 30;

export async function loadCannon(audioContext, entityFactories) {
	return loadAudioBoard("cannon", audioContext).then(audio =>
		createCannonFactory(audio, entityFactories)
	);
}

function createCannonFactory(audio, entityFactories) {
	let dir = 1;

	function emitBullet(cannon, level) {
		for (const player of findPlayers(level)) {
			if (
				player.pos.x > cannon.pos.x - HOLD_FIRE_THRESHOLD &&
				player.pos.x < cannon.pos.x + HOLD_FIRE_THRESHOLD
			)
				return;

			if (player.pos.x < cannon.pos.x) dir = -1;
		}

		const bullet = entityFactories.bullet();

		bullet.pos.copy(cannon.pos);
		bullet.vel.set(80 * dir, 0);

		cannon.sounds.add("shoot");
		level.entities.add(bullet);
	}

	return function createCannon() {
		const cannon = new Entity();
		cannon.audio = audio;

		const emitter = new Emitter();
		//emitter.interval = 0.5; // Change how many shoots/s
		emitter.emitters.push(emitBullet);

		cannon.addTrait(emitter);

		return cannon;
	};
}
