// We can describe the MVC architecture in simple terms:
// Model: the part of our application that will deal with the database or any data-related functionality.
// View: everything the user will see — basically, the pages that we’re going to send to the client.
// Controller: the logic of our site, and the glue between models and views. Here we call our models to get the data, then we put that data on our views to be sent to the users.

// *******************************************************************************************************************
// ****************************************** constants and imports *********************************************
// *******************************************************************************************************************
const MODE = 'development';

const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require('path');
const url = require('url');

const mainWindowControllers = require('./controllers/mainW.controllers');
const createMainWindow = mainWindowControllers.createMainWindow;
const mainWindowListeners = mainWindowControllers.mainWindowListeners;

const deleteWindowControllers = require('./controllers/deleteW.controllers');
const deleteWindowListeners = deleteWindowControllers.deleteWindowListeners;

const addEditWindowControllers = require('./controllers/addEditW.controllers');
const createAddEditWindow = addEditWindowControllers.createAddEditWindow;
const addEditWindowListeners = addEditWindowControllers.addEditWindowListeners;

// const log = require('electron-log');

// Menu template
const mainMenuTemplate = [
    {
        label: 'Menu',
        submenu:[
            {
                label: 'Add New Book',
                click(){
                    addWin = createAddEditWindow(0);
                }
            },
            // {
            //     label: 'test',
            //     click(){
            //        console.log(global);
            //     }
            // },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

// *******************************************************************************************************************
// ****************************************** declaration of global vars *********************************************
// *******************************************************************************************************************

global.win;
global.addWin;
global.delWin;

global.app = app;
global.BrowserWindow =BrowserWindow;
global.Menu = Menu;
global.ipcMain = ipcMain;
global.path = path;
global.url = url;

global._sortBy_ = 'title'; // we need them to be stored - like session
global._sort_ = [ 'ASC', 'DESC' ];
global._sort_val_ = 0; // we need them to be stored - like session
global._searchKey_ = ''; // we need them to be stored - like session

// Create database connection
var knex = require("knex")({
	client: "sqlite3",
	connection: {
		filename: './database/books.sqlite'
	}
});

 
// *******************************************************************************************************************
// *********************************** development setup vars and mac fixes ******************************************
// *******************************************************************************************************************
 

if (MODE == 'development') {
    console.log('Hello From Books MVC App!!!');
    // log.warn(path.join(__dirname, 'database/books.sqlite'));
}

// if Mac, add empty object to menu - Mac displays electron as firt menu option
if (process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}


// if Mac, add empty object to menu - Mac displays electron as firt menu option
if (MODE == 'development'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}


 
// *******************************************************************************************************************
// ***************************************** Main functionality starts here  *****************************************
// *******************************************************************************************************************
  
 


// when app is ready 
app.on('ready', function(){
    // create the main window
   win = createMainWindow(mainMenuTemplate);
  
    // talk to database when main window is loaded  via ipcMain wich works like socket io caches something send by the window
    mainWindowListeners(knex);

    addEditWindowListeners(knex);

    deleteWindowListeners(knex);


});