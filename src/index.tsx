import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ImageTileManager } from './lib/ImageTileManager';
import * as PIXI from 'pixi.js';
import tileset_0 from './assets/tileset_0.png';
import jsonData from './assets/decoded.json';
import { EditableMap } from './lib/EditableMap';

// manage the relationship between alias and data.
export let resourceList = {
    'tileset_0': tileset_0
};

export const loader = PIXI.Loader.shared;
export const mapViewer: PIXI.Application = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight
});
mapViewer.view.style.overflow = 'hidden';
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
        mapViewer.stage.addChild(myMap);
        ReactDOM.render(<App />, document.getElementById('root'));

        serviceWorker.register();
    });
});

