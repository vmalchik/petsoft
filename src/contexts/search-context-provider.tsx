"use client";
import { createContext, useState } from "react";

type TSearchContext = {
  searchQuery: string;
  handleChangeSearchQuery: (value: string) => void;
};

type SearchContextProviderProps = {
  children: React.ReactNode;
};

export const SearchContext = createContext<TSearchContext | null>(null);

export default function SearchContextProvider({
  children,
}: SearchContextProviderProps) {
  // state
  const [searchQuery, setSearchQuery] = useState("");

  // handlers
  const handleChangeSearchQuery = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        handleChangeSearchQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
