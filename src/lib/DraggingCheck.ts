import * as PIXI from 'pixi.js';

export class DraggingChecker {
    private _startChecking: boolean = false;
    public draggingPoint: PIXI.Point;
    public dragging: boolean = false;

    constructor(public draggableObject: PIXI.DisplayObject) {
        this.draggingPoint = new PIXI.Point();
        draggableObject.interactive = true;
        draggableObject.on('mousedown', (e) => {
            this.draggingPoint = e.data.getLocalPosition(this.draggableObject);
            this._startChecking = true;
        });

        draggableObject.on('mousemove', (e) => {
            if (!this._startChecking) return;
            let c: PIXI.Point = e.data.getLocalPosition(this.draggableObject);
            if (!this.dragging && (Math.abs(c.x - this.draggingPoint.x) > 10 || Math.abs(c.y - this.draggingPoint.y) > 10))
                this.dragging = this._startChecking;
        });

        draggableObject.on('mouseup', (e) => {
            this.dragging = this._startChecking = false;
        });
    }
}
