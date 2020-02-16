// import { MapPoint } from './MapPoint';
// import { Menu } from './interface/menu';
// import { Click, EditableMap } from './EditableMap';
// import { ImageTileManager } from './ImageTileManager';

// export const pointToGridIndex = (point: PIXI.Point | CG.Base.geom.Point): CG.Base.geom.Point => {
// 	return new CG.Base.geom.Point(Math.floor(point.x / 32), Math.floor(point.y / 32));
// };

// export const emitter: PIXI.utils.EventEmitter = new PIXI.utils.EventEmitter();

// // prevent default menu
// document.addEventListener('contextmenu', e => e.preventDefault());

// class MapEditor {
// 	constructor() {
// 		CG.Base.resourceManager.addAppResource('TWMapEditor.tileset_0');
// 		CG.Base.linkCSSFile(CG.Base.getAppSourceUrl('CG.TWMapEditor/cssFile/menuBody.css'));
// 		CG.Base.linkCSSFile(CG.Base.getAppSourceUrl('CG.TWMapEditor/cssFile/base.css'));

// 		CG.Base.loadJSFile(CG.Base.getAppSourceUrl('CG.TWMapEditor/hotkeys.min.js')).then(() => {
// 			CG.Base.resourceManager.load(() => {
// 				// create image manager, all map textures should be loaded in here
// 				let manager: ImageTileManager = new ImageTileManager([
// 					'TWMapEditor.tileset_0',
// 				]);

// 				manager.loadTexture().then(() => {
// 					// to access map texture, use manager.collections[0][63]
// 					CG.Base.pixi.initialize(window.innerWidth, window.innerHeight);

// 					$.getJSON(CG.Base.getAppSourceUrl('CG.TWMapEditor/decoded.json'), obj => {
// 						let myMap: EditableMap = EditableMap.fromJSON(manager, obj);

// 						let path:MapPoint[] = myMap.astar(new MapPoint(0, 0), new MapPoint(10, 10));

// 						let pixiPath: PIXI.Graphics = new PIXI.Graphics();
// 						pixiPath.lineStyle(2, 0x0000FF, 0.3);
// 						pixiPath.beginFill(0x0000FF, 0.3);
// 						for (let i = path.length - 1; i>= 0; --i) {
// 							path[i] = path[i].toPIXISys();
// 							pixiPath.drawCircle(path[i].x + 16, path[i].y + 16, 3);
// 							pixiPath.moveTo(path[i].x + 16, path[i].y + 16);
// 							if (i > 0)
// 								pixiPath.lineTo(path[i - 1].x * 32 + 16, path[i - 1].y * 32 + 16);
// 						}
// 						pixiPath.endFill();
// 						myMap.addChild(pixiPath);

// 						myMap.onClick = (x, y, click) => {
// 							if (click === Click.LEFT) {
// 								console.log('new MapPoint(' + x + ', ' + y + '),');
// 								myMap.stack(x, y, { r: '0', i: 63 });
// 							} else {
// 								if (document.getElementById('menuBody').style.display != 'none')
// 									document.getElementById('menuBody').style.display = 'none';
// 								else
// 									document.getElementById('menuBody').style.display = 'block';
// 							}
// 						};

// 						myMap.showHoverEffect = true;
// 						CG.Base.pixi.stage.addChild(myMap);
// 						CG.React.renderComponent(Menu, {
// 							manager: manager
// 						});
// 					});
// 				});
// 			});
// 		});
// 	}
// }

// new MapEditor();