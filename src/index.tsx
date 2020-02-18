import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ImageTileManager } from './lib/ImageTileManager';
import * as PIXI from 'pixi.js';
import tileset_0 from './assets/tileset_0.png';

export let resourceList = {
    'tileset_0': tileset_0
};

export const loader = PIXI.Loader.shared;
export let mapViewer: PIXI.Application;
export let manager: ImageTileManager;

for (let r in resourceList) {
    loader.add(r, resourceList[r]);
}

loader.load((loader, resources) => {
    mapViewer = new PIXI.Application({
        width: window.innerWidth - 10,
        height: window.innerHeight - 10
    });

    mapViewer.renderer.autoDensity = true;

    window.onresize = () => {
        mapViewer.renderer.resize(window.innerWidth - 10, window.innerHeight - 10);
    }
    document.body.appendChild(mapViewer.view);

    manager = new ImageTileManager(['tileset_0']);

    manager.loadTexture().then(() => {
        mapViewer.stage.addChild(new PIXI.Sprite(manager.collections[0][63]));
        ReactDOM.render(<App />, document.getElementById('root'));

        serviceWorker.register();
    });
});

