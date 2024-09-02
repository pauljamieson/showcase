export default async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const body = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    const fetchData = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/login/`,
      {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await fetchData.json();
    if (data.status === "success") {
      const token = fetchData.headers.get("Authorization");
      if (!token) throw "JWT header is missing";
      localStorage.setItem("showcase", token.substring(7));
      return { status: "success", auth: token.substring(7) };
    }
    throw data.error;
  } catch (error: any) {
    console.error(error);
    return { status: "failure", auth: "" };
  }
};
