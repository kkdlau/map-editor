import { emitter } from '../app';

interface ZoomSliderStates {
	scale: number;
}

interface ZoomSliderProps {
}

const ValueLabelComponent = (props) => {
	const { children, open, value } = props;
	return (
		<MaterialUI.Tooltip open={open} enterTouchDelay={0} placement="top" title={value + "%"}>
			{children}
		</MaterialUI.Tooltip>
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
		CG.Base.pixi.stage.scale.set(this.state.scale / 100, this.state.scale / 100);
		emitter.emit('zoom', this.state.scale);
	}

	render() {
		return (
			<div className="slider">
				<MaterialUI.IconButton size='small' onClick={() => this.zoom(null, this.state.scale - 10)}>
					<MaterialUI.Icon style={{color: "hsl(0, 1%, 80%)" }}>zoom_out</MaterialUI.Icon>
				</MaterialUI.IconButton>
				<MaterialUI.Slider
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
				/>
				<MaterialUI.IconButton size='small'  onClick={() => this.zoom(null, this.state.scale + 10)}>
					<MaterialUI.Icon style={{color: "hsl(0, 1%, 80%)" }}>zoom_in</MaterialUI.Icon>
				</MaterialUI.IconButton>
			</div>
		);
	}
}