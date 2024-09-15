import React from 'react';
import { IoBookmarkOutline, IoStarOutline  } from "react-icons/io5";
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const Book = ({book}) => {
    const {id, name, author, cover_image, category, review, tags, number_of_pages, publisher, year_of_publishing, rating} = book;
    return (
        <div className='p-5 border border-zinc-300 rounded-xl shadow-lg flex flex-col'>
            <NavLink to={`/book/${id}`}>
                <div className='text-center bg-gray-100 rounded-xl p-5'>
                <img src={cover_image} alt={name} className='rounded-lg h-[200px] inline-block' />
            </div>
            <div className='flex flex-wrap gap-x-1 my-5'>
                {
                    tags.slice(0, 3).map((tag, idx)=> <span className='bg-gray-300 py-1 px-2 rounded-full text-xs' key={idx}>{tag}</span>)
                }
            </div>
            <div className='flex-grow'>
                <h2 className='text-xl font-bold text-black'>{name}</h2>
                <h3 className='text-sm text-zinc-600 font-bold'>{author}</h3>
            </div>
            <hr className='my-5' />
            <div className='flex justify-between'>
                <p className='flex items-center gap-x-1 text-sm'><IoBookmarkOutline />{category}</p>
                <p className='flex items-center gap-x-1 text-sm'><IoStarOutline />{rating}</p>
            </div>
            </NavLink>
        </div>
    );
};
Book.propTypes = {
    book: PropTypes.any,
};

export default Book;