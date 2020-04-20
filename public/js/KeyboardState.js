const PRESSED = 1;
const RELEASED = 0;

export default class KeyboardState {
	constructor() {
		// store the state of a key
		this.keyStates = new Map();

		// store the callback fn for a key
		this.keyMap = new Map();
	}

	addMapping(code, callback) {
		this.keyMap.set(code, callback);
	}

	handleEvent(event) {
		event.preventDefault();

		const { code } = event;

		if (!this.keyMap.has(code)) return false;

		const keyState = event.type === 'keydown' ? PRESSED : RELEASED;

		if (this.keyStates.get(code) === keyState) return;

		this.keyStates.set(code, keyState);

		this.keyMap.get(code)(keyState);
	}

	listenTo(window) {
		[ 'keydown', 'keyup' ].forEach(eventName => {
			window.addEventListener(eventName, e => {
				this.handleEvent(e);
			});
		});
	}
}