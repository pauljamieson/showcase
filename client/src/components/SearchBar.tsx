import React from "react";
import { useSearchParams, Form } from "react-router-dom";

export default function SearchBar() {
  const [params, setParams] = useSearchParams();

  //React.FormEvent<HTMLFormElement>
  function handleSubmit(e: any) {
    e.preventDefault();
    const {
      target: {
        searchTerms: { value },
      },
    } = e;
    value.length > 0 ? params.set("search", value) : params.delete("search");
    params.set("page", "1");
    setParams(params);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="search" name="searchTerms" />
    </form>
  );
}
