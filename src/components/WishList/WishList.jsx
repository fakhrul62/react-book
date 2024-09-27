import { useEffect, useState } from "react";
import Book from "../Book/Book";

const WishList = () => {
    const [wishList, setWishList] = useState([]);

    useEffect(()=>{
        const getWishList = JSON.parse(localStorage.getItem("wishlist"));
        if(wishList){
            setWishList(getWishList);
        }
    }, [])
    return (
        <div className="mt-10">
            <div  className='grid grid-cols-4 gap-5'>
                {
                    wishList.length !== 0 ?  (wishList?.map(book => <Book key={book} book={book}></Book>)) : <p>Nothing here</p>
                        
                }
            </div>
        </div>
    );
};

export default WishList;