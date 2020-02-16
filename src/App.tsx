import React from 'react';
import './App.css';
import Menu from './component/Menu';
import * as PIXI from 'pixi.js';

let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas"
}

function App() {
  return (
    <div className="App">
      <Menu />
    </div>
  );
}

export default App;
