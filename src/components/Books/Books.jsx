import React, { useEffect, useState } from 'react';
import Book from '../Book/Book';

const Books = () => {

    const [books, setBooks]  = useState([]);
    useEffect(()=>{
        fetch('books.json')
        .then(res=> res.json())
        .then(data=> setBooks(data))
    }, []);
    return (
        <div className='w-10/12 mx-auto mb-10'>
            <div className='text-center my-10'>
                <h3 className='font-extrabold text-4xl text-black'>Books : {books.length}</h3>
            </div>
            <div className='grid grid-cols-4 gap-5'>
                {
                    books.map((book, idx)=> <Book key={idx} book={book}></Book>)
                }
            </div>
        </div>
    );
};

export default Books;