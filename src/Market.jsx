import { useState, useEffect } from 'react'
import './App.css'

function MarketPage({ onNavigate }) {
  const [priceData, setPriceData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current price
        const priceRes = await fetch('https://api.geckoterminal.com/api/v2/simple/networks/eth/token_price/0x4dFae3690b93c47470b03036A17B23C1Be05127C')
        const priceJson = await priceRes.json()
        const currentPrice = parseFloat(priceJson?.data?.attributes?.token_prices?.['0x4dfae3690b93c47470b03036a17b23c1be05127c'])
        
        // Get 24h history
        const historyRes = await fetch('https://api.coingecko.com/api/v3/coins/ethereum/contract/0x4dFae3690b93c47470b03036A17B23C1Be05127C/market_chart?vs_currency=usd&days=1')
        const historyJson = await historyRes.json()
        
        if (historyJson?.prices?.length > 0) {
          const prices = historyJson.prices
          const price24hAgo = prices[0][1]
          const priceChange = currentPrice - price24hAgo
          const priceChangePercent = (priceChange / price24hAgo) * 100
          
          setPriceData({
            current: currentPrice,
            change24h: priceChange,
            changePercent: priceChangePercent,
            high24h: Math.max(...prices.map(p => p[1])),
            low24h: Math.min(...prices.map(p => p[1]))
          })
        }
      } catch (e) {
        console.log('Error fetching data', e)
      }
      setLoading(false)
    }
    
    fetchData()
  }, [])

  return (
    <div className="market-page">
      <div className="market-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>← Back</button>
        <h1>📊 Daily ETH Activity</h1>
        <p className="market-desc">OG PEPE trading summary</p>
      </div>

      {loading ? (
        <div className="loading">Loading market data...</div>
      ) : priceData ? (
        <div className="market-stats">
          <div className="stat-card large">
            <span className="label">Current Price</span>
            <span className="value">${priceData.current?.toFixed(4)}</span>
            <span className={`change ${priceData.changePercent >= 0 ? 'positive' : 'negative'}`}>
              {priceData.changePercent >= 0 ? '📈' : '📉'} {priceData.changePercent >= 0 ? '+' : ''}{priceData.changePercent?.toFixed(2)}% (24h)
            </span>
          </div>

          <div className="stat-row">
            <div className="stat-card">
              <span className="label">24h High</span>
              <span className="value">${priceData.high24h?.toFixed(4)}</span>
            </div>
            <div className="stat-card">
              <span className="label">24h Low</span>
              <span className="value">${priceData.low24h?.toFixed(4)}</span>
            </div>
          </div>

          <div className="stat-row">
            <div className="stat-card">
              <span className="label">Change (USD)</span>
              <span className={`value ${priceData.change24h >= 0 ? 'positive' : 'negative'}`}>
                {priceData.change24h >= 0 ? '+' : ''}${priceData.change24h?.toFixed(4)}
              </span>
            </div>
            <div className="stat-card">
              <span className="label">Trend</span>
              <span className={`value ${priceData.changePercent >= 0 ? 'positive' : 'negative'}`}>
                {priceData.changePercent >= 0 ? '🟢 Bullish' : '🔴 Bearish'}
              </span>
            </div>
          </div>

          <div className="market-note">
            <p>📝 <strong>Summary:</strong> {priceData.changePercent >= 0 
              ? `OG PEPE is UP ${priceData.changePercent?.toFixed(2)}% today! Buyers are in control.`
              : `OG PEPE is DOWN ${Math.abs(priceData.changePercent)?.toFixed(2)}% today. Selling pressure present.`
            }</p>
            <p className="disclaimer">Data from CoinGecko • Prices in USD • Updates every refresh</p>
          </div>
        </div>
      ) : (
        <div className="error">Unable to fetch market data</div>
      )}
    </div>
  )
}

export default MarketPage