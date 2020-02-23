import React from 'react';
import EditorUI from './component/EditorUI';
import { manager } from '.';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({ "palette": { "type": 'dark', "common": { "black": "#000", "white": "#fff" }, "background": { "paper": "rgba(30, 30, 30, 1)", "default": "rgba(74, 74, 74, 1)" }, "primary": { "light": "#7986cb", "main": "rgba(114, 123, 172, 1)", "dark": "rgba(122, 193, 129, 1)", "contrastText": "#fff" }, "secondary": { "light": "#ff4081", "main": "#f50057", "dark": "#c51162", "contrastText": "#fff" }, "error": { "light": "#e57373", "main": "#f44336", "dark": "#d32f2f", "contrastText": "#fff" }, "text": { "primary": "rgba(255, 255, 255, 0.87)", "secondary": "rgba(0, 0, 0, 0.54)", "disabled": "rgba(0, 0, 0, 0.38)", "hint": "rgba(0, 0, 0, 0.38)" } } }
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <EditorUI manager={manager} />
    </ThemeProvider>
  );
}

export default App;
