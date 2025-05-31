import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Generate nonce - expects only alphanumeric characters (at least 8 characters)
  const nonce = crypto.randomUUID().replace(/-/g, "");

  // Store the nonce in a secure cookie (not tamperable by client)
  // Using secure flag and httpOnly for production security
  cookies().set("siwe", nonce, { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 10 // 10 minutes expiry
  });

  return NextResponse.json({ nonce });
} 