import React from 'react';
import './css/menuBody.css';
import './css/base.css';
import { ImageTileManager } from '../lib/ImageTileManager';
import { loadMaterial } from './loadMaterial';
import { materialClick } from './materialClick';
import { ZoomSlider } from './ZoomSlider';
import FunctionBar from './FunctionBar';
import { emitter } from '..';
import ButtonGroup from './ButtonGroup';
import TabButton from './TabButton';
import { CircularProgress } from '@material-ui/core';
import deleteTWTile from './deleteTWTile.json'
import { ClassificationTool } from './classificationTool';
import classification from './classification.json'

/**
 * 我是命運，我先寫一下有什麼是想你做的／之後我會做的：
 * 
 * 計算點和點之間的路線，你現在看到的路線是假的，只是我一個一個弄出來
 * 輸出地圖功能，之後我會在EditableMap的class加一個叫exportTOTWMAP，直接叫它就可以拿到資料
 * 一開始的加載地圖／建立新地圖的介面，這個可以先弄，但別React.renderComponent，因為每次測試也要點按鈕，很煩
 * 按數字鍵可以切換不同的圖片，換而言之，你要弄一個介面設定快捷鍵，這東西我弄
 * 
 * 我看地圖編輯器功能應該不只以上的吧，比起做出以前的編輯器，不如想想你有什麼新功能想做，告訴我之後可以幫你做出來
 */
interface MenuProps {
	manager: ImageTileManager,
}

interface MenuState {
	materialImage: Array<String>,
	materialPosition: Array<Object>,
	settingPanel: boolean,
	loaded: boolean
}

export const toolChooseColor = { 'floor': 'red', 'wall': 'blue', 'object': 'green' };

export class Menu extends React.Component<MenuProps, MenuState> {

	constructor(props: MenuProps, context?: any) {
		super(props, context);
		this.state = { materialImage: [], materialPosition: [], settingPanel: false, loaded: false };
		loadMaterial(this.props.manager, this.state.materialImage, this.state.materialPosition).then(() => {
			this.setState({
				loaded: true
			});
		});
	}

	render() {
		return (
			<div className="app-layout">
				<FunctionBar />
				<ClassificationTool />
				<div className='menu-body' id='menu-body'>

					<ButtonGroup className='page-title'
						selectedStyle={{ background: '#424242' }}
						defaultValue={"built-in"}
						choose={(alias: string, last: string) => {
							console.log(alias);
						}}>
						<TabButton className='button' alias="built-in">內建</TabButton>
						<TabButton className='button' alias="custom">自訂</TabButton>
						<TabButton className='button' alias="common">常用</TabButton>
					</ButtonGroup>

					<ButtonGroup className='classification-title'
						selectedStyle={{ background: '#424242' }}
						defaultValue={"floor"}
						choose={(alias: string, last: string) => {
							console.log(alias);
						}}>
						<TabButton className='button' alias="floor">地板</TabButton>
						<TabButton className='button' alias="wall">牆壁</TabButton>
						<TabButton className='button' alias="object">物件</TabButton>
						<TabButton className='button' alias="group">群組</TabButton>
					</ButtonGroup>

					<div className='material-box'>
						{this.state.loaded ?
							this.state.materialPosition.map((data: any, idx) => {
								if (deleteTWTile.removeAt.split(',')[idx] != '1')
									return (
										<div className='material-image-box button'
											style={{ border: '2px solid ' + toolChooseColor[classification[idx]] }}
											id={`material-image-box${idx}`}
											onClick={materialClick.bind(this, `material-image-box${idx}`, idx)} key={idx}>
											<img alt="tile set"
												onClick={() => emitter.emit('selected_tile', idx)}
												src={this.state.materialImage[data.imgIdx].toString()}
												draggable="false"
												style={{ marginLeft: `${data.imgLeft}px`, marginTop: `${data.imgTop}px` }}
											/>
										</div>
									)
							}) : <div style={{ margin: 'auto' }}>
								<CircularProgress />
							</div>}
					</div>
				</div>
				<ZoomSlider />
			</div>
		);
	}
}

export default Menu;
