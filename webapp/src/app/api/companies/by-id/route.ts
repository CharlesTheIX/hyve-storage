import { NextRequest, NextResponse } from "next/server";
import { header_external, SERVER_ERROR } from "@/globals";

export async function DELETE(request: NextRequest) {
  try {
    const { _id } = await request.json();
    const response = await fetch(`${process.env.API_ENDPOINT}/v1/companies/by-id`, {
      method: "DELETE",
      headers: header_external,
      body: JSON.stringify({ _id }),
    }).then((res) => res.json());
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ ...SERVER_ERROR, data: err });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { _id, filters, update } = await request.json();
    const response = await fetch(`${process.env.API_ENDPOINT}/v1/companies/by-id`, {
      method: "PATCH",
      headers: header_external,
      body: JSON.stringify({ _id, filters, update }),
    }).then((res) => res.json());
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ ...SERVER_ERROR, data: err });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { _id, filters } = await request.json();
    const response = await fetch(`${process.env.API_ENDPOINT}/v1/companies/by-id`, {
      method: "POST",
      headers: header_external,
      body: JSON.stringify({ _id, filters }),
    }).then((res) => res.json());
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ ...SERVER_ERROR, data: err });
  }
}
