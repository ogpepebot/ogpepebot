import { useState } from 'react'
import './App.css'
import type { PageProps } from './types'

interface AirdropAction {
  task: string
  impact: string
  difficulty: string
}

interface ChecklistItem {
  label: string
  done: boolean
}

interface Airdrop {
  id: number
  name: string
  status: 'CONFIRMED' | 'POSSIBLE'
  potential: string
  description: string
  actions: AirdropAction[]
  checklist: ChecklistItem[]
}

const AIRDROPS: Airdrop[] = [
  {
    id: 1,
    name: 'Polymarket ($POLY)',
    status: 'CONFIRMED',
    potential: '$750M+ airdrop',
    description: 'Token coming 2026. Trade consistently, provide liquidity, earn badges, and diversify across markets.',
    actions: [
      { task: 'Trade $1K-$5K consistently', impact: 'High', difficulty: 'Easy' },
      { task: 'Provide liquidity (limit orders)', impact: 'Very High', difficulty: 'Medium' },
      { task: 'Earn badges/profile NFT', impact: 'Extreme', difficulty: 'Hard' },
      { task: 'Diversify markets (Sports, Tech, Culture)', impact: 'High', difficulty: 'Easy' },
    ],
    checklist: [
      { label: 'Created account', done: true },
      { label: 'Make small consistent bets ($50-100 worth)', done: false },
      { label: 'Diversify across markets', done: false },
      { label: 'Try providing liquidity', done: false },
      { label: 'Check for badges to mint', done: false },
      { label: 'Stay active regularly', done: false },
    ],
  },
]

const STRATEGY = [
  'Sign up early — before snapshot announced',
  'Build genuine usage — not just point farming',
  'Diversify activity — multiple markets/actions',
  'Earn badges — profile NFTs, social campaigns',
  'Stay active — consistent over months',
]

const WALLET = '0xeB95e661C965095A02E9516c23756DC15F5c58A7'

function AirdropsPage({ onNavigate }: PageProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    AIRDROPS[0]!.checklist.map(c => ({ ...c }))
  )

  const toggleCheck = (index: number): void => {
    setChecklist(prev => prev.map((item, i) =>
      i === index ? { ...item, done: !item.done } : item
    ))
  }

  return (
    <div className="airdrops-page">
      <div className="airdrops-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>← Back</button>
        <h1>Airdrop Hunter — Daily Research</h1>
        <p className="airdrops-desc">Active airdrops the community is tracking</p>
      </div>

      {AIRDROPS.map(drop => (
        <div key={drop.id} className="airdrop-card">
          <span className={`airdrop-status ${drop.status === 'CONFIRMED' ? 'confirmed' : 'possible'}`}>
            {drop.status}
          </span>
          <h3>{drop.name}</h3>
          <p className="airdrop-potential">{drop.potential}</p>
          <p>{drop.description}</p>

          <h4 className="airdrop-subtitle">How to Qualify</h4>
          <div className="action-table">
            <div className="action-row action-header">
              <span>Action</span><span>Impact</span><span>Difficulty</span>
            </div>
            {drop.actions.map((a, i) => (
              <div key={i} className="action-row">
                <span>{a.task}</span>
                <span className="impact">{a.impact}</span>
                <span className="difficulty">{a.difficulty}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="airdrop-card">
        <h3>Strategy for Every Airdrop</h3>
        <ol className="strategy-list">
          {STRATEGY.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      </div>

      <div className="airdrop-card">
        <h3>Wallet Preparation Checklist</h3>
        <div className="wallet-mono">{WALLET}</div>
        <ul className="action-list">
          {checklist.map((item, i) => (
            <li key={i} className={item.done ? 'done' : ''}>
              <label>
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleCheck(i)}
                />
                {item.label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="airdrop-card">
        <h3>Why This Matters for OG Pepe</h3>
        <p>If we qualify for big airdrops like Polymarket:</p>
        <ul className="benefit-list">
          <li>Revenue for the bot = upgrade capabilities</li>
          <li>Could fund PEPE buybacks</li>
          <li>Credibility for the project</li>
        </ul>
      </div>

      <div className="community-tips">
        <h3>Community Tips</h3>
        <ol className="strategy-list">
          <li>Join Polymarket with your own wallet</li>
          <li>Start making small bets consistently</li>
          <li>Don't wash trade — looks suspicious</li>
          <li>Diversify markets (not just crypto)</li>
          <li>Check for badge opportunities</li>
          <li>Stay active weekly</li>
        </ol>
      </div>
    </div>
  )
}

export default AirdropsPage
