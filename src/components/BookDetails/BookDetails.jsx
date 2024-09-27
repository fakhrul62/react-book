import React, { useEffect } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { IoBookOutline } from "react-icons/io5";
import Swal from "sweetalert2";

const BookDetails = () => {
  const books = useLoaderData();
  const { id } = useParams();
  const intId = parseInt(id);
  const book = books?.find((book) => book.id === intId);

  useEffect(()=>{
    
  }, [])
  
  const {
    name,
    author,
    cover_image,
    category,
    review,
    tags,
    number_of_pages,
    publisher,
    year_of_publishing,
    rating,
  } = book;

  const addToBooksRead = () => {
    const addedArray = [];
    const getBooksRead = JSON.parse(localStorage.getItem("booksRead"));
    if (!getBooksRead) {
      addedArray.push(book);
      const getWishList = JSON.parse(localStorage.getItem("wishlist"));
      const newWishList = getWishList?.filter((book) => book.id !== intId);
      localStorage.setItem("booksRead", JSON.stringify(addedArray));
      localStorage.setItem("wishlist", JSON.stringify(newWishList));
      Swal.fire({
        title: "Added!",
        text: "Book Added to Books Read List!",
        icon: "success",
      });
    }
    else {
      const isExist = getBooksRead?.find((book) => book.id === intId);
      if (!isExist) {
        addedArray.push(...getBooksRead, book);
        const getWishList = JSON.parse(localStorage.getItem("wishlist"));
        const newWishList = getWishList?.filter((book) => book.id !== intId);
        localStorage.setItem("wishlist", JSON.stringify(newWishList));
        localStorage.setItem("booksRead", JSON.stringify(addedArray));
        Swal.fire({
          title: "Added!",
          text: "Book Added to Books Read List!",
          icon: "success",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Books Already on the List!",
        });
      }
    }
  };
  const addToWishList = () => {
    const addedArray = [];
    const getWishList = JSON.parse(localStorage.getItem("wishlist"));
    const getBooksRead = JSON.parse(localStorage.getItem("booksRead"));
    const isExistOnBooksRead = getBooksRead?.find((book) => book.id === intId);
    if (!getWishList) {
      if (getBooksRead && !isExistOnBooksRead) {
        addedArray.push(book);
        localStorage.setItem("wishlist", JSON.stringify(addedArray));
        Swal.fire({
          title: "Added!",
          text: "Book Added to Wishlist!",
          icon: "success",
        });
      } 
      else if (!getBooksRead) {
        addedArray.push(book);
        localStorage.setItem("wishlist", JSON.stringify(addedArray));
        Swal.fire({
          title: "Added!",
          text: "Book Added to Wishlist!",
          icon: "success",
        });
      } 
      else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Already Read it!",
        });
      }
    } 
    else {
      const isExist = getWishList?.find((book) => book.id === intId);
      if (!isExist) {
        if (!isExistOnBooksRead) {
          addedArray.push(...getWishList, book);
          localStorage.setItem("wishlist", JSON.stringify(addedArray));
          Swal.fire({
            title: "Added!",
            text: "Book Added to Wishlist!",
            icon: "success",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Already Read it!",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Books Already on the List!",
        });
      }
    }
  };

  return (
    <div className="w-10/12 mx-auto my-5 grid grid-cols-2 gap-10">
      <div className=" p-10 rounded-xl">
        <img
          src={cover_image}
          alt={name}
          className="rounded-lg w-1/2 mx-auto drop-shadow-[15px_15px_10px_rgba(0,0,0,0.25)]"
        />
      </div>
      <div className="flex flex-col justify-center">
        <h2 className="capitalize font-bold text-3xl text-black">{name}</h2>
        <p className="text-zinc-600 mt-3">
          By: <span>{author}</span>
        </p>
        <p className="font-semibold text-base flex items-center gap-2 my-5">
          <IoBookOutline /> {category}
        </p>
        <hr className="mb-5" />
        <p className="text-zinc-800">
          <span className="font-semibold">Review: </span> <span>{review}</span>
        </p>
        <p className="text-zinc-800 my-2">
          <span className="font-semibold">Tags: </span>
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-blue-700 font-bold"
            >{` #${tag} `}</span>
          ))}
        </p>
        <hr className="my-5" />
        <div className="grid grid-cols-[30%_70%]">
          <div>
            <p className="text-zinc-700">
              <span>Number of Pages: </span>
            </p>
            <p className="text-zinc-700">
              <span>Publisher: </span>
            </p>
            <p className="text-zinc-700">
              <span>Year of Publishing: </span>
            </p>
            <p className="text-zinc-700">
              <span>Rating: </span>
            </p>
          </div>
          <div>
            <p className="text-zinc-700">
              <span className="text-black font-semibold">
                {number_of_pages}
              </span>
            </p>
            <p className="text-zinc-700">
              <span className="text-black font-semibold">{publisher}</span>
            </p>
            <p className="text-zinc-700">
              <span className="text-black font-semibold">
                {year_of_publishing}
              </span>
            </p>
            <p className="text-zinc-700">
              <span className="text-black font-semibold">{rating}</span>
            </p>
          </div>
        </div>
        <div className="mt-10 flex gap-5">
          <button
            onClick={addToBooksRead}
            className="bg-white border border-zinc-800 hover:border-zinc-400 px-10 py-3 rounded-xl hover:text-black hover:bg-zinc-300 duration-300"
            type="button"
          >
            Read
          </button>

          <button
            onClick={addToWishList}
            className="hover:bg-zinc-600 text-white border border-zinc-800 px-10 py-3 rounded-xl hover:text-zinc-100 bg-zinc-800 duration-300"
            type="button"
          >
            Wishlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
