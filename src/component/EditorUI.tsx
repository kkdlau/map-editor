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
import { CircularProgress, Menu as MaterialMenu, PopoverPosition, MenuItem, ListItemIcon, ListItemText, Snackbar, Slide } from '@material-ui/core';
import deleteTWTile from './json/deleteTWTile.json'
import classification from './json/classification.json'
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

/**
 * 我是命運，我先寫一下有什麼是想你做的／之後我會做的：
 * 
 * 計算點和點之間的路線，你現在看到的路線是假的，只是我一個一個弄出來
 * 輸出地圖功能，之後我會在EditableMap的class加一個叫exportTOTWMAP，直接叫它就可以拿到資料
 * 一開始的加載地圖／建立新地圖的介面，這個可以先弄，但別React.renderComponent，因為每次測試也要點按鈕，很煩
 * 按數字鍵可以切換不同的圖片，換而言之，你要弄一個介面設定快捷鍵，這東西我弄
 * 幫我問小哈拿地圖物件的資料，比如屋子是怎組成之類
 * 
 * 我看地圖編輯器功能應該不只以上的吧，比起做出以前的編輯器，不如想想你有什麼新功能想做，告訴我之後可以幫你做出來
 */


function Alert(props: AlertProps) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface MenuProps {
	manager: ImageTileManager,
}

interface MenuState {
	materialImage: Array<String>,
	materialPosition: Array<Object>,
	settingPanel: boolean,
	loaded: boolean,
	selectedElement: HTMLElement,
	displayPos: Object,
	snakeBar: boolean,
	snakeBarMes: String
}


export class EditorUI extends React.Component<MenuProps, MenuState> {

	filterTitle: string = 'built-in';
	filterClassification: string = 'floor';

	constructor(props: MenuProps, context?: any) {
		super(props, context);
		this.state = {
			displayPos: {},
			materialImage: [],
			materialPosition: [],
			settingPanel: false,
			loaded: false,
			selectedElement: null,
			snakeBar: false,
			snakeBarMes: '',
		};
		loadMaterial(this.props.manager, this.state.materialImage, this.state.materialPosition).then(() => {
			this.setState({
				loaded: true
			});
		});
		document.oncontextmenu = () => {
			return false;
		}


	}

	render() {
		return (
			<div className="app-layout">
				<FunctionBar />
				<div className='menu-body' id='menu-body'>

					<ButtonGroup className='page-title'
						selectedStyle={{ background: '#424242' }}
						defaultValue={"built-in"}
						choose={(alias: string, last: string) => {
							this.filterTitle = alias;
							this.setState({
								loaded: true
							});
						}}>
						<TabButton className='button' alias="built-in">內建</TabButton>
						<TabButton className='button' alias="custom">自訂</TabButton>
						<TabButton className='button' alias="common">常用</TabButton>
					</ButtonGroup>

					<ButtonGroup className='classification-title'
						selectedStyle={{ background: '#424242' }}
						defaultValue={"floor"}
						choose={(alias: string, last: string) => {
							this.filterClassification = alias;
							this.setState({
								loaded: true
							});
						}}>
						<TabButton className='button' alias="floor">地板</TabButton>
						<TabButton className='button' alias="wall">牆壁</TabButton>
						<TabButton className='button' alias="object">物件</TabButton>
					</ButtonGroup>

					<ButtonGroup className='classification-title'
						style={{ margin: '0px 30px 10px 30px' }}
						selectedStyle={{ background: '#424242' }}
						defaultValue={"grid"}
						choose={(alias: string, last: string) => {

						}}>
						<TabButton className='button' alias="grid">單格</TabButton>
						<TabButton className='button' alias="group">群組</TabButton>
					</ButtonGroup>

					<div className='material-box'>
						{this.state.loaded ?
							this.state.materialPosition.map((data: any, idx) => {
								if (deleteTWTile.removeAt.split(',')[idx] !== '1' && this.filterClassification === classification[idx])
									return (
										<div className={'material-image-box button'}
											id={`material-image-box${idx}`}
											onAuxClick={(e) => {
												this.setState({
													displayPos: {
														left: e.clientX,
														top: e.clientY
													},
													selectedElement: e.currentTarget
												});
												e.preventDefault();
											}}
											onClick={materialClick.bind(this, `material-image-box${idx}`)} key={idx}>
											<img alt="tile set"
												onClick={() => emitter.emit('selected_tile', idx)}
												src={this.state.materialImage[data.imgIdx].toString()}
												draggable="false"
												style={{ marginLeft: `${data.imgLeft}px`, marginTop: `${data.imgTop}px` }}
											/>
										</div>
									);
								else return null;
							}) : <div style={{ margin: 'auto' }}>
								<CircularProgress />
							</div>}
					</div>
				</div>
				<MaterialMenu
					anchorReference="anchorPosition"
					anchorPosition={this.state.displayPos as PopoverPosition}
					anchorEl={this.state.selectedElement}
					keepMounted
					open={Boolean(this.state.selectedElement)}
					onClose={() => this.setState({ selectedElement: null })}
				>
					<MenuItem onClick={() => {
						this.setState({ snakeBar: true, selectedElement: null, snakeBarMes: '已加入常用' })
					}}>
						<ListItemIcon style={{ minWidth: '40px' }}>
							<FavoriteBorder fontSize="small" />
						</ListItemIcon>
						<ListItemText>加入常用</ListItemText>
					</MenuItem>

				</MaterialMenu>
				<ZoomSlider />

				<Snackbar
					open={this.state.snakeBar}
					autoHideDuration={2000}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
					onClose={(reason) => { if (reason == null) this.setState({ snakeBar: false }) }}
				>
					<Alert
						onClose={() => { this.setState({ snakeBar: false }) }}
						severity="success"
					>
						{this.state.snakeBarMes}
					</Alert>
				</Snackbar>

			</div >
		);
	}
}

export default EditorUI;
