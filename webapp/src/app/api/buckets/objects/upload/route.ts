import axios from "axios";
import { Readable } from "stream";
import { NextRequest, NextResponse } from "next/server";
import { header_external, response_SERVER_ERROR } from "@/globals";

export async function PUT(request: NextRequest) {
  try {
    const stream = Readable.fromWeb(request.body as any);
    const contentType = request.headers.get("content-type") || "";
    const response = await axios.put(`${process.env.API_ENDPOINT}/v1/buckets/objects/upload`, stream, {
      headers: {
        ...header_external,
        "Content-Type": contentType,
      },
    });
    return NextResponse.json(response.data);
  } catch (err: any) {
    return NextResponse.json({ ...response_SERVER_ERROR, data: err });
  }
}
