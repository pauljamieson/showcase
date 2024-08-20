export default async ({ request }: { request: Request }) => {
  switch (request.method) {
    case "GET": {
      try {
        const fetchData = await fetch("http://localhost:5000/admin/incoming/", {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("showcase"),
          },
        });

        const data = await fetchData.json();
        console.log(data);
        if (data.status === "success") {
          const token = fetchData.headers.get("Authorization");
          if (!token) throw "JWT header is missing";
          localStorage.setItem("showcase", token.substring(7));
          return { status: "success", files: data.data.files };
        } else if (data.status === "failure") throw data.error;
        break;
      } catch (error: any) {
        return { error };
      }
    }
    default: {
      throw new Response("", { status: 405 });
    }
  }
};
