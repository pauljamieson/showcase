import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiRequest from "../lib/api";

type Tag = { id: number; name: string };

export default function TagSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState<string>("");
  const [options, setOptions] = useState<Tag[]>([]);
  const [active, setActive] = useState<string[]>(searchParams.getAll("tags"));

  useEffect(() => {
    if (input.length > 0) {
      const sp = new URLSearchParams();
      sp.set("terms", input.trim());

      apiRequest({ method: "get", endpoint: "/tags", searchParams: sp }).then(
        (resp) => {
          resp.status === "success" && setOptions(resp.data.tags);
        }
      );
    }
  }, [input]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const { value } = e.target;
    setInput(value);
    if (value.length === 0) setOptions([]);
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    const tags = searchParams.getAll("tags");
    if (!tags.includes(input) && options.map((v) => v.name).includes(input)) {
      searchParams.append("tags", input);
      searchParams.set("page", "1");
      setSearchParams(searchParams);
      setActive(searchParams.getAll("tags"));
      setInput("");
    }
  }

  function handleClick(e: any) {
    const tags = searchParams.getAll("tags");
    searchParams.delete("tags");
    tags
      .filter((v) => v !== e.target.id)
      .forEach((v) => searchParams.append("tags", v));
    setActive(searchParams.getAll("tags"));
    setSearchParams(searchParams);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          className="text-input"
          type="text"
          list="tags"
          name="tag-name"
          value={input}
          onChange={handleChange}
          autoComplete="off"
          placeholder="Tags"
        />
        <datalist id="tags">
          {options.map((val) => (
            <option>{val.name}</option>
          ))}
        </datalist>
        <input className="btn" type="submit" value="Add" />
      </form>
      <div className="chip-container">
        {active.length > 0 &&
          active.map((data) => (
            <div
              className="chip-sm hover"
              key={data}
              onClick={handleClick}
              id={data}
            >
              {data}
            </div>
          ))}
      </div>
    </div>
  );
}
