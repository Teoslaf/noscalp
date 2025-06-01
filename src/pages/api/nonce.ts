import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Generate nonce - expects only alphanumeric characters (at least 8 characters)
  const nonce = crypto.randomUUID().replace(/-/g, "");

  // Store the nonce in a secure cookie (not tamperable by client)
  // Using secure flag and httpOnly for production security
  res.setHeader('Set-Cookie', [
    `siwe=${nonce}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 10}${
      process.env.NODE_ENV === 'production' ? '; Secure' : ''
    }`
  ]);

  return res.status(200).json({ nonce });
} 