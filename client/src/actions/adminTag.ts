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
    const { status } = await apiRequest({
      method: "post",
      endpoint: "/admin/tag/",
      body,
    });

    return { status };
  } catch (error: any) {
    console.error(error);
    return { status: "failure", error };
  }
};
