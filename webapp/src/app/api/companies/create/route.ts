import { NextRequest, NextResponse } from "next/server";
import { header_external, SERVER_ERROR } from "@/globals";

export async function PUT(request: NextRequest) {
  try {
    const { name, user_ids } = await request.json();
    const response = await fetch(`${process.env.API_ENDPOINT}/v1/companies/create`, {
      method: "PUT",
      headers: header_external,
      body: JSON.stringify({ name, user_ids }),
    }).then((res) => res.json());
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ ...SERVER_ERROR, data: err });
  }
}
