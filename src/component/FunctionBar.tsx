import React, { Component } from 'react';
import { Button, TextField, IconButton, Tooltip } from '@material-ui/core';
import Undo from '@material-ui/icons/Undo';
import Redo from '@material-ui/icons/Redo';
import { Action, undoRecord, redoRecord } from '../lib/undoRedo';

interface Props {

}
interface State {

}

class FunctionBar extends Component<Props, State> {
    state = {}

    undo = (): void => {
        if (!undoRecord.length) return;
        let record: Action = undoRecord.pop();
        record.undo(record.param);
        redoRecord.push(record);
    }

    redo = (): void => {
        if (!redoRecord.length) return;
        let record: Action = redoRecord.pop();
        record.redo(record.param);
        undoRecord.push(record);
    }

    render() {
        return (
            <div className="function-bar">
                {/* <TextField style={{ marginLeft: '10px', marginRight: '10px' }} size="small" defaultValue="unnamed_map.twmap" placeholder="file name" /> */}
                <Tooltip title="Undo">
                    <IconButton size="small" disabled={undoRecord.length == 0} style={{ marginLeft: '10px', marginRight: '10px' }} onClick={this.undo}>
                        <Undo />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Redo">
                    <IconButton size="small" disabled={redoRecord.length == 0} style={{ marginLeft: '10px', marginRight: '10px' }} >
                        <Redo />
                    </IconButton>
                </Tooltip>
            </div>
        )
    }
}

export default FunctionBar;
