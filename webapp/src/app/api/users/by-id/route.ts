import { NextRequest, NextResponse } from "next/server";
import { header_external, response_SERVER_ERROR } from "@/globals";

export async function DELETE(request: NextRequest) {
  try {
    const { _id } = await request.json();
    const response = await fetch(`${process.env.API_ENDPOINT}/v1/users/by-id`, {
      method: "DELETE",
      headers: header_external,
      body: JSON.stringify({ _id }),
    }).then((res) => res.json());
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ ...response_SERVER_ERROR, data: err });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { _id, options, update } = await request.json();
    const response = await fetch(`${process.env.API_ENDPOINT}/v1/users/by-id`, {
      method: "PATCH",
      headers: header_external,
      body: JSON.stringify({ _id, options, update }),
    }).then((res) => res.json());
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ ...response_SERVER_ERROR, data: err });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { _id, options } = await request.json();
    const response = await fetch(`${process.env.API_ENDPOINT}/v1/users/by-id`, {
      method: "POST",
      headers: header_external,
      body: JSON.stringify({ _id, options }),
    }).then((res) => res.json());
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ ...response_SERVER_ERROR, data: err });
  }
}
