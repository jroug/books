const bookModels = require('../models/book.models');
const getBookList = bookModels.getBookList;
const getBookData = bookModels.getBookData;
const insertBook = bookModels.insertBook;
const updateBook = bookModels.updateBook;

var self = module.exports = {
    createAddEditWindow: function(book_id){
        // Create new window
        addWin = new BrowserWindow({ 
            height: 400, 
            width: 500, 
            webPreferences: {
                nodeIntegration: true
            }
        });
        addWin.setMenuBarVisibility(false);
    
        // Load html to addWin
        addWin.loadURL(url.format({
            pathname: path.join(__dirname, "../views/bookInfoWindow.html"),
            protocol: 'file',
            slashes: true,
            show: false
        }));
    
        addWin.book_id = book_id;
    
        addWin.once('ready-to-show', () => { 
            addWin.show();
        });
    
        // Garbage collection handle
        addWin.on('closed', () => {
            addWin = null;
        });
    
        return addWin;
    },
    addEditWindowListeners: function(knex){

        // add functionality

        // opens add window when button clicked
        ipcMain.on("book:openAddWindow", function (e) {
            addWin = self.createAddEditWindow(0);
        });

        // adds new book to database and gets book list data and send it back
        ipcMain.on("book:add", function (e, book) {
            insertBook(knex, book).then(function(){
                getBookList(knex, _sortBy_, _sort_[_sort_val_], _searchKey_).then(function(rows){
                    win.webContents.send("bookListSend", rows);
                });
            });
            addWin.close();
        });


        // edit functionality

        // opens edit window when button clicked
        ipcMain.on("book:openEditWindow", function (e, book_id) {
            addWin = self.createAddEditWindow(book_id);
        });

        // gets data to put in form elements
        ipcMain.on("addEditWindowLoaded", function(e, book_id){
            // console.log(book_id);
            getBookData(knex, book_id ).then(function(rows){
                // console.log(rows[0]);
                addWin.webContents.send("bookItemSend", rows[0]);
            });
        });

        // adds new book to database and gets book list data and send it back
        ipcMain.on("book:edit", function (e, book) {
            // console.log(book);
            updateBook(knex, book).then(function(){
                getBookList(knex, _sortBy_, _sort_[_sort_val_], _searchKey_).then(function(rows){
                    win.webContents.send("bookListSend", rows);
                });
            });
            addWin.close();
        });


    }

}