import { ImageTileManager } from "../lib/ImageTileManager";
import * as PIXI from 'pixi.js';
import { resourceList, editorResourceList } from '../index';
/**
 * @param {ImageTileManager} data  image data
 * @param {Array<String>} containerImage  save imageurl here
 * @param {Array<String>} containerPosition  save imagePosition here 
 */


export const loadMaterial = async (data: ImageTileManager, containerImage: Array<String>, containerPosition: Array<Object>): Promise<void> => {
	
	return new Promise<void>(resolve => {
		let sprite: Array<PIXI.Sprite> = [];
		editorResourceList.forEach((e) => {
			sprite.push(PIXI.Sprite.from(e));
		});

		materialToUrl(containerImage);
		spritePosition(sprite, containerPosition);

		resolve();
	});
}

const materialToUrl = async (container: Array<String>): Promise<void> => {
	return new Promise<void>(resolve => {
		editorResourceList.forEach((e) => {
			container.push(e);
		});
		resolve();
	});
}

const spritePosition = async (sprite: Array<PIXI.Sprite>, container: Array<Object>): Promise<void> => {
	return new Promise<void>(resolve => {
		for (let i = 0; i < sprite.length; ++i) {
			const height: number = sprite[i].height / 32;
			const width: number = sprite[i].width / 32;
			for (let h = 0; h < height; h++) {
				for (let w = 0; w < width; w++) {

					let data: object = {
						imgIdx: i,
						imgTop: -32 * h,
						imgLeft: -32 * w,
					};

					container.push(data);
				}
			}
		}
		resolve();
	});
}