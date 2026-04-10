import { useState, useEffect } from 'react'
import './App.css'
import type { PageProps } from './types'

interface Report {
  date: string
  totalTx: number
  newHolders: number
  topReceivers: [string, number][]
  topSenders: [string, number][]
  funcCounts: Record<string, number>
  error?: boolean
}

function ReportsPage({ onNavigate }: PageProps) {
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const apiKey = 'YourApiKeyToken'
        const response = await fetch(
          `https://api.etherscan.io/v2/api?chainid=1&module=account&action=tokentx&contractaddress=0x4dFae3690b93c47470b03036A17B23C1Be05127C&startblock=0&endblock=99999999&sort=desc&limit=100&apikey=${apiKey}`
        )
        const data = await response.json()
        const txs: Array<{ timeStamp: string; functionName?: string; value: string; from: string; to: string }> = data.result ?? []

        // Start of today (UTC midnight)
        const now = new Date()
        const todayStart = Math.floor(new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()).getTime() / 1000)

        const todayTxs = txs.filter(t => parseInt(t.timeStamp) >= todayStart)

        const funcCounts: Record<string, number> = {}
        const senders: Record<string, number> = {}
        const receivers: Record<string, number> = {}

        todayTxs.forEach(t => {
          const func = t.functionName ?? 'Unknown'
          funcCounts[func] = (funcCounts[func] ?? 0) + 1

          const val = parseInt(t.value) / 1e18
          const from = t.from.toLowerCase()
          const to = t.to.toLowerCase()

          senders[from] = (senders[from] ?? 0) + val
          receivers[to] = (receivers[to] ?? 0) + val
        })

        const senderAddrs = new Set(Object.keys(senders))
        const receiverAddrs = new Set(Object.keys(receivers))
        const newHolders = [...receiverAddrs].filter(a => !senderAddrs.has(a))

        const topReceivers: [string, number][] = Object.entries(receivers)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .filter(([, v]) => v > 1000000)

        const topSenders: [string, number][] = Object.entries(senders)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .filter(([, v]) => v > 1000000)

        const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        setReport({
          date: dateStr,
          totalTx: todayTxs.length,
          newHolders: newHolders.length,
          topReceivers,
          topSenders,
          funcCounts
        })
      } catch (e) {
        console.log('Error fetching report', e)
        setReport({ date: '', totalTx: 0, newHolders: 0, topReceivers: [], topSenders: [], funcCounts: {}, error: true })
      }
      setLoading(false)
    }

    void fetchReport()
  }, [])

  if (loading) return <div className="loading">Loading daily report...</div>

  if (report?.error) return <div className="error">Unable to fetch report</div>

  if (!report) return null

  return (
    <div className="reports-page">
      <div className="reports-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>← Back</button>
        <h1>Daily On-Chain Report</h1>
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

        <h3>Top Receivers (Accumulating)</h3>
        <div className="address-list">
          {report.topReceivers.length > 0 ? (
            report.topReceivers.map(([addr, val], i) => (
              <div key={i} className="address-item">
                <span className="addr">{addr.slice(0, 8)}...{addr.slice(-6)}</span>
                <span className="val">{(val / 1e6).toFixed(1)}M PEPE</span>
              </div>
            ))
          ) : (
            <p className="empty">No large receivers today</p>
          )}
        </div>

        <h3>Top Senders (Distributing)</h3>
        <div className="address-list">
          {report.topSenders.length > 0 ? (
            report.topSenders.map(([addr, val], i) => (
              <div key={i} className="address-item">
                <span className="addr">{addr.slice(0, 8)}...{addr.slice(-6)}</span>
                <span className="val">{(val / 1e6).toFixed(1)}M PEPE</span>
              </div>
            ))
          ) : (
            <p className="empty">No large senders today</p>
          )}
        </div>

        <div className="report-footer">
          <p>Data updated daily from Etherscan</p>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage
