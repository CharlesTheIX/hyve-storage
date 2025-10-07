import { SERVER_ERROR } from "@/globals";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(`${process.env.API_ENDPOINT}/`, {
      method: "GET",
    }).then((res) => res.json());
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ ...SERVER_ERROR, data: err });
  }
}
