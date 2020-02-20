import { TileSprite, PhysicsTile } from './TileSprite';
import { MapPoint } from './MapPoint';
import { shortcutManager } from './ShortcutManager';
import { ImageTileManager } from './ImageTileManager';
import { DraggingChecker } from './DraggingCheck';
import { Key } from './key';
import * as PIXI from 'pixi.js';

interface MapData {
    rows: number,
    tiles: Object,
    objects: Object,
    rsrcs: Object,
    tileW: number,
    cols: number,
    tileH: number,
    layers: Array<Object>
}

export interface Tile {
    r: string,
    i: number,
    layer?: number
}

export enum Click {
    LEFT,
    RIGHT
}

export class EditableMap extends PIXI.Container {
    private _tile: PIXI.Container = new PIXI.Container(); // 地圖圖片
    private physicsLayer: PIXI.Container = new PIXI.Container(); // 用於顯示地圖物理佈局
    private _showPhysics: boolean = false;
    private _editableTile: Map<string, TileSprite[]> = new Map<string, TileSprite[]>();
    private _editablePhysics: Map<string, PhysicsTile> = new Map<string, PhysicsTile>();
    private _hoverGraphics: PIXI.Graphics;
    private _lastCursorPos: PIXI.Point;
    private _startDrag: MapPoint;
    private _draggingChecker: DraggingChecker;
    private _draggingArea: PIXI.Graphics = new PIXI.Graphics();

	/**
	 * 當格子被按下時，要呼叫的function。
	 * 
	 * @param {number} x 被按下格子的x
	 * @param {number} y 被按下格子的y
	 */
    public onClick: (x: number, y: number, clickType: Click) => void = null;

	/**
	 * 拖動動作結束時會被呼叫的function。
	 * 
	 * @param {number} x1 起始拖動點的x坐標
	 * @param {number} y1 起始拖動點的y坐標
	 * @param {number} x2 結束拖動點的x坐標
	 * @param {number} y2 結束拖動點的y坐標
	 */
    public onDrag: (x1: number, y1: number, x2: number, y2: number) => void = null;

    constructor(public imageSet: ImageTileManager, public mapWidth: number, public mapHeight: number, public groundTile: Tile, data?: MapData) {
        super();
        this._draggingChecker = new DraggingChecker(this);
        this.cursor = 'none';
        this.addChild(this._tile);
        this._hoverGraphics = new PIXI.Graphics();
        this._hoverGraphics.beginFill(0xFFFFFF, 0.5)
            .lineStyle(3, 0xFFFFF, 1)
            .drawRect(0, 0, 32, 32)
            .endFill();

        this.on('mousemove', (e: PIXI.interaction.InteractionEvent) => {
            this._lastCursorPos = e.data.getLocalPosition(this);
            this._updateCursor();
            if (this._draggingChecker.dragging) {
                this._startDrag = MapPoint.fromPoint(this._draggingChecker.draggingPoint).toMapSys();
                this._updateSelectedArea();
            }
        });

        this.on('mouseup', (e: PIXI.interaction.InteractionEvent) => {
            if (this._startDrag) {
                let c: MapPoint = MapPoint.fromPoint(e.data.getLocalPosition(this)).toMapSys();
                this.removeChild(this._draggingArea);
                this.onDrag && this.onDrag(this._startDrag.x, this._startDrag.y, c.x, c.y);
                this._startDrag = null;
            } else {
                // normal click
                let result: MapPoint = MapPoint.fromPoint(e.data.getLocalPosition(this))
                    .addXY(-this._tile.x, -this._tile.y)
                    .toMapSys();
                this.onClick && this.onClick(result.x, result.y, Click.LEFT);
            }
        });

        this.on('rightclick', (e: PIXI.interaction.InteractionEvent) => {

        });

        if (data) {
            // load map
            for (let layer of data['layers']) {
                for (let tileData in layer['tiles']) {
                    const tileSaver: TileSprite[] = this._editableTile[tileData] === undefined ?
                        this._editableTile[tileData] = [] : this._editableTile[tileData];

                    const loc: string[] = tileData.split(',');
                    const pos: number[] = [parseInt(loc[0]), parseInt(loc[1])];
                    const ri = layer['tiles'][tileData];
                    const layerLevel = data['tiles'][tileData]['layer'];
                    const tile: TileSprite = this._createImageTile(pos[0], pos[1], ri['r'], ri['i'], layerLevel);
                    tileSaver.push(tile);
                    this._tile.addChild(tile);

                    const phyTile: PhysicsTile = tile.toPhysicsTile();
                    // TODO: add event of clicking physics tile

                    this._editablePhysics[tileData] = phyTile;
                    this.physicsLayer.addChild(phyTile);
                }
            }
        } else {
            // create map
        }
        this._shortcutConfig();
    }

	/**
	 * 從JSON創建可編輯的地圖。
	 * 
	 * @param {ImageTileManager} imageSet 在地圖中使用的圖像集
	 * @param {MapData} json json數據
	 * 
	 * @return {EditableMap} 可編輯的地圖
	 */
    static fromJSON(imageSet: ImageTileManager, json: MapData): EditableMap {
        return new EditableMap(imageSet, json.cols, json.rows, { r: '0', i: 63, layer: 1 }, json);
    }

    private _shortcutConfig() {
        shortcutManager.on('A', [Key.A], () => this._shiftMap({ x: 30 }));
        shortcutManager.on('D', [Key.D], () => this._shiftMap({ x: -30 }));
        shortcutManager.on('W', [Key.W], () => this._shiftMap({ y: 30 }));
        shortcutManager.on('S', [Key.S], () => this._shiftMap({ y: -30 }));
    }

    private _shiftMap(offset: Object): void {
        if (offset['x']) {
            this.pivot.x -= offset['x'];
            if (this._lastCursorPos)
                this._lastCursorPos.x -= offset['x'];
        }
        if (offset['y']) {
            this.pivot.y -= offset['y'];
            if (this._lastCursorPos)
                this._lastCursorPos.y -= offset['y'];
        }
        if (this._lastCursorPos) this._updateCursor();
        if (this._startDrag) this._updateSelectedArea();
    }

    private _correctPoint(point: PIXI.Point | MapPoint): MapPoint {
        return new MapPoint(
            Math.max(0, Math.min(point.x - point.x % 32, (this.mapWidth - 1) * 32)),
            Math.max(0, Math.min(point.y - point.y % 32, (this.mapHeight - 1) * 32))
        );
    }

    /**
     * Update grid cursor position.
     */
    private _updateCursor() {
        let cursor: MapPoint = this._correctPoint(this._lastCursorPos);
        this._hoverGraphics.position.set(cursor.x, cursor.y);
    }

    /**
     * Update, and visualize selected area.
     */
    private _updateSelectedArea() {
        let tem = MapPoint.fromPoint(this._lastCursorPos).toMapSys();
        let min = {
            x: Math.max(0, Math.min(tem.x, this._startDrag.x)),
            y: Math.max(0, Math.min(tem.y, this._startDrag.y))
        };
        let max = {
            x: Math.min(Math.max(tem.x, this._startDrag.x), this.mapWidth - 1),
            y: Math.min(Math.max(tem.y, this._startDrag.y), this.mapHeight - 1)
        };
        this._draggingArea.destroy();
        this._draggingArea = new PIXI.Graphics();
        this._draggingArea.lineStyle(3, 0xFFFFFF, 1)
            .beginFill(0xFFFFFF, 0.3)
            .drawRect(0, 0, (max.x - min.x + 1) * 32,
                (max.y - min.y + 1) * 32)
            .endFill();
        this._draggingArea.position.set(min.x * 32, min.y * 32);
        this.addChild(this._draggingArea);

    }

    /**
     * Create a PIXI.Sprite which represent the image tile.
     * @param x x coordinate
     * @param y y coordinate
     * @param r which image set
     * @param i the index of grid
     */
    private _createImageTile(x: number, y: number, r: string | number, i: number, layer: number): TileSprite {
        let image: TileSprite = new TileSprite(this.imageSet.collections[r][i], r, i, layer - 1);
        image.position.set(x * 32, y * 32);
        image.interactive = true;
        image.on('rightclick', e => {
            if (this.onClick != null)
                this.onClick(x, y, Click.RIGHT);
        });
        return image;
    }

	/**
	 * Calculate the path from starting point to ending point by astar algorithm.
	 * 
	 * @param {MapPoint} start starting point
	 * @param {MapPoint} end ending point
	 * 
	 * @return {MapPoint[]} An array describles the path by points
	 */
    public astar(start: MapPoint, end: MapPoint): MapPoint[] {
        let path: MapPoint[] = [
        ];
        let openList: MapPoint[] = [start];
        let closeList: string[] = [];
        return path;
    }

	/**
	 * delete object or tile on given point.
	 * 
	 * @param {number} x x coordinate of the point
	 * @param {number} y y coordinate of the point
	 */
    public delete(x: number, y: number): void {
        let list: TileSprite[] = this._editableTile[x + ',' + y];
        if (list.length === 1) return;

        let last: TileSprite = list.pop();
        this._tile.removeChild(last);
        this._editablePhysics[x + ',' + y].layer = list[list.length - 1].layer;
    }

	/**
	 * stack a tile on map.
     * Please note that, if you stack a tile which is the same as the last one, it will stack nothings.
	 * 
	 * @param {number} x x coordinate of the point
	 * @param {number} y y coordinate of the point
	 * @param {Tile} tile tile data
	 */
    public stack(x: number, y: number, tile: Tile): void {
        let last: TileSprite = this._editableTile[x + ',' + y][this._editableTile[x + ',' + y].length - 1];
        if (last.r === tile.r && last.i === tile.i) return;
        let image: TileSprite = this._createImageTile(x, y, tile.r, tile.i, tile.layer);
        this._editableTile[x + ',' + y].push(image);
        this._editablePhysics[x + ',' + y].layer = tile.layer;

        this._tile.addChild(image);
    }

	/**
	 * Visualize physics layer of map.
	 */
    public set showPhysicsLayer(set: boolean) {
        this._showPhysics = set;
        this._showPhysics ? this.addChild(this.physicsLayer) : this.removeChild(this.physicsLayer);
    }

	/**
	 * @type {boolean}
	 */
    public get showPhysicsLayer() {
        return this._showPhysics;
    }

    public set showHoverEffect(set: boolean) {
        set ? this.addChild(this._hoverGraphics) : this.removeChild(this._hoverGraphics);
    }

    public dsipose(): void {
        shortcutManager.off('A');
        shortcutManager.off('S');
        shortcutManager.off('W');
        shortcutManager.off('D');
        this.destroy();
    }
}
