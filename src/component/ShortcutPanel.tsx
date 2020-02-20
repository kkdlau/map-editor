import * as React from 'react';
import { Dialog, AppBar, Typography, Toolbar } from '@material-ui/core';

export interface IShortcutPanelProps {
    open: boolean
}

export interface IShortcutPanelState {
    open: boolean
}

export default class ShortcutPanel extends React.Component<IShortcutPanelProps, IShortcutPanelState> {
    constructor(props: IShortcutPanelProps) {
        super(props);

        this.state = {
            open: this.props.open
        }
    }

    public render() {
        return (
            <div>
                <Dialog fullScreen open={this.props.open}>
                    <AppBar>
                        <Toolbar>
                            <Typography>Setting</Typography>
                        </Toolbar>
                    </AppBar>
                </Dialog>
            </div>
        );
    }
}
