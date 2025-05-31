import '../styles/globals.css'
import ClientProviders from '@/providers'

export default function App({ Component, pageProps }) {
  return (
    <ClientProviders>
      <Component {...pageProps} />
    </ClientProviders>
  )
} 