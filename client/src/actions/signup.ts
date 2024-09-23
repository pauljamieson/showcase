//import { redirect } from "react-router-dom";

import { redirect } from "react-router-dom";
import apiRequest from "../lib/api";

export default async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    const body = {
      email: formData.get("email") as string,
      password: formData.get("new-password") as string,
      displayName: formData.get("display-name") as string,
    };
    if (body.displayName.length < 2)
      return {
        status: "failure",
        error: "Display name must be atleast 2 characters long.",
      };
    const confirmPassword = formData.get("confirm-password") as string;
    if (body.password !== confirmPassword)
      return { status: "failure", error: "Passwords don't match." };
    if (body.password.length < 8)
      return {
        status: "failure",
        error: "Password must be atleast 8 characters long.",
      };

    const { status, data } = await apiRequest({
      method: "post",
      endpoint: "/auth/signup/",
      body,
    });
    if (status === "failure" && data?.error?.code === "P2002") {
      throw "Email Address or Display Name already registered.";
    }
    if (status === "success") return redirect("/login");
    throw "Email Address or Display Name already registered.";
  } catch (error) {
    return { status: "failure", error: error, auth: undefined };
  }
};
