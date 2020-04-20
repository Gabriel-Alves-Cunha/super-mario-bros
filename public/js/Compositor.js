export default class Compositor {
	constructor() {
		this.layers = []; // Function[]
	}

	draw(context, camera) {
		this.layers.forEach(layer => {
			layer(context, camera);
		});
	}
}