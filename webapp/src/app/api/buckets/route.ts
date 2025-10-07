import { NextRequest, NextResponse } from "next/server";
import { header_external, SERVER_ERROR } from "@/globals";

export async function POST(request: NextRequest) {
  console.log("david");
  try {
    const { filters } = await request.json();
    const response = await fetch(`${process.env.API_ENDPOINT}/v1/buckets`, {
      method: "POST",
      headers: header_external,
      body: JSON.stringify({ filters }),
    }).then((res) => res.json());
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ ...SERVER_ERROR, data: err });
  }
}
