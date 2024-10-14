import { Params } from "react-router-dom";
import apiRequest from "../lib/api";

export default async ({ params }: { params: Params<"id"> }) => {
  try {
    const { status, data, error } = await apiRequest({
      method: "get",
      endpoint: `/playlist/${params.id}`,
    });

    if (status === "success") return { status, data, error };
    throw "Failed request to api.";
  } catch (error: any) {
    console.error(error);
    return { status: "failure", error };
  }
};
