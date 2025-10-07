import { header_internal, SERVER_ERROR } from "@/globals";

export default async (filters?: Partial<ApiRequestFilters>): Promise<ApiResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/companies`, {
      method: "POST",
      headers: header_internal,
      body: JSON.stringify({ filters }),
    }).then((r) => r.json());
    return res;
  } catch (err: any) {
    return { ...SERVER_ERROR, data: err };
  }
};
