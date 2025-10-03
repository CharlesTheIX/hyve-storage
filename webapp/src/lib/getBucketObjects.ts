import { response_SERVER_ERROR } from "@/globals";

export default async (bucketId: string): Promise<ApiResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/buckets/objects`, {
      method: "POST",
      body: JSON.stringify({ bucketId }),
      headers: { "Content-Type": "application/json" },
    }).then((r) => r.json());
    return res;
  } catch (err: any) {
    return { ...response_SERVER_ERROR, data: err };
  }
};
