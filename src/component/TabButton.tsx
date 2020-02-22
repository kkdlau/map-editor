import * as React from 'react';

export interface ITabButtonProps {
    alias: string
}

export interface ITabButtonState {
}

export default class TabButton extends React.Component<ITabButtonProps & React.HTMLAttributes<HTMLDivElement>, ITabButtonState> {
    constructor(props: ITabButtonProps) {
        super(props);

        this.state = {
        }
    }

    public render() {
        return (
            <div className={this.props.className} id={this.props.id} style={this.props.style}>{this.props.children}</div>
        );
    }
}
