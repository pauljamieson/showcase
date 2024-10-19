import { Params } from "react-router-dom";
import apiRequest from "../lib/api";

export default async ({
  params,
  request,
}: {
  params: Params<"id">;
  request: Request;
}) => {
  try {
    const url = new URL(request.url);
    const { status, data } = await apiRequest({
      method: "get",
      endpoint: `/video/${params.id}`,
      searchParams: url.searchParams,
    });

    if (status === "success")
      return { video: data.video, playlist: data.playlist };
    throw "Failed request to api.";
  } catch (error: any) {
    console.error(error);
    return { error };
  }
};
