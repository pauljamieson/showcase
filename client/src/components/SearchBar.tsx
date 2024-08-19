import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState<string>(searchParams.get("search") || "");
  //React.FormEvent<HTMLFormElement>
  function handleSubmit(e: any) {
    e.preventDefault();
    const {
      target: {
        searchTerms: { value },
      },
    } = e;
    value.length > 0
      ? searchParams.set("search", value)
      : searchParams.delete("search");
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="search"
        name="searchTerms"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </form>
  );
}
