import { redirect } from "react-router-dom";

export default async ({ request }: { request: Request }) => {
  switch (request.method) {
    case "POST": {
      const formData = await request.formData();
      console.log("here");
      const body = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };
      console.log(body);
      try {
        const fetchData = await fetch("http://localhost:5000/auth/login/", {
          method: "post",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        });

        const data = await fetchData.json();
        console.log(data);
        if (data.status === "success") {
          const token = fetchData.headers.get("Authorization");
          console.log(token);
          if (!token) throw "JWT header is missing";
          localStorage.setItem("showcase", token.substring(7));
          return redirect("/");
        }
        if (data.status === "failure") throw data.error;
        return {};
      } catch (error: any) {
        return { error };
      }
    }
    default: {
      throw new Response("", { status: 405 });
    }
  }
};
