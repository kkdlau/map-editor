import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ImageTileManager } from './lib/ImageTileManager';
import * as PIXI from 'pixi.js';
import tileset_0 from './assets/tileset_0.png';
import tileset_1 from './assets/tileset_1.png';
import tileset_2 from './assets/tileset_2.png';
import tileset_3 from './assets/tileset_3.png';
import tileset_4 from './assets/tileset_4.png';
import tileset_5 from './assets/tileset_5.png';
import tileset_6 from './assets/tileset_6.png';
import tileset_7 from './assets/tileset_7.png';
import tileset_8 from './assets/tileset_8.png';
import tileset_9 from './assets/tileset_9.png';
import jsonData from './assets/decoded.json';
import { EditableMap, Click } from './lib/EditableMap';
import { Action, undoRecord, redoRecord } from './lib/undoRedo';
import { shortcutManager } from './lib/ShortcutManager';
import { Key } from './lib/key';
import hotkeys from 'hotkeys-js';
import { deepFreeze } from './lib/DeepFreeze';
import MapObjects from './assets/object_group.json';

// manage the relationship between alias and data.
export let resourceList = {
    'tileset_0': tileset_0,
    'tileset_1': tileset_1,
    'tileset_2': tileset_2,
    'tileset_3': tileset_3,
    'tileset_4': tileset_4,
    'tileset_5': tileset_5,
    'tileset_6': tileset_6,
    'tileset_7': tileset_7,
    'tileset_8': tileset_8,
    'tileset_9': tileset_9,
    'length': 10,
};
export const emitter: PIXI.utils.EventEmitter = new PIXI.utils.EventEmitter();
export const loader = PIXI.Loader.shared;
export const mapViewer: PIXI.Application = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight
});
mapViewer.view.style.overflow = 'hidden';
mapViewer.view.style.zIndex = "-1";
mapViewer.renderer.autoDensity = true;
mapViewer.view.oncontextmenu = () => false;

window.onresize = () => {
    mapViewer.renderer.resize(window.innerWidth, window.innerHeight);
}

export let manager: ImageTileManager;

for (let r in resourceList) {
    loader.add(r, resourceList[r]);
}

let selected = 63;

emitter.on('selected_tile', (id: number) => {
    selected = id;
});

loader.load((loader, resources) => {
    document.body.appendChild(mapViewer.view);

    manager = new ImageTileManager(['tileset_0']);

    manager.loadTexture().then(() => {
        let myMap: EditableMap = EditableMap.fromJSON(manager, jsonData);
        myMap.showHoverEffect = true;

        shortcutManager.on('physics', [Key.V], () => {
            myMap.showPhysicsLayer = !myMap.showPhysicsLayer;
            emitter.emit('physics_layer', myMap.showPhysicsLayer);
        });

        hotkeys('ctrl+z, command+z', () => {
            if (!undoRecord.length) return;
            let record: Action = undoRecord.pop();
            record.undo(record.param);
            redoRecord.push(record);
            emitter.emit('undo/redo');
        });

        hotkeys('ctrl+y, shift+command+z', () => {
            if (!redoRecord.length) return;
            let record: Action = redoRecord.pop();
            record.redo(record.param);
            undoRecord.push(record);
            emitter.emit('undo/redo');
        });

        myMap.onClick = (x: number, y: number, click: Click) => {
            if (click === Click.RIGHT) {
                for (let i = MapObjects['house_h'].length - 1; i >= 0; --i) {
                    let combination = MapObjects['house_h'][i];
                    myMap.stack(x + combination.offset.x, y + combination.offset.y, {
                        r: combination.r,
                        i: combination.i,
                        layer: combination.layer
                    });
                }
            } else {
                myMap.stack(x, y, { r: '0', i: selected, layer: 0 }) && undoRecord.push(deepFreeze({
                    undo: (obj) => myMap.delete(obj.x, obj.y),
                    redo: (obj) => myMap.stack(obj.x, obj.y, obj.tile),
                    param: { x: x, y: y, tile: { r: '0', i: selected, layer: 2 } }
                }) as Action) && emitter.emit('undo/redo');
            }
        }

        myMap.onDrag = (x1, y1, x2, y2): void => {
            //console.log(JSON.stringify(myMap.exportMapObject(x1, y1, x2, y2)));
        }
        mapViewer.stage.addChild(myMap);
        ReactDOM.render(<App />, document.getElementById('root'));

        serviceWorker.register();
    });
});

