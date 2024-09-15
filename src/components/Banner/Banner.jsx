import React from "react";

const Banner = () => {
  return (
    <div className=" bg-zinc-100 p-28 rounded-xl grid grid-cols-2 mt-6 mb-32">
      <div className="flex flex-col justify-center">
        <h1 className="text-6xl">Find your kind of book</h1>
        <p className="mt-6 text-zinc-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed
          dignissimos perferendis eligendi delectus, repellat repudiandae!
        </p>
        <div className="mt-5">
          <button className="btn bg-zinc-800 text-white border border-zinc-800 hover:bg-white hover:text-zinc-800  hover:border-zinc-800">
            Search Books
          </button>
        </div>
      </div>
      <div className="flex justify-end">
        <img
          className="w-5/12 drop-shadow-[15px_15px_10px_rgba(0,0,0,0.25)]"
          src="https://i.ibb.co/hXLMmrs/81qow-Ojrn-QL-SL1500-removebg-preview.png"
        />
      </div>
    </div>
  );
};

export default Banner;
