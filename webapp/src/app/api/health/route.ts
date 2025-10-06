import { NextResponse } from "next/server";
import { response_SERVER_ERROR } from "@/globals";

export async function GET() {
  try {
    const response = await fetch(`${process.env.API_ENDPOINT}/`, {
      method: "GET",
    }).then((res) => res.json());
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ ...response_SERVER_ERROR, data: err });
  }
}
