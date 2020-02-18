import * as PIXI from 'pixi.js';
import { mapViewer, resources } from '../';

export class ImageTileManager {
    collections: PIXI.Texture[][] = [];

    /**
     * 建立一個圖片切割及圖片管理器。
     * 
     * @param {string[]} images 圖片的url
     */
    constructor(public images: string[]) { };

    async loadTexture(): Promise<void> {
        await new Promise(r => {
            this.images.forEach(async (e: string, i: number): Promise<void> => {
                let mapTexture: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.from(e));
                let collection: PIXI.Texture[] = [];
                let height: number = mapTexture.height;
                let width: number = mapTexture.width;
                for (let y: number = 0; y < height; y += 32) {
                    for (let x: number = 0; x < width; x += 32) {
                        collection.push(new PIXI.Texture(PIXI.BaseTexture.from(resources[e], new PIXI.Rectangle(x, y, 32, 32))));
                    }
                }
                this.collections.push(collection);
            });
            r();
        });
    }
}

