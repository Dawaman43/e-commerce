import { Search } from "lucide-react";

function SearchBar() {
  return (
    <div className="flex items-center w-full max-w-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm overflow-hidden px-4 py-2">
      <input
        type="text"
        placeholder="Search a product..."
        className="flex-1 bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500"
      />
      <Search className="w-5 h-5 text-gray-500 dark:text-gray-200" />
    </div>
  );
}

export default SearchBar;
