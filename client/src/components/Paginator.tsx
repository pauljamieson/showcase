import React from "react";
import { useSearchParams } from "react-router-dom";

function Paginator({ count }: { count: number }) {
  const [searchParams, setSearchParams] = useSearchParams();

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const { value, name } = e.target as HTMLButtonElement;
    const curPage = parseInt(searchParams.get("page") || "1");
    switch (name) {
      case "next":
        if (curPage === count) break;
        searchParams.set("page", (curPage + 1).toString());
        setSearchParams(searchParams);
        break;
      case "previous":
        if (curPage === 1) break;
        searchParams.set("page", (curPage - 1).toString());
        setSearchParams(searchParams);
        break;
      case "goto":
        searchParams.set("page", value);
        setSearchParams(searchParams);
        break;
      default:
        break;
    }
  }

  return (
    <div className="pagination-container">
      <button onClick={handleClick} name="previous">
        &lt;
      </button>
      {count > 1 && (
        <button
          className={
            (+searchParams.get("page")! > 4
              ? +searchParams.get("page")! - 3
              : 1
            ).toString() === searchParams.get("page")
              ? "active"
              : ""
          }
          onClick={handleClick}
          name="goto"
          value={
            +searchParams.get("page")! > 4 ? +searchParams.get("page")! - 3 : 1
          }
        >
          {+searchParams.get("page")! > 4 ? +searchParams.get("page")! - 3 : 1}
        </button>
      )}
      {count > 2 && (
        <button
          className={
            (+searchParams.get("page")! > 4
              ? +searchParams.get("page")! - 2
              : 2
            ).toString() === searchParams.get("page")
              ? "active"
              : ""
          }
          onClick={handleClick}
          name="goto"
          value={
            +searchParams.get("page")! > 4 ? +searchParams.get("page")! - 2 : 2
          }
        >
          {+searchParams.get("page")! > 4 ? +searchParams.get("page")! - 2 : 2}
        </button>
      )}
      {count > 3 && (
        <button
          className={
            (+searchParams.get("page")! > 4
              ? +searchParams.get("page")! - 1
              : 3
            ).toString() === searchParams.get("page")
              ? "active"
              : ""
          }
          onClick={handleClick}
          name="goto"
          value={
            +searchParams.get("page")! > 4 ? +searchParams.get("page")! - 1 : 3
          }
        >
          {+searchParams.get("page")! > 4 ? +searchParams.get("page")! - 1 : 3}
        </button>
      )}
      {count > 4 && (
        <button
          className={
            (+searchParams.get("page")! > 4
              ? +searchParams.get("page")!
              : 4
            ).toString() === searchParams.get("page")
              ? "active"
              : ""
          }
          onClick={handleClick}
          name="goto"
          value={
            +searchParams.get("page")! > 4 ? +searchParams.get("page")! : 4
          }
        >
          {+searchParams.get("page")! > 4 ? +searchParams.get("page")! : 4}
        </button>
      )}

      <button onClick={handleClick} name="next">
        &gt;
      </button>
    </div>
  );
}

export default Paginator;
