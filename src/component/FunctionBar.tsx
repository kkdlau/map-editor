import React, { Component } from 'react';
import { IconButton, Tooltip, Switch } from '@material-ui/core';
import Undo from '@material-ui/icons/Undo';
import Redo from '@material-ui/icons/Redo';
import { Action, undoRecord, redoRecord } from '../lib/undoRedo';
import { emitter } from '..';

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
