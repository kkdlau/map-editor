import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ImageTileManager } from './lib/ImageTileManager';
import * as PIXI from 'pixi.js';
import tileset_0 from './assets/tileset_0.png';
import jsonData from './assets/decoded.json';
import { EditableMap, Click } from './lib/EditableMap';
import { Action, undoRecord, redoRecord } from './lib/undoRedo';
import { shortcutManager, KeyAction } from './lib/ShortcutManager';
import { Key } from './lib/key';
import hotkeys from 'hotkeys-js';

// manage the relationship between alias and data.
export let resourceList = {
    'tileset_0': tileset_0
};
export const emiter: PIXI.utils.EventEmitter = new PIXI.utils.EventEmitter();
export const loader = PIXI.Loader.shared;
export const mapViewer: PIXI.Application = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight
});
mapViewer.view.style.overflow = 'hidden';
mapViewer.view.style.zIndex = "-1";
mapViewer.renderer.autoDensity = true;

window.onresize = () => {
    mapViewer.renderer.resize(window.innerWidth, window.innerHeight);
}

export let manager: ImageTileManager;

for (let r in resourceList) {
    loader.add(r, resourceList[r]);
}

loader.load((loader, resources) => {
    document.body.appendChild(mapViewer.view);

    manager = new ImageTileManager(['tileset_0']);

    manager.loadTexture().then(() => {
        let myMap: EditableMap = EditableMap.fromJSON(manager, jsonData);
        myMap.showHoverEffect = true;

        shortcutManager.on('physics', [Key.V], () => {
            myMap.showPhysicsLayer = !myMap.showPhysicsLayer;
        });

        hotkeys('ctrl+z, command+z', () => {
            if (!undoRecord.length) return;
            let record: Action = undoRecord.pop();
            record.undo(record.param);
            redoRecord.push(record);
            emiter.emit('undo/redo');
        });

        hotkeys('ctrl+y, shift+command+z', () => {
            if (!redoRecord.length) return;
            let record: Action = redoRecord.pop();
            record.redo(record.param);
            undoRecord.push(record);
            emiter.emit('undo/redo');
        });

        myMap.onClick = (x: number, y: number, Click: Click) => {
            myMap.stack(x, y, { r: '0', i: 63, layer: 1 });
            undoRecord.push({
                undo: (obj) => myMap.delete(obj.x, obj.y),
                redo: (obj) => myMap.stack(obj.x, obj.y, { r: '0', i: 63, layer: 1 }),
                param: { x: x, y: y }
            } as Action);
            emiter.emit('click', { x: x, y: y, tile: { r: '0', i: 63, layer: 1 } });
            emiter.emit('undo/redo');
        }
        mapViewer.stage.addChild(myMap);
        ReactDOM.render(<App />, document.getElementById('root'));

        serviceWorker.register();
    });
});

