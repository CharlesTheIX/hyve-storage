import { NextRequest, NextResponse } from "next/server";
import { header_external, SERVER_ERROR } from "@/globals";

export async function PUT(request: NextRequest) {
  try {
    const { name, max_size_bytes, company_id, permissions } = await request.json();
    const response = await fetch(`${process.env.API_ENDPOINT}/v1/buckets/create`, {
      method: "PUT",
      headers: header_external,
      body: JSON.stringify({ name, max_size_bytes, company_id, permissions }),
    }).then((res) => res.json());
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ ...SERVER_ERROR, data: err });
  }
}
