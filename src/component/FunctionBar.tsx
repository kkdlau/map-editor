import React, { Component } from 'react';
import { IconButton, Tooltip, Switch } from '@material-ui/core';
import Undo from '@material-ui/icons/Undo';
import Redo from '@material-ui/icons/Redo';
import { Action, undoRecord, redoRecord } from '../lib/undoRedo';
import { emitter } from '..';
import Help from '@material-ui/icons/Help';
interface Props {

}
interface State {
    physicsLayer: false
}

class FunctionBar extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            physicsLayer: false
        };
    }

    undo = (): void => {
        if (!undoRecord.length) return;
        let record: Action = undoRecord.pop();
        record.undo(record.param);
        redoRecord.push(record);
        this.forceUpdate();
    }

    redo = (): void => {
        if (!redoRecord.length) return;
        let record: Action = redoRecord.pop();
        record.redo(record.param);
        undoRecord.push(record);
        this.forceUpdate();
    }

    componentDidMount() {
        emitter.on('undo/redo', this.updateButtonState);
        emitter.on('physics_layer', this.updatePhysicsSate);
    }

    updateButtonState = () => {
        this.forceUpdate();
    }

    updatePhysicsSate = (checked) => {
        this.setState({ physicsLayer: checked });
    }


    render() {
        return (
            <div className="function-bar">
                {/* <TextField style={{ marginLeft: '10px', marginRight: '10px' }} size="small" defaultValue="unnamed_map.twmap" placeholder="file name" /> */}
                <IconButton size="small"
                    style={{ marginLeft: '10px', marginRight: '10px' }}
                    onClick={() => window.open('https://hackmd.io/@SakiOCVjRi6switvKe2CNw/twmap_editor_guideline', '_new')}>
                    <Help />
                </IconButton>
                <div className="divider"></div>
                <IconButton size="small" disabled={undoRecord.length === 0} style={{ marginLeft: '10px', marginRight: '10px' }} onClick={this.undo}>
                    <Tooltip title="Undo">
                        <Undo />
                    </Tooltip>
                </IconButton>
                <IconButton size="small" disabled={redoRecord.length === 0} style={{ marginLeft: '10px', marginRight: '10px' }} onClick={this.redo}>
                    <Tooltip title="redo"><Redo /></Tooltip>
                </IconButton>
                <div className="divider"></div>
                <div>Physics layer:</div>
                <Switch checked={this.state.physicsLayer} onChange={e => emitter.emit('physics_layer', e.target.checked)}></Switch>
                <div className="divider"></div>
            </div >
        )
    }

    componentWillUnmount() {
        emitter.off('undo/redo', this.updateButtonState);
        emitter.off('physics_layer', this.updatePhysicsSate);
    }
}

export default FunctionBar;
