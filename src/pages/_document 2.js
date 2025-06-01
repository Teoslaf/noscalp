import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Mobile optimization */}
        <meta name="theme-color" content="#0B0F0E" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* PWA support */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Fonts preload for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-bg-primary text-text-primary">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 