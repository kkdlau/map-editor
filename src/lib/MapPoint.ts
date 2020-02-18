import * as PIXI from 'pixi.js';

enum PointSystem {
    PIXI, // PIXI系統
    MAP // 地圖座標系統
}

export class MapPoint extends PIXI.Point {

    /**
     * 創建一個點，支援用不同的系統表達數據。
     * @param x x坐標
     * @param y y坐標
     * @param sys 代表系統
     */
    constructor(x: number, y: number, public sys: PointSystem = PointSystem.PIXI) {
        super(x, y);
    }

    /**
     * 從 PIXI.Point 建立一個 MapPoint。
     * @param point 一個PIXI.Point
     */
    static fromPoint(point: PIXI.Point): MapPoint {
        return new MapPoint(point.x, point.y);
    }

    /**
     * 改變成為Tiled Map系統。
     * @return new MapPoint with tiled map system
     */
    public toMapSys(): MapPoint {
        if (this.sys === PointSystem.MAP) return this;
        return new MapPoint(Math.floor(this.x / 32), Math.floor(this.y / 32), PointSystem.MAP);
    }

    /**
     * 改變成為pixi系統。
     * @return new MapPoint with pixi system
     */
    public toPIXISys(): MapPoint {
        if (this.sys === PointSystem.PIXI) return this;
        return new MapPoint(this.x * 32, this.y * 32);
    }

    /**
     * 偏移本來的座標。
     * @param x the offset of x coordinate
     * @param y the offset of y coordinate
     */
    addXY(x: number | MapPoint, y: number): MapPoint {
        if (x instanceof MapPoint) {
            y = (x as MapPoint).y;
            x = (x as MapPoint).x;
        }
        return new MapPoint(this.x + x, this.y + y, this.sys);
    }

    /**
     * 計算本點和目標點的距離。
     * @param x 目標點的x座標，或者是一個點
     * @param y 目標點的y座標
     */
    distanceTo(x: number | MapPoint, y?: number): number {
        if (x instanceof MapPoint) {
            y = (x as MapPoint).y;
            x = (x as MapPoint).x;
        }
        return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
    }
}
