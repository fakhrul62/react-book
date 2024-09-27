import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import BooksReadList from "../BooksReadList/BooksReadList";
import WishList from "../WishList/WishList";

const ListedBooks = () => {

  return (
    <div className="w-10/12 mx-auto my-5">
      <div className="bg-zinc-800 p-12 rounded-xl flex items-center justify-between">
        <h2 className="text-white font-black text-3xl">Listed Books</h2>
      </div>
      <div className="mt-10">
        <Tabs>
          <TabList>
            <Tab>Books Read</Tab>
            <Tab>Wishlist</Tab>
          </TabList>

          <TabPanel>
            <BooksReadList></BooksReadList>
          </TabPanel>
          <TabPanel>
            <WishList></WishList>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default ListedBooks;
