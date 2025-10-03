import { NextRequest, NextResponse } from "next/server";
import { header_external, response_SERVER_ERROR } from "@/globals";

export async function PATCH(request: NextRequest) {
  try {
    const { _id, bucketId } = await request.json();
    const response = await fetch(`${process.env.API_ENDPOINT}/v1/companies/add-bucket`, {
      method: "PATCH",
      headers: header_external,
      body: JSON.stringify({ _id, bucketId }),
    }).then((res) => res.json());
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ ...response_SERVER_ERROR, data: err });
  }
}
