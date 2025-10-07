import { NextRequest, NextResponse } from "next/server";
import { header_external, SERVER_ERROR } from "@/globals";

export async function POST(request: NextRequest) {
  try {
    const { company_id, filters } = await request.json();
    const response = await fetch(`${process.env.API_ENDPOINT}/v1/buckets/by-company-id`, {
      method: "POST",
      headers: header_external,
      body: JSON.stringify({ company_id, filters }),
    }).then((res) => res.json());
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ ...SERVER_ERROR, data: err });
  }
}
