export default async ({ request }: { request: Request }) => {
  switch (request.method) {
    case "POST": {
      const formData = await request.formData();
      const body = {
        intent: formData.get("intent") as string,
        videoId: formData.get("videoId") as string,
      };
      await fetch(`http://localhost:5000/video/${body.videoId}`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("showcase"),
        },
      });
      
      return { status: "success" };
    }
  }
};
