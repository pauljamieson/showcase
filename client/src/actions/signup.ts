import { redirect } from "react-router-dom";

export default async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const body = {
    email: formData.get("email") as string,
    password: formData.get("new-password") as string,
    displayName: formData.get("display-name") as string,
  };
  if (body.displayName.length < 2)
    return { error: "Display name must be atleast 2 characters long." };
  const confirmPassword = formData.get("confirm-password") as string;
  if (body.password !== confirmPassword)
    return { error: "Passwords don't match." };
  if (body.password.length < 8)
    return { error: "Password must be atleast 8 characters long." };
  try {
    const resp = await fetch("http://localhost:5000/auth/signup", {
      method: "post",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const data = await resp.json();
    if (data.status === "success") return redirect("/");
    if (data.status === "failure" && data.error.code === "P2002")
      throw "Email Address or Display Name already registered.";
    return { status: "success", auth: data };
  } catch (error: any) {
    console.log(error);
    return { error };
  }
};
