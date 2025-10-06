import { header_internal, response_SERVER_ERROR } from "@/globals";

export default async (_id: string, options?: Partial<ApiRequestOptions>): Promise<ApiResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/buckets/by-id`, {
      method: "POST",
      headers: header_internal,
      body: JSON.stringify({ _id, options }),
    }).then((r) => r.json());
    return res;
  } catch (err: any) {
    return { ...response_SERVER_ERROR, data: err };
  }
};
