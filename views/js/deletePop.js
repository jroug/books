const electron = require('electron');
const ipc = electron.ipcRenderer;
const form = document.querySelector('form');

form.addEventListener('submit', function(e){
    e.preventDefault();
    ipc.send('book:delete', document.getElementById('book-id').value);
});

document.addEventListener("DOMContentLoaded", function(){
    var currentWindow = electron.remote.getCurrentWindow();
    ipc.send("deleteWindowLoaded" , currentWindow.book_id);
    ipc.on("bookTitleSend", function(env, book){
        document.getElementById('book-id').value = book.id;
        document.getElementById('book-title').innerHTML = book.title;
    });
});