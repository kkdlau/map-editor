import React from 'react';

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

class Menu extends React.Component<any, any> {

    constructor(props: any, context?: any) {
        super(props, context);
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}

export default Menu;
