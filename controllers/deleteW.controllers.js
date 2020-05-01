const bookModels = require('../models/book.models');
const getBookList = bookModels.getBookList;
const getBookTitle = bookModels.getBookTitle;
const deleteBook = bookModels.deleteBook;

var self = module.exports = {
    createDeleteWindow: function(book_id){
        // Create new window
        delWin = new BrowserWindow({ 
            height: 200, 
            width: 400, 
            webPreferences: {
                nodeIntegration: true
            }
        });

        delWin.setMenuBarVisibility(false);

        // Load html to addWin
        delWin.loadURL(url.format({
            pathname: path.join(__dirname, "../views/confirmDeleteWindow.html"),
            protocol: 'file',
            slashes: true,
            show: false
        }));

        delWin.book_id = book_id;

        delWin.once('ready-to-show', () => { 
            delWin.show();
        });

        // Garbage collection handle
        delWin.on('closed', () => {
            delWin = null;
        });

        return delWin;
    },
    deleteWindowListeners: function(knex){

        // set delete window listeners
        ipcMain.on("deleteWindowLoaded", function (e, book_id) {
            getBookTitle(knex, book_id).then(function(rows){
                // console.log(rows[0]);
                delWin.webContents.send("bookTitleSend", rows[0]);
            });
        });
 
        // delete book from database and gets book list data and send it back
        ipcMain.on("book:delete", function (e, book_id) {
            deleteBook( knex, book_id ).then(function(){
                getBookList(knex, _sortBy_, false, _searchKey_).then(function(rows){
                    win.webContents.send("bookListSend", rows);
                });
            });
            delWin.close();
        });
 
        ipcMain.on("book:openDeleteWindow", function (e, book_id) {
            delWin = self.createDeleteWindow(book_id);
        });
    }

        
}