import { ImageTileManager } from "../lib/ImageTileManager";
import * as PIXI from 'pixi.js';
import { resourceList } from '../index';
/**
 * @param {ImageTileManager} data  image data
 * @param {Array<String>} containerImage  save imageurl here
 * @param {Array<String>} containerPosition  save imagePosition here 
 */

export const loadMaterial = async (data: ImageTileManager, containerImage: Array<String>, containerPosition: Array<Object>): Promise<void> => {

	let sprite: Array<PIXI.Sprite> = [];

	for (let i = 0; i < data.images.length; ++i) {
		console.log(data.images[i]);
		sprite.push(PIXI.Sprite.from(data.images[i]));
	}

	materialToUrl(data.images, containerImage);
	spritePosition(sprite, containerPosition);

	return;
}

const materialToUrl = async (img: Array<String>, container: Array<String>): Promise<void> => {

	for (let i = 0; i < img.length; ++i) {
		container.push(resourceList[img[i].toString()]);
		//container.push(CG.Base.getAppResourceFileUrl(img[i].toString()));
	}

	return;
}

const spritePosition = async (sprite: Array<PIXI.Sprite>, container: Array<Object>): Promise<void> => {

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

	return;
}