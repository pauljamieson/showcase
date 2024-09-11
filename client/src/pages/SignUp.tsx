import { Form, useActionData } from "react-router-dom";

type Data = {
  error: string;
};

export default function SignUp() {
  const actionData: Data = useActionData() as Data;
  return (
    <div className="signup-container">
      <Form className="signup-form" method="post">
        <h3>Signup</h3>
        <label htmlFor="display-name">Display Name</label>
        <input type="text" name="display-name" autoFocus />
        <label htmlFor="email">Email</label>
        <input type="email" name="email" />
        <label htmlFor="new-password">Password</label>
        <input type="password" name="new-password" />
        <label htmlFor="confirm-password">Confirm Password</label>
        <input type="password" name="confirm-password" />
        <button type="submit">SIGNUP</button>
        {actionData?.error && <p>{actionData?.error}</p>}
      </Form>
    </div>
  );
}
