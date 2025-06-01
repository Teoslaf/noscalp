import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import nftsData from '../../data/nfts_data.json'
import { formatPrice } from '../../styles/design-tokens'

export default function NFTDetailPage() {
  const router = useRouter()
  const { nftId } = router.query
  const [nft, setNft] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  useEffect(() => {
    if (nftId) {
      const foundNFT = nftsData.find(n => n.id === decodeURIComponent(nftId))
      setNft(foundNFT)
    }
  }, [nftId])

  if (!nft) {
    return (
      <div className="screen-container min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Get rarity color configuration
  const getRarityConfig = (rarity) => {
    const rarityColors = {
      'Common': { color: '#9CA3AF', bgColor: 'rgba(156, 163, 175, 0.1)' },
      'Rare': { color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)' },
      'Epic': { color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.1)' },
      'Legendary': { color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' }
    }
    return rarityColors[rarity] || rarityColors['Common']
  }

  const rarityConfig = getRarityConfig(nft.rarity)
  const createdDate = new Date(nft.created_date)
  
  const handleBuyNFT = () => {
    if (nft.status === 'for_sale') {
      alert(`Purchasing ${nft.name} for ${nft.price.amount} ${nft.price.currency}`)
    }
  }

  const handleContactCreator = () => {
    alert(`Contacting ${nft.creator.name}`)
  }

  const handleViewOnBlockchain = () => {
    alert(`Viewing on ${nft.blockchain} blockchain: ${nft.contract_address}`)
  }

  return (
    <>
      <Head>
        <title>{nft.name} - NFT Collection</title>
        <meta name="description" content={nft.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      
      <div className="screen-container min-h-screen">
        {/* Top Bar */}
        <div className="nav-top fixed top-0 left-0 right-0 z-fixed bg-bg-primary bg-opacity-95 backdrop-blur-sm">
          <div className="flex items-center justify-between h-full px-3">
            {/* Back Button */}
            <button 
              className="p-sm hover:bg-interactive-hover rounded-md transition-colors duration-fast"
              onClick={() => router.back()}
            >
              <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* NFT Title */}
            <h1 className="text-body font-medium text-text-primary text-center flex-1 mx-lg line-clamp-1">
              {nft.name}
            </h1>

            {/* Like Button */}
            <button 
              className="p-sm hover:bg-interactive-hover rounded-md transition-colors duration-fast"
              onClick={() => setIsLiked(!isLiked)}
            >
              <svg 
                className={`w-6 h-6 ${isLiked ? 'text-status-error fill-current' : 'text-text-secondary'}`} 
                fill={isLiked ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* NFT Content */}
        <div className="pt-top-bar-height px-3">
          {/* NFT Image */}
          <div className="relative w-full aspect-square">
            <Image
              src={nft.banner || nft.image}
              alt={nft.name}
              fill
              className="object-cover"
              sizes="100vw"
            />
            
            {/* Rarity Badge */}
            <div 
              className="absolute top-lg right-lg px-lg py-sm rounded-button text-body font-medium"
              style={{
                backgroundColor: rarityConfig.bgColor,
                color: rarityConfig.color,
              }}
            >
              {nft.rarity}
            </div>

            {/* Status Badge */}
            {nft.status === 'for_sale' && (
              <div className="absolute top-lg left-lg px-lg py-sm bg-primary-green text-text-on-primary rounded-button text-body font-medium">
                For Sale
              </div>
            )}
          </div>

          {/* NFT Details */}
          <div className="space-y-lg p-lg">
            {/* Category Badge */}
            <div className="inline-block px-lg py-sm bg-bg-tertiary text-text-muted rounded-button text-body font-medium w-fit">
              {nft.category}
            </div>

            {/* NFT Title and Basic Info */}
            <div className="space-y-lg">
              <h1 className="text-app-title font-bold text-text-primary">
                {nft.name}
              </h1>
              
              {/* Collection */}
              <p className="text-body text-primary-green font-medium">
                {nft.collection}
              </p>
              
              {/* Description */}
              <div>
                <p className={`text-caption text-text-secondary ${showFullDescription ? '' : 'line-clamp-3'}`}>
                  {nft.description}
                </p>
                {nft.description.length > 150 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-primary-green text-caption mt-xs hover:text-primary-green-hover"
                  >
                    {showFullDescription ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            </div>

            {/* NFT Info */}
            <div className="space-y-lg">
              {/* Creator */}
              <div className="flex items-start gap-lg">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={nft.creator.avatar} 
                    alt={nft.creator.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-body font-medium text-text-primary mb-xs flex items-center gap-sm">
                    Creator
                    {nft.creator.verified && (
                      <svg className="w-5 h-5 text-primary-green" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </h3>
                  <button
                    onClick={handleContactCreator}
                    className="text-caption text-primary-green hover:text-primary-green-hover"
                  >
                    {nft.creator.name}
                  </button>
                  <p className="text-small text-text-muted">
                    {nft.creator.address}
                  </p>
                </div>
              </div>

              {/* Current Owner */}
              <div className="flex items-start gap-lg">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={nft.current_owner.avatar} 
                    alt={nft.current_owner.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-body font-medium text-text-primary mb-xs">Current Owner</h3>
                  <p className="text-caption text-text-secondary">
                    {nft.current_owner.name}
                  </p>
                  <p className="text-small text-text-muted">
                    {nft.current_owner.address}
                  </p>
                </div>
              </div>

              {/* Blockchain Info */}
              <div className="flex items-start gap-lg">
                <svg className="w-6 h-6 text-secondary-lime mt-xs flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <div>
                  <h3 className="text-body font-medium text-text-primary mb-xs">Blockchain Details</h3>
                  <p className="text-caption text-text-secondary mb-xs">
                    Network: {nft.blockchain}
                  </p>
                  <p className="text-caption text-text-secondary mb-xs">
                    Token ID: {nft.token_id}
                  </p>
                  <button
                    onClick={handleViewOnBlockchain}
                    className="text-primary-green text-caption hover:text-primary-green-hover"
                  >
                    View on blockchain →
                  </button>
                </div>
              </div>
            </div>

            {/* Attributes */}
            {nft.attributes && nft.attributes.length > 0 && (
              <div className="space-y-lg">
                <h2 className="text-section-header font-medium text-text-primary">
                  Attributes
                </h2>
                <div className="grid grid-cols-2 gap-md">
                  {nft.attributes.map((attribute, index) => (
                    <div key={index} className="card-primary">
                      <div className="text-center">
                        <p className="text-caption text-text-muted mb-xs uppercase tracking-wide">
                          {attribute.trait_type}
                        </p>
                        <p className="text-body font-medium text-text-primary">
                          {attribute.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Utility */}
            {nft.utility && nft.utility.length > 0 && (
              <div className="space-y-lg">
                <h2 className="text-section-header font-medium text-text-primary">
                  Utility & Benefits
                </h2>
                <div className="space-y-sm">
                  {nft.utility.map((utility, index) => (
                    <div key={index} className="flex items-center gap-sm text-caption text-text-secondary">
                      <svg className="w-4 h-4 text-primary-green flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{utility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price and Action */}
            <div className="space-y-lg">
              {nft.price.amount > 0 && (
                <div className="card-primary">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-caption text-text-muted mb-xs">Current Price</p>
                      <p className="text-section-header font-bold text-primary-green">
                        {nft.price.amount} {nft.price.currency}
                      </p>
                      <p className="text-caption text-text-muted">
                        ≈ ${nft.price.usd_value.toLocaleString()}
                      </p>
                    </div>
                    {nft.status === 'for_sale' && (
                      <div className="text-right">
                        <p className="text-caption text-text-muted">Status</p>
                        <p className="text-body text-primary-green font-medium">Available</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="sticky bottom-lg">
                {nft.status === 'for_sale' ? (
                  <button
                    onClick={handleBuyNFT}
                    className="btn-primary w-full"
                  >
                    Buy Now - {nft.price.amount} {nft.price.currency}
                  </button>
                ) : (
                  <button
                    disabled
                    className="btn-primary w-full opacity-50 cursor-not-allowed"
                  >
                    Not for Sale
                  </button>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-lg pb-xl">
              <div className="card-primary space-y-sm">
                <p className="text-caption text-text-muted">
                  Created: {createdDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-caption text-text-muted">
                  Contract: {nft.contract_address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 