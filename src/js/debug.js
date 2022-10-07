export function setupMouseControl(canvas, entity, cam) {
	let lastEvent;

	["mousedown", "mousemove"].forEach(eventName =>
		canvas.addEventListener(eventName, event => {
			if (event.buttons === 1) {
				entity.vel.set(0, 0);
				entity.pos.set(event.offsetX + cam.pos.x, event.offsetY + cam.pos.y);
			} else if (
				event.buttons === 2 &&
				lastEvent &&
				lastEvent.buttons === 2 &&
				lastEvent.type === "mousemove"
			)
				cam.pos.x -= event.offsetX - lastEvent.offsetX;

			lastEvent = event;
		})
	);

	canvas.addEventListener("contextmenu", e => e.preventDefault());
}
