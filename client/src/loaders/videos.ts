export default async ({ request }: { request: Request }) => {
  switch (request.method) {
    case "GET": {
      try {
        const url = new URL(request.url);
        const page = url.searchParams.get("page");
        const limit = url.searchParams.get("limit") || "8";
        const apiUrl = new URL("http://localhost:5000/videos");
        if (page) apiUrl.searchParams.set("page", page);
        if (limit) apiUrl.searchParams.set("limit", limit);
        const resp = await fetch(apiUrl, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("showcase"),
          },
        });
        const { status, data } = await resp.json();
        if (status === "success")
          return { files: data.files, count: Math.ceil(data.count / +limit) };
        throw "Failed to get files from api.";
      } catch (error: any) {
        console.log(error);
        return { error };
      }
    }
    default: {
      throw new Response("", { status: 405 });
    }
  }
};
