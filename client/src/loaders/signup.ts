import { redirect } from "react-router-dom";
import apiRequest from "../lib/api";

export default async () => {
  try {
    const { status, data } = await apiRequest({
      method: "get",
      endpoint: "/admin/configuration",
    });

    const allowSignups =
      data.config.find(
        (c: { key: string; value: string }) => c.key === "allow_signup"
      ).value === "true"
        ? true
        : false;

    if (!allowSignups) {
      return redirect("/");
    }
    if (status === "success") return { allowSignups };
    throw "Failed request to api.";
  } catch (error: any) {
    console.error(error);
    return { status: "failure", error };
  }
};
