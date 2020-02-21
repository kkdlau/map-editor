import React, { Component } from 'react';
import { Button, TextField, IconButton, Tooltip } from '@material-ui/core';
import Undo from '@material-ui/icons/Undo';
import Redo from '@material-ui/icons/Redo';
import { Action, undoRecord, redoRecord } from '../lib/undoRedo';
import { emiter } from '..';

interface Props {

}
interface State {

}

class FunctionBar extends Component<Props, State> {
    state = {}

    undo = (): void => {
        if (!undoRecord.length) return;
        let actionString: string = undoRecord.pop();
        console.log(actionString);
        let record: Action = JSON.parse(actionString);
        record.undo(record.param);
        redoRecord.push(actionString);
        this.forceUpdate();
    }

    redo = (): void => {
        if (!redoRecord.length) return;
        let actionString: string = redoRecord.pop();
        console.log(actionString);
        let record: Action = JSON.parse(actionString);
        record.redo(record.param);
        undoRecord.push(actionString);
        this.forceUpdate();
    }

    componentDidMount() {
        emiter.on('undo/redo', this.updateButtonState);
    }

    updateButtonState = () => {
        this.forceUpdate();
    }

    render() {
        return (
            <div className="function-bar">
                {/* <TextField style={{ marginLeft: '10px', marginRight: '10px' }} size="small" defaultValue="unnamed_map.twmap" placeholder="file name" /> */}
                <IconButton size="small" disabled={undoRecord.length == 0} style={{ marginLeft: '10px', marginRight: '10px' }} onClick={this.undo}>
                    <Tooltip title="Undo">
                        <Undo />
                    </Tooltip>
                </IconButton>
                <div className="divider"></div>
                <IconButton size="small" disabled={redoRecord.length == 0} style={{ marginLeft: '10px', marginRight: '10px' }} onClick={this.redo}>
                    <Tooltip title="redo"><Redo /></Tooltip>
                </IconButton>
            </div>
        )
    }

    componentWillUnmount() {
        emiter.off('undo/redo', this.updateButtonState);
    }
}

export default FunctionBar;
