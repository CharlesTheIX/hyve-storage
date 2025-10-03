import { response_SERVER_ERROR } from "@/globals";

export default async (options?: Partial<ApiRequestOptions>): Promise<ApiResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users`, {
      method: "POST",
      body: JSON.stringify({ options }),
      headers: { "Content-Type": "application/json" },
    }).then((r) => r.json());
    return res;
  } catch (err: any) {
    return { ...response_SERVER_ERROR, data: err };
  }
};
