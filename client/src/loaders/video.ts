import { Params } from "react-router-dom";
import apiRequest from "../lib/api";

export default async ({ params }: { params: Params<"id"> }) => {
  try {
    const { status, data } = await apiRequest({
      method: "get",
      endpoint: `/video/${params.id}`,
    });

    if (status === "success") return { video: data.video };
    throw "Failed request to api.";
  } catch (error: any) {
    console.error(error);
    return { error };
  }
};
