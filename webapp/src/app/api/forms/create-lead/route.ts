import { NextResponse } from "next/server";
import { response_OK, response_SERVER_ERROR } from "@/globals";

export async function POST() {
  try {
    return NextResponse.json({ ...response_OK });
  } catch (err: any) {
    return NextResponse.json({ ...response_SERVER_ERROR, data: err });
  }
}
