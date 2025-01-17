import * as PIXI from 'pixi.js';

const physicsVisualization: number[] = [
    0x65cf81,
    0x7d7d7d,
    0xcf6565,
    0x6764cc
];

export class TileSprite extends PIXI.Sprite {

    constructor(texture: PIXI.Texture, public r: number | string, public i: number, public layer: number) {
        super(texture);
    }

    static highestLayer(sprite: TileSprite[]): number {
        let highest: number = 0;
        for (let i = sprite.length - 1; i >= 0; --i) {
            if (sprite[i].layer > highest) highest = sprite[i].layer;
        }

        return highest;
    }

    toPhysicsTile(): PhysicsTile {
        let phyTile: PhysicsTile = new PhysicsTile(this.layer);
        phyTile.interactive = true;
        phyTile.position = this.position;
        return phyTile;
    }
}

export class PhysicsTile extends PIXI.Graphics {
    private _layer: number;

    constructor(layer: number) {
        super();
        this.layer = layer;
    }

    private updateColor(): void {
        this.clear();
        let layer: number = this.layer + 1;
        let color: number;
        if (layer % 1 === 0) {
            color = physicsVisualization[layer];
        } else {
            color = (physicsVisualization[Math.ceil(layer)] + physicsVisualization[Math.floor(layer)]) / 2;
        }
        this.lineStyle(3, color, 1);
        this.beginFill(0xFFFFFF, 0.2);
        this.drawRect(2, 2, 28, 28);
        this.endFill();
    }

    public get layer(): number {
        return this._layer;
    }

    public set layer(layer: number) {
        this._layer = layer;
        this.updateColor();
    }
}