var _data;
const electron = require("electron");
const ipc = electron.ipcRenderer;
document.addEventListener("DOMContentLoaded", function(){
    ipc.send("mainWindowLoaded");
    ipc.on("bookListSend", populateTable);
});

// populate table with data from database
function populateTable(evt, data){
    // console.log(data);
    _data = data;
    var _html = '';

    for (var i = 0; i < data.length;i++) {
        _html += '<tr class="row" >';
            _html += '<td class="t-ac" >' + (i+1) + '</td>';
            _html += '<td>' + data[i].title + '</td>';
            _html += '<td>' + data[i].author + '</td>';
            _html += '<td>' + data[i].position + '</td>';
            _html += '<td class="t-ac" >';
                _html += '<a href="#" onClick="editBook(' + data[i].id + ')" ><span class="btn-floating" ><i class="material-icons">edit</i></span></a> ';
            _html += '</td>';
            _html += '<td class="t-ac" >';
                _html += '<a href="#" onClick="deleteBook(' + data[i].id + ')" ><span class="btn-floating red" ><i class="material-icons">delete_forever</i></span></a>';
            _html += '</td>';
        _html += '</tr>';
    }
    let bookTable = document.getElementById("booklist");
    bookTable.innerHTML = _html;
}

// delete record from database
function deleteBook(book_id){
    // alert(book_id);
    ipc.send("book:openDeleteWindow", book_id);
}

// delete record from database
function editBook(book_id){
    // alert(book_id);
    ipc.send("book:openEditWindow", book_id);
}

// delete record from database
function openAddWindow(){
    // alert(book_id);
    ipc.send("book:openAddWindow");
}

// delete record from database
function sortBy(field){
    // alert(field);
    ipc.send("sortBy", field);
}

// search database with keyword
function searchWithWord(val){
    // alert(val);
    ipc.send("searchWith", val);
}