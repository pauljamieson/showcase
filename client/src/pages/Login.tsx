import { Form, Navigate, useActionData } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

type Data = {
  status: string;
  auth: string;
  error: string;
};

export default function Login() {
  const { auth, setToken } = useAuth();
  if (auth && auth.length > 0) return <Navigate to="/" />;

  const actionData: Data = useActionData() as Data;

  useEffect(() => {
    if (actionData && actionData?.status === "success")
      setToken(actionData.auth);
  }, [actionData]);

  return (
    <div className="login-container">
      <Form className="login-form" method="post">
        <h3>Login</h3>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" autoFocus />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" autoComplete="true" />
        <button type="submit">LOGIN</button>
        {actionData?.error && <p>{actionData.error}</p>}
      </Form>
    </div>
  );
}
