export default async ({ request }: { request: Request }) => {
  switch (request.method) {
    case "POST": {
      const formData = await request.formData();
      const body = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };

      try {
        const fetchData = await fetch("http://localhost:5000/auth/login/", {
          method: "post",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        });

        const data = await fetchData.json();
        if (data.status === "success") {
          const token = fetchData.headers.get("Authorization");
          if (!token) throw "JWT header is missing";
          localStorage.setItem("showcase", token.substring(7));
          return { status: "success", auth: token.substring(7) };
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
