import { Form, Navigate, useFormAction, useLoaderData } from "react-router-dom";
import useAuth from "../hooks/useAuth";

type LoaderData = {
  status: string;
  files: [string];
  error: string;
};

export default function Incoming() {
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn || !user?.admin) return <Navigate to="/" />;

  const data: LoaderData = useLoaderData() as LoaderData;
  
  if (data.status === "failure") return <p>Failed to fetch files</p>;
  return (
    <>
      <Form className="files-container" method="post">
        <div className="incoming-btn-container">
          <button type="submit" className="btn" name="intent" value="importall">
            Import All
          </button>
          <button type="submit" className="btn" name="intent" value="selected">
            Import Selected
          </button>
        </div>
        <input
          type="hidden"
          value={btoa(JSON.stringify({ files: data?.files }))}
          name="all"
        />
        {data?.files.map((file) => (
          <label key={btoa(file)}>
            <input type="checkbox" name={btoa(file)} />
            {file.slice(file.indexOf("/incoming/") + "/incoming/".length)}
          </label>
        ))}
      </Form>
    </>
  );
}
