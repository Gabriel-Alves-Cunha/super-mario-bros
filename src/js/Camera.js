import { Vec2 } from "./math.js";

export default class Camera {
	constructor() {
		this.size = new Vec2(256, 224);
		this.pos = new Vec2(0, 0);
	}
}
