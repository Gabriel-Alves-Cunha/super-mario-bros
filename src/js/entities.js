import { loadGoomba } from "./entities/Goomba.js";
import { loadCannon } from "./entities/Cannon.js";
import { loadBullet } from "./entities/Bullet.js";
import { loadKoopa } from "./entities/Koopa.js";
import { loadMario } from "./entities/Mario.js";

/**
 * @param {AudioContext} audioContext
 * @returns
 */
export async function loadEntities(audioContext) {
	const entityFactories = {};

	const addAs = name => factory => (entityFactories[name] = factory);

	return Promise.all([
		loadCannon(audioContext, entityFactories).then(addAs("cannon")),
		loadGoomba(audioContext).then(addAs("goomba")),
		loadBullet(audioContext).then(addAs("bullet")),
		loadMario(audioContext).then(addAs("mario")),
		loadKoopa(audioContext).then(addAs("koopa")),
	]).then(() => entityFactories);
}
