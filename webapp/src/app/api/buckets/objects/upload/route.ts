import { NextRequest, NextResponse } from "next/server";
import { header_external, response_SERVER_ERROR } from "@/globals";

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.json();
    const response = await fetch(`${process.env.API_ENDPOINT}/v1/buckets/objects/upload`, {
      method: "PUT",
      body: JSON.stringify(formData),
      headers: { ...header_external, "Content-Type": "multipart/form-data" },
    }).then((res) => res.json());
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ ...response_SERVER_ERROR, data: err });
  }
}
