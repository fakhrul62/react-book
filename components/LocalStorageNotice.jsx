export default function LocalStorageNotice({ compact = false }) {
  return (
    <div className={`rounded-lg border border-gilt/35 bg-gilt/10 text-ink ${compact ? "px-4 py-3 text-xs" : "px-5 py-4 text-sm"}`}>
      Wishlist and Readlist data is saved only in this browser. It will not sync to another device and can be lost if browser data is cleared.
    </div>
  );
}
