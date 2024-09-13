import apiRequest from "../lib/api";

export default async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const body = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    const { status } = await apiRequest({
      method: "post",
      endpoint: "/auth/login/",
      body,
    });

    return { status, data: { auth: localStorage.getItem("showcase") } };
  } catch (error: any) {
    console.error(error);
    return { status: "failure", auth: "" };
  }
};
