import { useEffect, useState } from "react";
import Book from "../Book/Book";

const BooksReadList = () => {
    const [booksReadList, setBooksReadList] = useState([]);
    useEffect(()=>{
        const getBooksRead = JSON.parse(localStorage.getItem("booksRead"));
        if(booksReadList){
            setBooksReadList(getBooksRead);
        }
        
    }, [])
    return (
        <div className="mt-10">
            <div  className='grid grid-cols-4 gap-5'>
                {
                    booksReadList? (booksReadList.map(book => <Book key={book} book={book}></Book>)) : <p>Nothing here</p>
                }
            </div>
        </div>
    );
};

export default BooksReadList;