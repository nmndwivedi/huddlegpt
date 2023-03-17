import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Search = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string | null;
  setSearchQuery: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  return (
    <div className="w-full sm:max-w-xs">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          id="search"
          name="search"
          className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-emerald-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
          placeholder="Search Prompts"
          type="search"
          value={searchQuery || ""}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center pl-3">
          <XMarkIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div> */}
      </div>
    </div>
  );
};

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  return {
    Search,
    searchQuery,
    setSearchQuery,
  };
};
