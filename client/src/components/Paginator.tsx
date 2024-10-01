import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function Paginator({ count }: { count: number }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const limit = searchParams.get("limit") || 8;
  const pageCount = Math.ceil(count / +limit);

  

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    window.scrollTo(0, 0);
    const { value, name } = e.target as HTMLButtonElement;
    const curPage = parseInt(searchParams.get("page") || "1");
    switch (name) {
      case "next":
        if (curPage === pageCount) break;
        searchParams.set("page", (curPage + 1).toString());
        sessionStorage.setItem("page", (curPage + 1).toString());
        setSearchParams(searchParams);
        break;
      case "previous":
        if (curPage === 1) break;
        searchParams.set("page", (curPage - 1).toString());
        sessionStorage.setItem("page", (curPage - 1).toString());
        setSearchParams(searchParams);
        break;
      case "goto":
        searchParams.set("page", value);
        sessionStorage.setItem("page", value.toString());
        setSearchParams(searchParams);
        break;
      default:
        break;
    }
  }

  return (
    <div className="pagination-container">
      ({count})
      <button onClick={handleClick} name="previous">
        &lt;
      </button>
      {pageCount <= 5 ? (
        // less then 5 pages
        <>
          {[...Array(pageCount)].map((_, i) => (
            <button
              key={i.toString()}
              className={+searchParams.get("page")! === i + 1 ? "active" : ""}
              onClick={handleClick}
              name="goto"
              value={i + 1}
            >
              {i + 1}
            </button>
          ))}
        </>
      ) : // more then 5 pages first 3
      +searchParams.get("page")! < 3 ? (
        <>
          {[...Array(4)].map((_, i) => (
            <button
              key={i.toString()}
              className={+searchParams.get("page")! === i + 1 ? "active" : ""}
              onClick={handleClick}
              name="goto"
              value={i + 1}
            >
              {i + 1}
            </button>
          ))}
          <button
            className={+searchParams.get("page")! === pageCount ? "active" : ""}
            onClick={handleClick}
            name="goto"
            value={pageCount}
          >
            {pageCount}
          </button>
        </>
      ) : //more then 5 pages last 3
      +searchParams.get("page")! > pageCount - 3 ? (
        <>
          <button
            className={+searchParams.get("page")! === 1 ? "active" : ""}
            onClick={handleClick}
            name="goto"
            value={1}
          >
            1
          </button>
          {[...Array(3)].map((_, i) => (
            <button
              key={i.toString()}
              className={
                +searchParams.get("page")! === pageCount - 3 + i ? "active" : ""
              }
              onClick={handleClick}
              name="goto"
              value={pageCount - 3 + i}
            >
              {pageCount - 3 + i}
            </button>
          ))}{" "}
          <button
            className={+searchParams.get("page")! === pageCount ? "active" : ""}
            onClick={handleClick}
            name="goto"
            value={pageCount}
          >
            {pageCount}
          </button>
        </>
      ) : (
        //more then 5 but not last or first 3
        <>
          <button
            className={+searchParams.get("page")! === 1 ? "active" : ""}
            onClick={handleClick}
            name="goto"
            value={1}
          >
            1
          </button>
          {[...Array(3)].map((_, i) => (
            <button
              key={i.toString()}
              className={
                +searchParams.get("page")! ===
                +searchParams.get("page")! - 1 + i
                  ? "active"
                  : ""
              }
              onClick={handleClick}
              name="goto"
              value={+searchParams.get("page")! - 1 + i}
            >
              {+searchParams.get("page")! - 1 + i}
            </button>
          ))}

          <button
            className={+searchParams.get("page")! === pageCount ? "active" : ""}
            onClick={handleClick}
            name="goto"
            value={pageCount}
          >
            {pageCount}
          </button>
        </>
      )}
      <button onClick={handleClick} name="next">
        &gt;
      </button>
    </div>
  );
}

export default Paginator;
