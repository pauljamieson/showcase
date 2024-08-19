import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

type Tag = { id: number; name: string };

export default function TagSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState<string>("");
  const [options, setOptions] = useState<Tag[]>([]);
  const [active, setActive] = useState<string[]>(searchParams.getAll("tags"));

  useEffect(() => {
    if (input.length > 0) {
      const apiUrl = new URL("http://localhost:5000/tags");
      apiUrl.searchParams.set("terms", input);
      fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("showcase"),
        },
      })
        .then((resp) => resp.json())
        .then((data) => setOptions(data.tags));
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
          type="text"
          list="tags"
          name="tag-name"
          value={input}
          onChange={handleChange}
          autoComplete="off"
        />
        <datalist id="tags">
          {options.map((val) => (
            <option>{val.name}</option>
          ))}
        </datalist>
        <input type="submit" value="Add" />
      </form>
      <div className="chip-container">
        {active.length > 0 &&
          active.map((data) => (
            <p key={data} onClick={handleClick} id={data}>
              {data}
            </p>
          ))}
      </div>
    </div>
  );
}
