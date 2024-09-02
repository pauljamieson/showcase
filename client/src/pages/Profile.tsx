import { Form, useLoaderData } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

type LoaderData = {
  status: string;
  profile: {
    createdAt: Date;
    displayname: string;
    id: number;
    role: string;
  };
};

export default function Profile() {
  const { clearToken, isLoggedIn } = useAuth();

  if (!isLoggedIn) return <Navigate to="/" />;
  const loader: LoaderData = useLoaderData() as LoaderData;

  if (loader.status === "failure") return <div>Profile not found</div>;

  return (
    <div className="profile-container">
      <Form>
        <label>
          Display Name:
          <input type="text" value={loader.profile.displayname} />
        </label>
      </Form>

      <button className="btn" onClick={() => clearToken()}>
        LogOut
      </button>
    </div>
  );
}
