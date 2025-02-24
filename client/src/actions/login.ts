import apiRequest from "../lib/api";

export default async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const body = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    const { status, error } = await apiRequest({
      method: "post",
      endpoint: "/auth/login/",
      body,
    });
    if (status === "failure") throw error;
    return { status, data: { auth: localStorage.getItem("showcase") } };
  } catch (error: any) {
    //console.error(error);

    return { status: "failure", error, auth: "" };
  }
};
