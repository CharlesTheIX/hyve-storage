import { NextRequest, NextResponse } from "next/server";
import { header_external, SERVER_ERROR } from "@/globals";

export async function PUT(request: NextRequest) {
  try {
    const { first_name, surname, username, company_id, permissions } = await request.json();
    const response = await fetch(`${process.env.API_ENDPOINT}/v1/users/create`, {
      method: "PUT",
      headers: header_external,
      body: JSON.stringify({ first_name, surname, username, company_id, permissions }),
    }).then((res) => res.json());
    console.log(response);
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ ...SERVER_ERROR, data: err });
  }
}
