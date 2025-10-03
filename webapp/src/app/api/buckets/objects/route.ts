import { NextRequest, NextResponse } from "next/server";
import { header_external, response_SERVER_ERROR } from "@/globals";

export async function POST(request: NextRequest) {
  try {
    const { bucketId } = await request.json();
    const response = await fetch(`${process.env.API_ENDPOINT}/v1/buckets/objects`, {
      method: "POST",
      headers: header_external,
      body: JSON.stringify({ bucketId }),
    }).then((res) => res.json());
    console.log(response);
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ ...response_SERVER_ERROR, data: err });
  }
}
