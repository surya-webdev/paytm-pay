import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export function POST(req: NextApiRequest) {
  const res = req.json();
  console.log(res);
  return NextResponse.json("message");
}
