// functions that get book data from database - models
module.exports = { 
    // send book item data
    getBookData: function(knex, book_id){
        // console.log(book_id);
        let result = knex.select('id', 'title', 'author', 'position')
                        .from("books")
                        .where('id', '=', book_id);
        return result;
    },
    // send book title 
    getBookTitle: function( knex, book_id){
        // console.log(book_id);
        let result = knex.select('id', 'title')
                        .from("books")
                        .where('id', '=', book_id);
        return result;
    },
    // send book lists
    getBookList: function( knex, _sortBy_ = '', _sortOrd_ = 'ASC' , _searchKey_ = '' ){
        // console.log(_sortBy);
    
        let result;
    
        if (_searchKey_!=='')
            result = knex.where('title', 'like', '%' + _searchKey_ + '%')
                         .orWhere('author', 'like', '%' + _searchKey_ + '%')
                         .orWhere('position', 'like', '%' + _searchKey_ + '%')
                         .select('id', 'title', 'author', 'position')
                         .from("books")
                         .orderBy(_sortBy_, _sortOrd_);
       else 
            result = knex.select('id', 'title', 'author', 'position')
                         .from("books")
                         .orderBy(_sortBy_, _sortOrd_);
    
        return result;
    },

    // insert Book
    insertBook: function( knex, book ){
        // console.log(_sortBy);
        return result = knex('books').insert(book);
    },

    // update Book
    updateBook: function( knex, book ){
        // console.log(_sortBy);
        return result = knex('books').where('id', book.id).update(book);
    },

    // delete Book
    deleteBook: function( knex, book_id ){
        // console.log(_sortBy);
        return result = knex('books').where('id', book_id).del();
    }
}