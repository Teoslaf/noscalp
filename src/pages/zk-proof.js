import Head from 'next/head';
import { ZKProofGenerator } from '../components/ZKProofGenerator';

export default function ZKProofPage() {
  return (
    <>
      <Head>
        <title>ZK Proof Generator - Noscalp</title>
        <meta name="description" content="Generate zero-knowledge proofs for World Chain smart contracts" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      
      <div className="screen-container min-h-screen bg-bg-primary">
        {/* Navigation */}
        <div className="nav-top">
          <a href="/" className="text-primary-green hover:text-primary-green-hover">
            ← Back to Home
          </a>
          <h1 className="text-app-title font-bold text-text-primary">ZK Proof</h1>
          <div></div>
        </div>

        {/* Main Content */}
        <main className="pt-top-bar-height pb-bottom-nav-height px-lg">
          <div className="max-w-2xl mx-auto">
            <ZKProofGenerator />
          </div>
        </main>

        {/* Footer Info */}
        <div className="fixed bottom-0 left-0 right-0 bg-surface-secondary border-t border-border-muted p-md">
          <div className="text-center">
            <p className="text-small text-text-muted">
              World Chain Integration • Zero-Knowledge Proofs • Privacy-Preserving
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 