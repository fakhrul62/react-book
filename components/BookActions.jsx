"use client";

import { useState } from "react";
import { addReadlist, addWishlist } from "@/lib/localList";
import LocalStorageNotice from "@/components/LocalStorageNotice";
import { Icon } from "@/components/Icon";

const messages = {
  added: "Saved.",
  duplicate: "This book is already on that list.",
  "already-read": "This book is already in your Readlist."
};

export default function BookActions({ book }) {
  const [message, setMessage] = useState("");

  function handle(action) {
    const result = action === "read" ? addReadlist(book) : addWishlist(book);
    setMessage(messages[result]);
  }

  return (
    <div className="space-y-4">
      <LocalStorageNotice compact />
      <div className="flex flex-col gap-3 sm:flex-row">
        <button onClick={() => handle("read")} type="button" className="focus-ring inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-bold text-paper transition-colors duration-200 hover:bg-moss">
          <Icon name="bookmark" className="h-4 w-4" />
          Add to Readlist
        </button>
        <button onClick={() => handle("wishlist")} type="button" className="focus-ring inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-ink/20 bg-white/75 px-5 py-3 text-sm font-bold text-ink transition-colors duration-200 hover:border-plum hover:text-plum">
          <Icon name="heart" className="h-4 w-4" />
          Add to Wishlist
        </button>
      </div>
      {message ? <p className="text-sm text-ink/70" role="status">{message}</p> : null}
    </div>
  );
}
