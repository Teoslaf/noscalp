import { hashNonce } from '@/auth/wallet/client-helpers';
import {
  MiniAppWalletAuthSuccessPayload,
  MiniKit,
  verifySiweMessage,
} from '@worldcoin/minikit-js';
import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { OAuthConfig } from 'next-auth/providers';

declare module 'next-auth' {
  interface User {
    walletAddress: string;
    username: string;
    profilePictureUrl: string;
  }

  interface Session {
    user: {
      walletAddress: string;
      username: string;
      profilePictureUrl: string;
    } & DefaultSession['user'];
  }
}

// Auth configuration for Wallet Auth based sessions
// For more information on each option (and a full list of options) go to
// https://authjs.dev/getting-started/authentication/credentials
export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  trustHost: true,
  providers: [
    {
      id: "worldid",
      name: "World ID",
      type: "oauth",
      clientId: process.env.WORLDID_CLIENT_ID,
      clientSecret: process.env.WORLDID_CLIENT_SECRET,
      issuer: "https://id.worldcoin.org",
      authorization: {
        url: "https://id.worldcoin.org/authorize",
        params: { 
          scope: "openid",
          response_type: "code"
        }
      },
      token: "https://id.worldcoin.org/token",
      userinfo: "https://id.worldcoin.org/userinfo",
      client: {
        token_endpoint_auth_method: "client_secret_post"
      },
      wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration"
    } as OAuthConfig<any>,
    Credentials({
      name: 'World App Wallet',
      credentials: {
        nonce: { label: 'Nonce', type: 'text' },
        signedNonce: { label: 'Signed Nonce', type: 'text' },
        finalPayloadJson: { label: 'Final Payload', type: 'text' },
      },
      // @ts-expect-error TODO
      authorize: async ({
        nonce,
        signedNonce,
        finalPayloadJson,
      }: {
        nonce: string;
        signedNonce: string;
        finalPayloadJson: string;
      }) => {
        const expectedSignedNonce = hashNonce({ nonce });

        if (signedNonce !== expectedSignedNonce) {
          console.log('Invalid signed nonce');
          return null;
        }

        const finalPayload: MiniAppWalletAuthSuccessPayload =
          JSON.parse(finalPayloadJson);
        const result = await verifySiweMessage(finalPayload, nonce);

        if (!result.isValid || !result.siweMessageData.address) {
          console.log('Invalid final payload');
          return null;
        }
        // Optionally, fetch the user info from your own database
        const userInfo = await MiniKit.getUserInfo(finalPayload.address);

        return {
          id: finalPayload.address,
          ...userInfo,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.walletAddress = user.walletAddress;
        token.username = user.username;
        token.profilePictureUrl = user.profilePictureUrl;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.walletAddress = token.walletAddress as string;
        session.user.username = token.username as string;
        session.user.profilePictureUrl = token.profilePictureUrl as string;
      }
      return session;
    },
  },
}); 