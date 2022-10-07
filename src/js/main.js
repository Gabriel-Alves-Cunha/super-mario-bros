import { createPlayerEnv, createPlayer } from "./player.js";
import { createCollisionLayer } from "./layers/collision.js";
import { createDashboardLayer } from "./layers/dashboard.js";
import { createLevelLoader } from "./loaders/level.js";
import { setupKeyboard } from "./input.js";
import { loadEntities } from "./entities.js";
import { loadFont } from "./loaders/font.js";
import Camera from "./Camera.js";
import Timer from "./Timer.js";

/**
 * @param {HTMLCanvasElement} canvas
 */
async function main(canvas) {
	const context = canvas.getContext("2d");
	const audioContext = new AudioContext();

	const [entityFactory, font] = await Promise.all([
		loadEntities(audioContext),
		loadFont(),
	]);

	const loadLevel = await createLevelLoader(entityFactory);
	const level = await loadLevel("1-1");

	const cam = new Camera();

	const mario = createPlayer(entityFactory.mario());

	const playerEnv = createPlayerEnv(mario);
	level.entities.add(playerEnv);

	level.comp.layers.push(createCollisionLayer(level));
	level.comp.layers.push(createDashboardLayer(font, playerEnv));

	const gameContext = {
		audioContext,
		deltaTime: null,
	};

	const input = setupKeyboard(mario);
	input.listenTo(window);

	const timer = new Timer();
	timer.update = function update(deltaTime) {
		gameContext.deltaTime = deltaTime;
		level.update(gameContext); // This order!

		cam.pos.x = Math.max(0, mario.pos.x - 100);

		level.comp.draw(context, cam);
	};

	timer.start();
}

const canvas = document.getElementById("screen");

const start = () => {
	window.removeEventListener("click", start);
	console.time("start");
	main(canvas);
	console.timeEnd("start");
};

window.addEventListener("click", start);
