import { header_internal, response_SERVER_ERROR } from "@/globals";

export default async (bucketId: string): Promise<ApiResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/buckets/objects`, {
      method: "POST",
      headers: header_internal,
      body: JSON.stringify({ bucketId }),
    }).then((r) => r.json());
    return res;
  } catch (err: any) {
    return { ...response_SERVER_ERROR, data: err };
  }
};
