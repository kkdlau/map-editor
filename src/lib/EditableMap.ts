import { emitter } from '..';
import { TileSprite, PhysicsTile } from './TileSprite';
import { MapPoint } from './MapPoint';
import { shortcutManager } from './ShortcutManager';
import { ImageTileManager } from './ImageTileManager';
import { DraggingChecker } from './DraggingCheck';
import { Key } from './key';
import * as PIXI from 'pixi.js';

export interface MapData {
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
            let c: MapPoint = MapPoint.fromPoint(e.data.getLocalPosition(this))
                .addXY(-this._tile.x, -this._tile.y)
                .toMapSys();
            if (e.data.originalEvent.which === 2) {
                this.onClick && this.onClick(c.x, c.y, Click.RIGHT);
            } else if (this._startDrag) {
                this.removeChild(this._draggingArea);
                let min = {
                    x: Math.max(0, Math.min(this._startDrag.x, c.x)),
                    y: Math.max(0, Math.min(this._startDrag.y, c.y))
                };
                let max = {
                    x: Math.min(Math.max(c.x, this._startDrag.x), this.mapWidth - 1),
                    y: Math.min(Math.max(c.y, this._startDrag.y), this.mapHeight - 1)
                };
                this.onDrag && this.onDrag(min.x, min.y, max.x, max.y);
                this._startDrag = null;
            } else {
                // normal click
                this.onClick && this.onClick(c.x, c.y, Click.LEFT);
            }
        });

        this.on('rightclick', (e: PIXI.interaction.InteractionEvent) => {
            console.log('right');
            let result: MapPoint = MapPoint.fromPoint(e.data.getLocalPosition(this))
                .addXY(-this._tile.x, -this._tile.y)
                .toMapSys();
            this.onClick && this.onClick(result.x, result.y, Click.LEFT);
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
        emitter.on('physics_layer', this._switchPhysicsLayer.bind(this));

    }

    private _switchPhysicsLayer(checked: boolean) {
        this.showPhysicsLayer = checked;
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
     * Pass a region and export the region as map object.
     * @param x1 x coordinate of starting position
     * @param y1 y coordinate of starting position
     * @param x2 x coordinate of ending position
     * @param y2 y coordinate of ending position
     */
    public exportMapObject(x1: number, y1: number, x2: number, y2: number): Array<Object> {
        let obj: Array<Object> = [];

        for (let x: number = x1; x <= x2; x++) {
            for (let y: number = y1; y <= y2; y++) {
                const index: string = x + ',' + y;
                const spriteList: Array<TileSprite> = this._editableTile[index];
                const topTile: TileSprite = spriteList[spriteList.length - 1];
                obj.push({
                    offset: {
                        x: x - x1,
                        y: y - y1
                    },
                    r: topTile.r.toString(),
                    i: topTile.i,
                    layer: topTile.layer
                });
            }
        }
        return obj;
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
    public stack(x: number, y: number, tile: Tile): boolean {
        if (x >= this.mapWidth || y >= this.mapHeight || x < 0 || y < 0) return false;
        let last: TileSprite = this._editableTile[x + ',' + y][this._editableTile[x + ',' + y].length - 1];
        if (last.r === tile.r && last.i === tile.i) return false;
        let image: TileSprite = this._createImageTile(x, y, tile.r, tile.i, tile.layer);
        this._editableTile[x + ',' + y].push(image);
        this._editablePhysics[x + ',' + y].layer = tile.layer;

        this._tile.addChild(image);
        return true;
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

    public exportToTWMAP(): Promise<void> {
        return new Promise<void>((resolve) => {
            let map: MapData = {} as MapData;
            map.rows = this.mapHeight;
            map.cols = this.mapWidth;
            map.objects = {};
            map.tileW = map.tileH = 32;

        });
    }

    public dsipose(): void {
        shortcutManager.off('A');
        shortcutManager.off('S');
        shortcutManager.off('W');
        shortcutManager.off('D');
        emitter.off('physics_layer', this._switchPhysicsLayer);
        this.destroy();
    }
}
