import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ImageTileManager } from './lib/ImageTileManager';
import * as PIXI from 'pixi.js';
import tileset_0 from './assets/tileset0_v8.png';
export let resources = {
    'tileset_0': './assets/tileset0_v8.png'
};

export const loader = PIXI.Loader.shared;
export let mapViewer: PIXI.Application;
export let manager: ImageTileManager;

for (let r in resources) {
    const img = React.lazy(() => import(resources[r]));
    loader.add(r, img);
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
        let a = new PIXI.Sprite(manager.collections[0][0]);
        console.log(manager.collections[0].length);
        mapViewer.stage.addChild(a);
        ReactDOM.render(<App />, document.getElementById('root'));

        serviceWorker.register();
    });
});

