import apiRequest from "../lib/api";

export default async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const body = {
    intent: formData.get("intent") as string,
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    newName: formData.get("newName") as string,
    migrateId: formData.get("migrateId") as string,
  };

  try {
    const { status, data, error } = await apiRequest({
      method: "post",
      endpoint: "/playlist/tag/",
      body,
    });

    return { status, data, error };
  } catch (error: any) {
    console.error(error);
    return { status: "failure", error };
  }
};
