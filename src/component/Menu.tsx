import React from 'react';
import './css/menuBody.css';
import './css/base.css';
import { ImageTileManager } from '../lib/ImageTileManager';
import { pageTitle } from './pageTitle';
import { classificationTitle } from './classificationTitle';
import { loadMaterial } from './loadMaterial';
import { materialClick } from './materialClick';
import { ZoomSlider } from './ZoomSlider';
import { Button } from '@material-ui/core';
import ShortcutPanel from './ShortcutPanel';

/**
 * 我是命運，我先寫一下有什麼是想你做的／之後我會做的：
 * 
 * 專案的封面圖，快點弄喔
 * 計算點和點之間的路線，你現在看到的路線是假的，只是我一個一個弄出來
 * 區域放置東西的功能，這個不難，只要用myMap.onDrag就可以了
 * 在地圖放東西的功能，這個不難，只要用myMap.onClick就可以了
 * 輸出地圖功能，之後我會在EditableMap的class加一個叫exportTOTWMAP，直接叫它就可以拿到資料
 * 一開始的加載地圖／建立新地圖的介面，這個可以先弄，但別React.renderComponent，因為每次測試也要點按鈕，很煩
 * 按數字鍵可以切換不同的圖片，換而言之，你要弄一個介面設定快捷鍵，這東西我弄
 * 幫我美化一下ZoomSlider
 * css的命名方法是xxx-xxx，比如zoom-slider，快把你的命名改掉
 * 幫我問小哈拿地圖物件的資料，比如屋子是怎組成之類
 * 
 * 我看地圖編輯器功能應該不只以上的吧，比起做出以前的編輯器，不如想想你有什麼新功能想做，告訴我之後可以幫你做出來
 */
interface MenuProps {
	manager: ImageTileManager,
}

interface MenuState {
	materialImage: Array<String>,
	materialPosition: Array<Object>,
	settingPanel: boolean
}

export class Menu extends React.Component<MenuProps, MenuState> {

	constructor(props: MenuProps, context?: any) {
		super(props, context);
		this.state = { materialImage: [], materialPosition: [], settingPanel: false };
		loadMaterial(this.props.manager, this.state.materialImage, this.state.materialPosition).then(() => {
			this.setState({});
		});
	}

	componentDidMount() {
		pageTitle('built-in');
		classificationTitle('floor');
	}

	render() {
		return (
			<div>
				<div className='menu-body' id='menu-body'>
					<Button color='primary' style={{ alignContent: 'center', margin: '5px 5px 5px 5px', minWidth: '90%' }} variant='contained' onClick={() => this.setState({ settingPanel: true })}> 設定</Button>
					<div className='page-title'>
						<div id='built-in' className='button' onClick={pageTitle.bind(this, 'built-in')}>內建</div>
						<div id='custom' className='button' onClick={pageTitle.bind(this, 'custom')}>自訂</div>
						<div id='common' className='button' onClick={pageTitle.bind(this, 'common')}>常用</div>
					</div>
					<div className='classification-title'>
						<div id='floor' className='button' onClick={classificationTitle.bind(this, 'floor')}>地板</div>
						<div id='wall' className='button' onClick={classificationTitle.bind(this, 'wall')}>牆壁</div>
						<div id='object' className='button' onClick={classificationTitle.bind(this, 'object')}>物件</div>
					</div>
					<div className='material-box'>
						{this.state.materialPosition.map((data: any, idx) => {
							return (
								<div className='material-image-box button' id={`material-image-box${idx}`} onClick={materialClick.bind(this, `material-image-box${idx}`)} key={idx}>
									<img src={this.state.materialImage[data.imgIdx].toString()} draggable="false" style={{ marginLeft: `${data.imgLeft}px`, marginTop: `${data.imgTop}px` }} />
								</div>
							)
						})}
					</div>
				</div>
				<ZoomSlider />
				<ShortcutPanel open={this.state.settingPanel} />
			</div>
		);
	}
}

export default Menu;
