"use client";

import { useSearchContext } from "@/lib/hooks";

export default function SearchForm() {
  const { searchQuery, handleChangeSearchQuery } = useSearchContext();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChangeSearchQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full h-full">
      {/* remove outline but must add another indicator that input is focused */}
      <input
        value={searchQuery}
        className={`
        w-full h-full bg-white/20 rounded-md px-5 outline-none transition focus:bg-white/40 hover:bg-white/30 
        placeholder:text-white/50 text-white font-medium tracking-wide text-lg`}
        placeholder="Search pets"
        type="search"
        onChange={handleChange}
      />
    </form>
  );
}
