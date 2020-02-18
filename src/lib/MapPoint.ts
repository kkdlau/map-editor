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
        if (this.sys == PointSystem.MAP) return this;
        return new MapPoint(Math.floor(this.x / 32), Math.floor(this.x / 32), PointSystem.MAP);
    }

    public toPIXISys(): MapPoint {
        if (this.sys == PointSystem.PIXI) return this;
        return new MapPoint(this.x * 32, this.y * 32);
    }

    addXY(x: number | MapPoint, y: number): MapPoint {
        x instanceof MapPoint ? y = (x as MapPoint).y : y;
        x instanceof MapPoint ? x = (x as MapPoint).x : x;
        return new MapPoint(this.x + x, this.y + y, this.sys);
    }

    distanceTo(x: number | MapPoint, y?: number): number {
        x instanceof MapPoint ? y = (x as MapPoint).y : y;
        x instanceof MapPoint ? x = (x as MapPoint).x : x;
        return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
    }
}
