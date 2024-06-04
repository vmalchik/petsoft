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

// NOTE: How to use Zustand instead of React Context
// https://medium.com/@mak-dev/zustand-with-next-js-14-server-components-da9c191b73df#:~:text=Server%2Dside%20components%20are%20meant,%E2%80%9Cstate%E2%80%9D%20inside%20the%20server.

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
