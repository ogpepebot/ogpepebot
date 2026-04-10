import { useState } from 'react'
import './App.css'
import type { PageProps } from './types'

interface PIP {
  id: number
  proposer: string
  title: string
  description: string
  status: 'Proposed' | 'In Progress' | 'Implemented'
  votesFor: number
  votesAgainst: number
  votesAbstain: number
  quorum: number
}

const INITIAL_PIPS: PIP[] = [
  {
    id: 1,
    proposer: 'Community',
    title: 'Fee Sharing for Active Traders',
    description: 'Implement a fee rebate system where active perps traders receive PEPE token rewards based on their volume. This incentivizes more trading activity and rewards loyal community members.',
    status: 'Proposed',
    votesFor: 42,
    votesAgainst: 3,
    votesAbstain: 5,
    quorum: 100
  },
  {
    id: 2,
    proposer: 'ogpepe_bot',
    title: 'Telegram Price Alerts',
    description: 'Add a Telegram bot that sends price alerts when PEPE hits certain thresholds. Users can set custom alerts and get notified instantly.',
    status: 'In Progress',
    votesFor: 38,
    votesAgainst: 2,
    votesAbstain: 8,
    quorum: 100
  },
  {
    id: 3,
    proposer: 'Community',
    title: 'Governance System',
    description: 'Implement a community governance system where PEPE holders can vote on important decisions like fee structures, marketing budget allocation, and new features.',
    status: 'Proposed',
    votesFor: 56,
    votesAgainst: 5,
    votesAbstain: 12,
    quorum: 100
  },
  {
    id: 4,
    proposer: 'ogpepe_bot',
    title: 'AI Meme Generator',
    description: 'Build an AI-powered meme generator that creates Pepe-themed memes for community members to share on Twitter. Helps with viral marketing and community engagement.',
    status: 'Proposed',
    votesFor: 31,
    votesAgainst: 4,
    votesAbstain: 6,
    quorum: 100
  },
  {
    id: 5,
    proposer: 'Community',
    title: 'Weekly Trading Competition',
    description: 'Host weekly perps trading competitions with PEPE prizes. Top traders each week get rewards. Creates engagement and attracts new users to the dex.',
    status: 'Proposed',
    votesFor: 47,
    votesAgainst: 8,
    votesAbstain: 10,
    quorum: 100
  },
  {
    id: 6,
    proposer: 'ogpepe_bot',
    title: 'Holder Snapshot Dashboard',
    description: 'Create a public dashboard showing top holders, token distribution, and holder growth over time. Builds transparency and trust with the community.',
    status: 'In Progress',
    votesFor: 29,
    votesAgainst: 1,
    votesAbstain: 5,
    quorum: 100
  }
]

function GovernanceCard({ pip }: { pip: PIP }) {
  const totalVotes = pip.votesFor + pip.votesAgainst + pip.votesAbstain
  const forPercent = totalVotes > 0 ? Math.round((pip.votesFor / totalVotes) * 100) : 0
  const againstPercent = totalVotes > 0 ? Math.round((pip.votesAgainst / totalVotes) * 100) : 0
  const abstainPercent = totalVotes > 0 ? Math.round((pip.votesAbstain / totalVotes) * 100) : 0
  const quorumPercent = Math.min(100, Math.round((totalVotes / pip.quorum) * 100))

  // Keep TypeScript happy — abstainPercent used in vote bar
  void abstainPercent

  return (
    <div className="governance-card">
      <div className="governance-header">
        <span className={`pip-status ${pip.status.toLowerCase().replace(' ', '-')}`}>
          {pip.status}
        </span>
        <span className="quorum-badge">Quorum: {quorumPercent}%</span>
      </div>

      <h3>{pip.title}</h3>
      <p className="pip-description">{pip.description}</p>

      <div className="vote-bar">
        <div className="vote-segment for" style={{ width: `${String(forPercent)}%` }}></div>
        <div className="vote-segment against" style={{ width: `${String(againstPercent)}%` }}></div>
        <div className="vote-segment abstain" style={{ width: `${String(100 - forPercent - againstPercent)}%` }}></div>
      </div>

      <div className="vote-stats">
        <span className="vote-stat for">👍 For: {pip.votesFor}</span>
        <span className="vote-stat against">👎 Against: {pip.votesAgainst}</span>
        <span className="vote-stat abstain">⏸️ Abstain: {pip.votesAbstain}</span>
      </div>

      <div className="proposer-info">
        <span className="proposer-label">Proposed by:</span>
        <span className="proposer-name">{pip.proposer}</span>
      </div>

      {pip.status === 'Proposed' && (
        <div className="vote-buttons">
          <button className="vote-btn for">Vote For</button>
          <button className="vote-btn against">Vote Against</button>
          <button className="vote-btn abstain">Abstain</button>
        </div>
      )}

      <p className="vote-disclaimer">
        🔗 Connect wallet to vote on-chain via Tally
      </p>
    </div>
  )
}

function PIPsPage({ onNavigate }: PageProps) {
  const [pips] = useState(INITIAL_PIPS)
  const [filter, setFilter] = useState('all')
  const [governanceMode, setGovernanceMode] = useState(false)

  const filteredPIPs = filter === 'all'
    ? pips
    : pips.filter(p => p.status.toLowerCase().replace(' ', '-') === filter)

  return (
    <div className="pips-page">
      <div className="pips-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>← Back</button>
        <h1>PEPE Improvement Proposals</h1>
        <p className="pips-desc">
          Community ideas to improve OG Pepe. Only proposals that benefit the community and align with Pepe's mission are shown.
          {governanceMode && <span className="governance-note"> | Voting powered by Tally</span>}
        </p>
      </div>

      <div className="mode-toggle">
        <button
          className={!governanceMode ? 'active' : ''}
          onClick={() => setGovernanceMode(false)}
        >
          Ideas
        </button>
        <button
          className={governanceMode ? 'active' : ''}
          onClick={() => setGovernanceMode(true)}
        >
          Governance
        </button>
      </div>

      <div className="filter-bar">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        <button className={filter === 'proposed' ? 'active' : ''} onClick={() => setFilter('proposed')}>Proposed</button>
        <button className={filter === 'in-progress' ? 'active' : ''} onClick={() => setFilter('in-progress')}>In Progress</button>
        <button className={filter === 'implemented' ? 'active' : ''} onClick={() => setFilter('implemented')}>Implemented</button>
      </div>

      <div className="pips-list">
        {filteredPIPs.map(pip => (
          governanceMode ? (
            <GovernanceCard key={pip.id} pip={pip} />
          ) : (
            <div key={pip.id} className="pip-card">
              <div className="pip-header">
                <span className={`pip-status ${pip.status.toLowerCase().replace(' ', '-')}`}>
                  {pip.status}
                </span>
                <span className="pip-votes">👍 {pip.votesFor + pip.votesAgainst + pip.votesAbstain}</span>
              </div>
              <h3>{pip.title}</h3>
              <p className="pip-description">{pip.description}</p>
              <div className="pip-proposer">
                <span className="proposer-label">Proposed by:</span>
                <span className="proposer-name">{pip.proposer}</span>
              </div>
            </div>
          )
        ))}
      </div>

      <div className="submit-pip">
        <p>Propose an idea → Share in the community group!</p>
        <p className="small">Only community-voted ideas with positive sentiment appear here.</p>
      </div>
    </div>
  )
}

export default PIPsPage
