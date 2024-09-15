import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const ListedBooks = () => {
    return (
        <div className="w-10/12 mx-auto my-5">
      <div className="bg-zinc-800 p-12 rounded-xl flex items-center justify-between">
        <h2 className="text-white font-black text-3xl">Listed Books</h2>
        <button
          className="bg-[#00d8ff] text-black px-8 py-3 rounded-xl text-sm"
          type="button"
        >
          Sort By
        </button>
      </div>
      <div className="mt-10">
        <Tabs>
          <TabList>
            <Tab>Books Read</Tab>
            <Tab>Wishlist</Tab>
          </TabList>

          <TabPanel>
          <h4>Reads</h4>
          </TabPanel>
          <TabPanel>
            <h4>Wishlist</h4>
          </TabPanel>
        </Tabs>
      </div>
    </div>
    );
};

export default ListedBooks;