import apiRequest from "../lib/api";

async function POST(request: Request) {
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
}

async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const { status, data } = await apiRequest({
      method: "get",
      endpoint: "/tags/",
      searchParams: url.searchParams,
    });
    if (status === "success") return { tags: data.tags };
    throw "Failed request to api.";
  } catch (error: any) {
    console.error(error);
    return { tags: [] };
  }
}

export default async ({ request }: { request: Request }) => {
  console.log(request);
  if (request.method.toLowerCase() === "post") return await POST(request);
  if (request.method.toLowerCase() === "get") return await GET(request);
  return { status: "failure", error: "Unsupported method." };
};

      