export default async ({ request }: { request: Request }) => {
  switch (request.method) {
    case "POST": {
      try {
        const formData = await request.formData();
        const body = {
          personId: formData.get("personId") as string,
          videoId: formData.get("videoId") as string,
        };

        const result = await fetch(`http://localhost:5000/person/chip`, {
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
