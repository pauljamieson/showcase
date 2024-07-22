import { Form, Navigate, redirect, useActionData } from "react-router-dom";
import useAuth from "../hooks/useAuth";

type Data = {
  status: string;
  auth: string;
  error: string;
};

export default function Login() {
  const { auth } = useAuth();

  if (auth) <Navigate to="/" />;
  const actionData: Data = useActionData() as Data;

  return (
    <div className="login-container">
      <Form className="login-form" method="post">
        <h3>Login</h3>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" autoComplete="true" />
        <button type="submit">LOGIN</button>
        {actionData &&
          actionData?.error &&
          typeof actionData?.error === "string" && <p>{actionData?.error}</p>}
      </Form>
    </div>
  );
}
