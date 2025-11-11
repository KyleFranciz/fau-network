import { Search } from "lucide-react";

// TODO: Add functionality later on
const SearchBar = () => {
  return (
    <div className="relative mx-auto w-[600px]">
      <input
        type="text"
        placeholder="Find events"
        className="w-full rounded-4xl border border-gray-300 p-4 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="button"
        aria-label="Search events"
        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800"
      >
        <Search className="h-5 w-5" />
      </button>
    </div>
  );
};

export default SearchBar;
