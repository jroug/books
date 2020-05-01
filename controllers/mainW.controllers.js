
const bookModels = require('../models/book.models');
const getBookList = bookModels.getBookList;

module.exports = {

    // create themain window
    createMainWindow:  function (mainMenuTemplate){
        // Create new window
        var win = new BrowserWindow({ 
            height: 700, 
            width: 1200, 
            webPreferences: {
                nodeIntegration: true
            },
            show:false
        });

        // Load html to window
        win.loadURL(url.format({
            pathname: path.join(__dirname, "../views/main.html"),
            protocol: 'file',
            slashes: true
        }));
 
        win.once('ready-to-show', () => {
            win.show();
        });

        // Open the Development tools
        // win.webContents.openDevTools();

        // Build menu from template
        const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
        // Insert menu
        Menu.setApplicationMenu(mainMenu);
        
        // what todo when close main app window
        win.on('closed', () => {
            // Close all - if any other window is open
            app.quit();
            // Garbage collection handle
            win = null;
        });
        return win;
    },

    // listen main window to send data when loaded
    mainWindowListeners: function(knex){

        ipcMain.on("mainWindowLoaded", function(e, data){
            getBookList(knex, global._sortBy_, global._sort_[global._sort_val_], global._searchKey_ ).then(function(rows){
                win.webContents.send("bookListSend", rows);
            });
        }); 
 
        ipcMain.on("searchWith", function(e, _sKey_){
            global._searchKey_ = _sKey_;
            getBookList(knex, global._sortBy_, global._sort_[global._sort_val_], global._searchKey_ ).then(function(rows){
                win.webContents.send("bookListSend", rows);
            });
        });
   

        // sort by table field

        var s = _searchKey_;
        ipcMain.on("sortBy", function(e, field){
            global._sort_val_ = +!global._sort_val_;
            global._sortBy_ = field; 
            getBookList(knex, global._sortBy_, global._sort_[global._sort_val_], global._searchKey_ ).then(function(rows){
                win.webContents.send("bookListSend", rows);
            });
        });
    }



}