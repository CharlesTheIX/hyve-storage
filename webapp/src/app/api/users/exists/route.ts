import { NextRequest, NextResponse } from "next/server";
import { header_external, response_SERVER_ERROR } from "@/globals";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    const response = await fetch(`${process.env.API_ENDPOINT}/v1/users/exists`, {
      method: "POST",
      headers: header_external,
      body: JSON.stringify({ username }),
    }).then((res) => res.json());
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ ...response_SERVER_ERROR, data: err });
  }
}
