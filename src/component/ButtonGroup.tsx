import * as React from 'react';
import { ITabButtonProps } from './TabButton';
export interface IGroupButtonProps {
    children?: React.ReactNode,
    defaultValue?: string,
    selectedStyle?: React.CSSProperties,
    choose?: (alias: string, last: string) => void;
}

export interface IGroupButtonState {
    lastAlias: string
}

export default class ButtonGroup extends React.Component<IGroupButtonProps & React.HTMLAttributes<HTMLDivElement>, IGroupButtonState> {
    constructor(props: IGroupButtonProps) {
        super(props);

        this.state = {
            lastAlias: this.props.defaultValue
        }
    }

    updateSelected(alias: string) {
        this.props.choose && this.props.choose(alias, this.state.lastAlias)
        this.setState({
            lastAlias: alias
        });
    }

    public render() {
        return (
            <div className={this.props.className} id={this.props.id} style={this.props.style}>{
                React.Children.map(this.props.children, (child: React.ReactElement<ITabButtonProps>, i: number) => {
                    if (child.props.alias === this.state.lastAlias) {
                        return (
                            <div key={i} style={this.props.selectedStyle}
                                onClick={this.updateSelected.bind(this, child.props.alias)}>
                                {child}
                            </div>
                        );
                    } else {
                        return (
                            <div key={i}
                                onClick={this.updateSelected.bind(this, child.props.alias)}>
                                {child}
                            </div>
                        );
                    }
                })
            }</div>
        );
    }
}
