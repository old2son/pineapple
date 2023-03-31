import { randomIntFromRange, randomFloatFromRange } from './randomRange';

export default onmessage = (e) => {
	const { body, leaf, bodyStart, leafStart, canvasWidth, type } = JSON.parse(e.data);

	if (type === 'setPos') {
		const randomX = randomIntFromRange(-bodyStart.x + 50, canvasWidth - 250);
		const stepX = randomX;
		const stepY = randomFloatFromRange(-10, 0);
		const myMap = (arr: []) => {
			return new Promise<void>((resolve, reject) => {
				arr.map((item: { cx: number; cy: number; ex: number; ey: number; }) => {
					item.cx += stepX;
					item.cy += stepY;
					item.ex += stepX;
					item.ey += stepY;
				});
				resolve();
			});
		}

		const pBody = myMap(body).then(() => {
			bodyStart.x += stepX;
			bodyStart.y += stepY;
		});

		const pLeaf = myMap(leaf).then(() => {
			leafStart.x += stepX;
			leafStart.y += stepY;
		});

		Promise.all([pBody, pLeaf]).then(() => {
			postMessage(
				JSON.stringify({
					body,
					leaf,
					bodyStart,
					leafStart,
				})
			);
		});
	}
};