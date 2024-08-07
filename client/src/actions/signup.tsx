import { redirect } from "react-router-dom";

export default async ({ request }: { request: Request }) => {
  switch (request.method) {
    case "POST": {
      const formData = await request.formData();
      const body = {
        email: formData.get("email") as string,
        password: formData.get("new-password") as string,
      };

      const confirmPassword = formData.get("confirm-password") as string;
      if (body.password !== confirmPassword)
        return { error: "Passwords don't match." };
      if (body.password.length < 8)
        return { error: "Password must be atleast 8 characters long." };
      try {
        const fetchData = await fetch("http://localhost:5000/auth/signup", {
          method: "post",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        });
        const data = await fetchData.json();
        if (data.status === "success") return redirect("/");
        if (data.status === "failure" && data.error.code === "P2002")
          throw "Email address already registerd.";
        return { status: "success", auth: data };
      } catch (error: any) {
        return { error };
      }
    }
    default: {
      throw new Response("", { status: 405 });
    }
  }
};
