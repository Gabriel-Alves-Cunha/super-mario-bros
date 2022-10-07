import PlayerController from "./traits/PlayerController.js";
import Entity from "./Entity.js";
import Player from "./traits/Player.js";

export function createPlayerEnv(playerEntity) {
	const playerControl = new PlayerController();
	const playerEnv = new Entity();

	playerControl.setPlayer(playerEntity);
	playerControl.checkpoint.set(64, 64);

	playerEnv.addTrait(playerControl);

	return playerEnv;
}

export function createPlayer(entity) {
	entity.addTrait(new Player());

	return entity;
}

export function* findPlayers(level) {
	for (const entity of level.entities) if (entity.player) yield entity;
}
