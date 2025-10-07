import { header_internal, SERVER_ERROR } from "@/globals";

export default async (_id: string, filters?: Partial<ApiRequestFilters>): Promise<ApiResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/by-id`, {
      method: "POST",
      headers: header_internal,
      body: JSON.stringify({ _id, filters }),
    }).then((r) => r.json());
    return res;
  } catch (err: any) {
    return { ...SERVER_ERROR, data: err };
  }
};
