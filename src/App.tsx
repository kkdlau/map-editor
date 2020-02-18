import React from 'react';
import './App.css';
import Menu from './component/Menu';
import { manager } from '.';
function App() {
  return (
    <div className="App">
      <Menu manager={manager} />
    </div>
  );
}

export default App;
