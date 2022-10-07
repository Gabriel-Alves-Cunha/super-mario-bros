import { loadJSON } from "../loaders.js";
import AudioBoard from "../AudioBoard.js";

export function createAudioLoader(context) {
	return async function loadAudio(url) {
		return fetch(url)
			.then(res => res.arrayBuffer())
			.then(arrayBuffer => context.decodeAudioData(arrayBuffer));
	};
}

export async function loadAudioBoard(name, audioContext) {
	const loadAudio = createAudioLoader(audioContext);

	return loadJSON(`/sounds/${name}.json`).then(async audioSheet => {
		const audioBoard = new AudioBoard(audioContext);
		const fx = audioSheet.fx;
		const jobs = [];

		Object.keys(fx).forEach(name => {
			const url = fx[name].url;
			const job = loadAudio(url).then(buffer =>
				audioBoard.addAudio(name, buffer)
			);

			jobs.push(job);
		});

		return Promise.all(jobs).then(() => audioBoard);
	});
}
