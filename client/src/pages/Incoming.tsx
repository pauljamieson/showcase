import { Form, Navigate, useLoaderData } from "react-router-dom";
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
          value={btoa(
            encodeURIComponent(JSON.stringify({ files: data?.files }))
          )}
          name="all"
        />
        <div className="file-names">
          {data?.files?.length > 0 ? (
            data?.files?.map((file) => (
              <label key={btoa(encodeURIComponent(file))}>
                <input type="checkbox" name={btoa(encodeURIComponent(file))} />
                {file.slice(file.indexOf("/incoming/") + "/incoming/".length)}
              </label>
            ))
          ) : (
            <div>No Files Found.</div>
          )}
        </div>
      </Form>
    </>
  );
}
