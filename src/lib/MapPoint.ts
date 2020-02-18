import * as PIXI from 'pixi.js';

enum PointSystem {
    PIXI,
    MAP
}

export class MapPoint extends PIXI.Point {

    /**
     * Create a point with different system.
     * 
     * @param x the x coordinate
     * @param y the y coordinate
     * @param sys the representing system
     */
    constructor(x: number, y: number, public sys: PointSystem = PointSystem.PIXI) {
        super(x, y);
    }

    /**
     * 從 PIXI.Point 建立一個 MapPoint。
     * 
     * @param point 一個PIXI.Point
     */
    static fromPoint(point: PIXI.Point): MapPoint {
        return new MapPoint(point.x, point.y);
    }

    /**
     * 改變成為Tiled Map系統。
     * 
     * @return new MapPoint with tiled map system
     */
    public toMapSys(): MapPoint {
        if (this.sys == PointSystem.MAP) return this;
        return new MapPoint(Math.floor(this.x / 32), Math.floor(this.x / 32), PointSystem.MAP);
    }

    /**
     * 改變成為pixi系統。
     * 
     * @return new MapPoint with pixi system
     */
    public toPIXISys(): MapPoint {
        if (this.sys == PointSystem.PIXI) return this;
        return new MapPoint(this.x * 32, this.y * 32);
    }

    addXY(x: number | MapPoint, y: number): MapPoint {
        if (x instanceof MapPoint) {
            y = (x as MapPoint).y;
            x = (x as MapPoint).x;
        }
        return new MapPoint(this.x + x, this.y + y, this.sys);
    }

    distanceTo(x: number | MapPoint, y?: number): number {
        if (x instanceof MapPoint) {
            y = (x as MapPoint).y;
            x = (x as MapPoint).x;
        }
        return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
    }
}
