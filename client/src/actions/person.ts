export default async ({ request }: { request: Request }) => {
  switch (request.method) {
    case "POST": {
      try {
        const formData = await request.formData();
        const body = {
          name: formData.get("person-name") as string,
          videoId: formData.get("video-id") as string,
        };
        console.log(body);
        const result = await fetch(`http://localhost:5000/person/`, {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("showcase"),
          },
        });
        console.log(result);
        return { status: "success" };
      } catch (error) {
        return { status: "failure" };
      }
    }
  }
};
