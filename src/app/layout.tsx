import type { Metadata } from "next";
import "./globals.css";
import MiniKitClientWrapper from "@/app/minikit-wrapper";

export const metadata: Metadata = {
  title: "Noscalp",
  description: "Buy tickets with World ID verification",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MiniKitClientWrapper>
          {children}
        </MiniKitClientWrapper>
      </body>
    </html>
  );
}
