import { NextRequest, NextResponse } from "next/server";
import { header_external, response_SERVER_ERROR } from "@/globals";

export async function PUT(request: NextRequest) {
  try {
    const { firstName, surname, username, companyId, permissions } = await request.json();
    const response = await fetch(`${process.env.API_ENDPOINT}/v1/users/create`, {
      method: "PUT",
      headers: header_external,
      body: JSON.stringify({ firstName, surname, username, companyId, permissions }),
    }).then((res) => res.json());
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ ...response_SERVER_ERROR, data: err });
  }
}
