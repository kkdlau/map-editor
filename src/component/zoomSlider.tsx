import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/Tooltip';
import { Slider } from '@material-ui/core';
import { mapViewer } from '..';
import ZoomIn from '@material-ui/icons/ZoomIn';
import ZoomOut from '@material-ui/icons/ZoomOut';

interface ZoomSliderStates {
	scale: number;
}

interface ZoomSliderProps {
}

const ValueLabelComponent = (props) => {
	const { children, open, value } = props;
	return (
		<Tooltip open={open} enterTouchDelay={0} placement="top" title={value + "%"}>
			{children}
		</Tooltip>
	);
}

export class ZoomSlider extends React.Component<ZoomSliderProps, ZoomSliderStates> {

	constructor(props: ZoomSliderProps, context?: any) {
		super(props, context);
		this.state = {
			scale: 100
		};
	}

	zoom = (event, value) => {
		this.setState({
			scale: Math.max(10, Math.min(300, value))
		});
		mapViewer.stage.scale.set(this.state.scale / 100, this.state.scale / 100);
	}

	render() {
		return (
			<div className="slider" style={{ paddingLeft: "5px", paddingRight: '5px' }}>
				<IconButton className='button' title="縮小" onClick={() => this.zoom(null, this.state.scale - 10)}>
					<ZoomOut style={{ color: "hsl(0, 1%, 80%)" }} />
				</IconButton>
				<Slider
					defaultValue={100}
					value={this.state.scale}
					aria-valuetext={"Zoom In / Out"}
					aria-labelledby="discrete-slider"
					valueLabelDisplay="auto"
					ValueLabelComponent={ValueLabelComponent}
					marks
					track="inverted"
					min={10}
					max={300}
					step={1}
					onChange={this.zoom}
					style={{ marginLeft: "5px", marginRight: '5px' }}
				/>
				<IconButton className='button' title="放大" onClick={() => this.zoom(null, this.state.scale + 10)}>
					<ZoomIn style={{ color: "hsl(0, 1%, 80%)" }} />
				</IconButton>
			</div >
		);
	}
}