import * as PIXI from 'pixi.js';

enum PointSystem {
    PIXI,
    MAP
}

export class MapPoint extends PIXI.Point {

    constructor(x: number, y: number, public sys: PointSystem = PointSystem.PIXI) {
        super(x, y);
    }

    static fromPoint(point: PIXI.Point): MapPoint {
        return new MapPoint(point.x, point.y);
    }

    public toMapSys(): MapPoint {
        return new MapPoint(Math.floor(this.x / 32), Math.floor(this.x / 32), PointSystem.MAP);
    }

    public toPIXISys(): MapPoint {
        return new MapPoint(this.x * 32, this.y * 32);
    }

    addXY(x: number, y: number): MapPoint {
        return new MapPoint(this.x + x, this.y + y, this.sys);
    }
}
