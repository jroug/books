const electron = require('electron');
const ipc = electron.ipcRenderer;
const form = document.querySelector('form');

form.addEventListener('submit', function(e){
    e.preventDefault();

    let book = {
        title: document.querySelector('#book-title').value,
        author: document.querySelector('#book-author').value,
        position: document.querySelector('#book-position').value,
    }

    var book_id = document.querySelector('#book-id').value;
    if (book_id>0)  {
        book.id = document.querySelector('#book-id').value;
        ipc.send('book:edit', book);
    }else{
        ipc.send('book:add', book);
    }
    // console.log(book);
});

document.addEventListener("DOMContentLoaded", function(){
    var currentWindow = electron.remote.getCurrentWindow();
    // console.log(currentWindow.book_id);
    if ( currentWindow.book_id> 0 ){
        ipc.send("addEditWindowLoaded" , currentWindow.book_id);
        ipc.on("bookItemSend", function(env, book){
            console.log(book);
            document.getElementById('book-id').value = book.id;
            document.getElementById('book-title').value = book.title;
            document.getElementById('book-author').value = book.author;
            document.getElementById('book-position').value = book.position;
            document.getElementById('form-btn').innerHTML = 'Update Book';
        });
    }else{
        document.getElementById('form-btn').innerHTML = 'Add New Book';
    }
});

