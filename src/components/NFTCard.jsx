import React from 'react';
import Image from 'next/image';
import { designTokens, formatPrice } from '../styles/design-tokens';

/**
 * NFTCard Component
 * 
 * Displays NFT information in a card format using the design system.
 * Based on nfts_data.json data structure.
 * 
 * Props:
 * - nft: NFT object from nfts_data.json
 * - onClick: Callback function when card is clicked
 */
const NFTCard = ({ nft, onClick }) => {
  // Get rarity color configuration
  const getRarityConfig = (rarity) => {
    const rarityColors = {
      'Common': { color: '#9CA3AF', bgColor: 'rgba(156, 163, 175, 0.1)' },
      'Rare': { color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)' },
      'Epic': { color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.1)' },
      'Legendary': { color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' }
    };
    return rarityColors[rarity] || rarityColors['Common'];
  };

  const rarityConfig = getRarityConfig(nft.rarity);

  // Format creation date
  const createdDate = new Date(nft.created_date);
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Format price display
  const priceDisplay = nft.price.amount > 0 
    ? `${nft.price.amount} ${nft.price.currency}`
    : 'Not for sale';

  return (
    <div 
      className="card-primary cursor-pointer transition-all duration-normal ease-out hover:transform hover:translate-y-[-2px] hover:shadow-lg"
      onClick={() => onClick?.(nft)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.(nft);
        }
      }}
    >
      {/* NFT Image */}
      <div className="relative w-full aspect-square rounded-md overflow-hidden mb-lg">
        <Image
          src={nft.image}
          alt={nft.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Rarity Badge */}
        <div 
          className="absolute top-md right-md px-md py-xs rounded-button text-small font-medium"
          style={{
            backgroundColor: rarityConfig.bgColor,
            color: rarityConfig.color,
          }}
        >
          {nft.rarity}
        </div>

        {/* Status Badge */}
        {nft.status === 'for_sale' && (
          <div className="absolute top-md left-md px-md py-xs bg-primary-green text-text-on-primary rounded-button text-small font-medium">
            For Sale
          </div>
        )}
      </div>

      {/* NFT Content */}
      <div className="space-y-md">
        {/* Category Badge */}
        <div className="inline-block px-md py-xs bg-bg-tertiary text-text-muted rounded-button text-small font-medium w-fit">
          {nft.category}
        </div>

        {/* NFT Title */}
        <h3 className="text-body font-medium text-text-primary line-clamp-2">
          {nft.name}
        </h3>

        {/* Collection */}
        <p className="text-caption text-text-muted line-clamp-1">
          {nft.collection}
        </p>

        {/* NFT Details */}
        <div className="space-y-xs">
          {/* Creator */}
          <div className="flex items-center gap-sm text-caption text-text-secondary">
            <span>👨‍🎨</span>
            <span className="line-clamp-1">{nft.creator.name}</span>
            {nft.creator.verified && (
              <svg className="w-4 h-4 text-primary-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>

          {/* Blockchain & Date */}
          <div className="flex items-center gap-sm text-caption text-text-secondary">
            <span>⛓️</span>
            <span>{nft.blockchain}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>

          {/* Price and Owner */}
          <div className="flex items-center justify-between pt-xs">
            <span className="text-body font-medium text-primary-green">
              {priceDisplay}
            </span>
            <span className="text-caption text-text-muted line-clamp-1">
              @{nft.current_owner.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCard; 