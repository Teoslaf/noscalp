import Head from 'next/head'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import NFTCard from '../components/NFTCard'
import BottomNav from '../components/BottomNav'
import nftsData from '../data/nfts_data.json'

export default function NFTsPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedRarity, setSelectedRarity] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Get unique categories from NFTs data
  const categories = useMemo(() => {
    const cats = [...new Set(nftsData.map(nft => nft.category))]
    return ['All', ...cats]
  }, [])

  // Get unique rarities from NFTs data
  const rarities = useMemo(() => {
    const rars = [...new Set(nftsData.map(nft => nft.rarity))]
    return ['All', ...rars]
  }, [])

  // Status options
  const statuses = ['All', 'Owned', 'For Sale']

  // Filter NFTs based on selected criteria
  const filteredNFTs = useMemo(() => {
    return nftsData.filter(nft => {
      const matchesCategory = selectedCategory === 'All' || nft.category === selectedCategory
      const matchesRarity = selectedRarity === 'All' || nft.rarity === selectedRarity
      
      let matchesStatus = true
      if (selectedStatus === 'Owned') {
        matchesStatus = nft.status === 'owned'
      } else if (selectedStatus === 'For Sale') {
        matchesStatus = nft.status === 'for_sale'
      }
      
      const matchesSearch = searchQuery === '' || 
        nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.collection.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.creator.name.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCategory && matchesRarity && matchesStatus && matchesSearch
    })
  }, [selectedCategory, selectedRarity, selectedStatus, searchQuery])

  const handleNFTClick = (nft) => {
    router.push(`/nft/${encodeURIComponent(nft.id)}`)
  }

  return (
    <>
      <Head>
        <title>NFT Collection - Noscalp</title>
        <meta name="description" content="Browse and discover unique NFTs" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      
      <div className="screen-container min-h-screen">
        {/* Top Bar */}
        <div className="nav-top fixed top-0 left-0 right-0 z-fixed">
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

            {/* Page Title */}
            <h1 className="text-app-title font-bold text-text-primary">
              NFT Collection
            </h1>

            {/* Search Button */}
            <button 
              className="p-sm hover:bg-interactive-hover rounded-md transition-colors duration-fast"
              onClick={() => {
                // Toggle search input or navigate to search page
                document.getElementById('nft-search').focus()
              }}
            >
              <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="fixed top-top-bar-height left-0 right-0 z-40 bg-bg-primary border-b border-border-primary">
          <div className="px-3 py-md">
            <input
              id="nft-search"
              type="text"
              placeholder="Search NFTs, collections, or creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-lg py-sm bg-bg-secondary border border-border-primary rounded-input text-text-primary placeholder-text-muted focus:outline-none focus:border-primary-green"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="fixed left-0 right-0 z-30 bg-bg-secondary border-b border-border-primary" style={{ top: 'calc(69px + 60px)' }}>
          <div className="flex items-center gap-sm p-sm px-3 overflow-x-auto">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-md py-xs bg-bg-tertiary border border-border-primary rounded-button text-caption text-text-primary focus:outline-none focus:border-primary-green whitespace-nowrap"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Rarity Filter */}
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="px-md py-xs bg-bg-tertiary border border-border-primary rounded-button text-caption text-text-primary focus:outline-none focus:border-primary-green whitespace-nowrap"
            >
              {rarities.map(rarity => (
                <option key={rarity} value={rarity}>{rarity}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-md py-xs bg-bg-tertiary border border-border-primary rounded-button text-caption text-text-primary focus:outline-none focus:border-primary-green whitespace-nowrap"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            {/* Clear Filters */}
            {(selectedCategory !== 'All' || selectedRarity !== 'All' || selectedStatus !== 'All') && (
              <button
                onClick={() => {
                  setSelectedCategory('All')
                  setSelectedRarity('All')
                  setSelectedStatus('All')
                }}
                className="btn-small h-8 px-md py-0 text-small whitespace-nowrap"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ paddingTop: 'calc(69px + 60px + 53px)', paddingBottom: '69px' }} className="px-3">
          {/* Section Header */}
          <div className="section-gap">
            <div className="flex items-center justify-between">
              <h2 className="text-section-header font-medium text-text-primary">
                {selectedCategory === 'All' ? 'All NFTs' : `${selectedCategory} NFTs`}
              </h2>
              <span className="text-caption text-text-muted">
                {filteredNFTs.length} item{filteredNFTs.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* NFTs Grid */}
          {filteredNFTs.length > 0 ? (
            <div className="grid grid-cols-1 gap-section-gap pb-xl">
              {filteredNFTs.map((nft, index) => (
                <NFTCard
                  key={`${nft.id}-${index}`}
                  nft={nft}
                  onClick={handleNFTClick}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-xxxl text-center">
              <svg className="w-16 h-16 text-text-muted mb-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-body font-medium text-text-secondary mb-sm">
                No NFTs found
              </h3>
              <p className="text-caption text-text-muted max-w-xs">
                Try adjusting your filters or search terms to find more NFTs.
              </p>
            </div>
          )}

          {/* Collection Stats */}
          {filteredNFTs.length > 0 && (
            <div className="pb-xl">
              <div className="card-primary space-y-lg">
                <h3 className="text-body font-medium text-text-primary">Collection Overview</h3>
                <div className="grid grid-cols-3 gap-lg text-center">
                  <div>
                    <p className="text-section-header font-bold text-primary-green">
                      {nftsData.length}
                    </p>
                    <p className="text-caption text-text-secondary">Total NFTs</p>
                  </div>
                  <div>
                    <p className="text-section-header font-bold text-primary-green">
                      {nftsData.filter(nft => nft.status === 'for_sale').length}
                    </p>
                    <p className="text-caption text-text-secondary">For Sale</p>
                  </div>
                  <div>
                    <p className="text-section-header font-bold text-primary-green">
                      {[...new Set(nftsData.map(nft => nft.collection))].length}
                    </p>
                    <p className="text-caption text-text-secondary">Collections</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab="nfts" />
      </div>
    </>
  )
} 