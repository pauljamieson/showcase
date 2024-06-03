import { Form, useActionData } from "react-router-dom";

type Data = {
  error: string;
};

export default function Login() {
  const actionData: Data = useActionData() as Data;
  return (
    <div className="login-container">
      <Form className="login-form" method="post">
        <h3>Login</h3>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" />
        <button type="submit">LOGIN</button>
        {actionData && actionData?.error && <p>{actionData?.error}</p>}
      </Form>
    </div>
  );
}
