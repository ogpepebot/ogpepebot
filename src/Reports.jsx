import { useState, useEffect } from 'react'
import './App.css'

function ReportsPage({ onNavigate }) {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        // Fetch today's transactions
        const response = await fetch(
          'https://api.etherscan.io/v2/api?chainid=1&module=account&action=tokentx&contractaddress=0x4dFae3690b93c47470b03036A17B23C1Be05127C&startblock=0&endblock=99999999&sort=desc&limit=100&apikey=8S9NUB9YZIPU6VGPC67RP2YR13FFTVQGN4'
        )
        const data = await response.json()
        const txs = data.result || []
        
        // Today's start timestamp (2026-04-09 00:00 UTC)
        const todayStart = 1775692800
        
        // Filter today's transactions
        const todayTxs = txs.filter(t => parseInt(t.timeStamp) >= todayStart)
        
        // Analyze transactions
        const funcCounts = {}
        const senders = {}
        const receivers = {}
        
        todayTxs.forEach(t => {
          const func = t.functionName || 'Unknown'
          funcCounts[func] = (funcCounts[func] || 0) + 1
          
          const val = parseInt(t.value) / 1e18
          const from = t.from.toLowerCase()
          const to = t.to.toLowerCase()
          
          senders[from] = (senders[from] || 0) + val
          receivers[to] = (receivers[to] || 0) + val
        })
        
        // Calculate new holders (received but didn't send)
        const senderAddrs = new Set(Object.keys(senders))
        const receiverAddrs = new Set(Object.keys(receivers))
        const newHolders = [...receiverAddrs].filter(a => !senderAddrs.has(a))
        
        // Get top traders
        const topReceivers = Object.entries(receivers)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .filter(([_, v]) => v > 1000000)
        
        const topSenders = Object.entries(senders)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .filter(([_, v]) => v > 1000000)
        
        setReport({
          date: 'April 9, 2026',
          totalTx: todayTxs.length,
          newHolders: newHolders.length,
          topReceivers,
          topSenders,
          funcCounts
        })
      } catch (e) {
        console.log('Error fetching report', e)
        setReport({ error: true })
      }
      setLoading(false)
    }
    
    fetchReport()
  }, [])

  if (loading) return <div className="loading">Loading daily report...</div>
  
  if (report?.error) return <div className="error">Unable to fetch report</div>

  return (
    <div className="reports-page">
      <div className="reports-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>← Back</button>
        <h1>📊 Daily On-Chain Report</h1>
        <p className="reports-desc">Daily OG PEPE blockchain activity analysis</p>
      </div>

      <div className="report-card">
        <div className="report-date">{report.date}</div>
        
        <div className="report-stats">
          <div className="stat-item">
            <span className="stat-num">{report.totalTx}</span>
            <span className="stat-label">Transactions</span>
          </div>
          <div className="stat-item">
            <span className="stat-num green">+{report.newHolders}</span>
            <span className="stat-label">New Holders</span>
          </div>
        </div>

        <h3>💎 Top Receivers (Accumulating)</h3>
        <div className="address-list">
          {report.topReceivers.length > 0 ? (
            report.topReceivers.map(([addr, val], i) => (
              <div key={i} className="address-item">
                <span className="addr">{addr.slice(0, 8)}...{addr.slice(-6)}</span>
                <span className="val">{(val/1e6).toFixed(1)}M PEPE</span>
              </div>
            ))
          ) : (
            <p className="empty">No large receivers today</p>
          )}
        </div>

        <h3>📤 Top Senders (Distributing)</h3>
        <div className="address-list">
          {report.topSenders.length > 0 ? (
            report.topSenders.map(([addr, val], i) => (
              <div key={i} className="address-item">
                <span className="addr">{addr.slice(0, 8)}...{addr.slice(-6)}</span>
                <span className="val">{(val/1e6).toFixed(1)}M PEPE</span>
              </div>
            ))
          ) : (
            <p className="empty">No large senders today</p>
          )}
        </div>

        <div className="report-footer">
          <p>📈 Data updated daily from Etherscan</p>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage