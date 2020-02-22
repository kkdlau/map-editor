
# TWMapEditor 方塊地圖編輯器

A new tiled map editor for Twilight Wars! The code of this editor has been rewritten, and let you have better experience with new UI and powerful shortcuts!

全新的方塊地圖編輯器，完全重寫編輯器的程式碼，加入多種快捷鍵，全新的UI，讓你有不一樣的體驗！

# Feature 編輯器特點 

 - edit your map with custom shortcut supoort(多種不同的快捷鍵，加快製作地圖速度)
 - .twmap format is supported(支援輸出.twmap格式，和光暈戰記接軌)
 - Pathing algorithm is provided( 顯示點和點之間的最佳路徑，輕鬆設計AI的行走路線)
![](https://i.imgur.com/o2i9wD3.png)

# 快捷鍵

1. Right click － open / close right-side panel (顯示／隱藏右方控制板)
2. Ctrl + z  － undo
3. Ctrl + Y / Shift + CMD + Z - redo

# 測試

To test this project, you have to install used libray by running `npm install` on terminal.

After the installation, enter `npm start` and the localhost should be established.

You can press `Control + C` on terminal to quit the debugging.

如果你未測試過，你首先要下載本專案使用過的Libray。

首先在vscode打開本專案，並打開命令行。

在命令行輸入：`npm install`即可下載Libray。

之後，輸入`npm start`便可以開始測試。

在命令行按下`Control + C`可以停止測試。


# 建立成品

在命令行輸入`sh deployment.sh`