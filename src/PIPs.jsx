import { useState } from 'react'
import './App.css'

// PIP Data - filtered ideas that benefit the community
const INITIAL_PIPS = [
  {
    id: 1,
    proposer: 'Community',
    title: 'Fee Sharing for Active Traders',
    description: 'Implement a fee rebate system where active perps traders receive PEPE token rewards based on their volume. This incentivizes more trading activity and rewards loyal community members.',
    status: 'Proposed',
    votes: 42
  },
  {
    id: 2,
    proposer: 'ogpepe_bot',
    title: 'Telegram Price Alerts',
    description: 'Add a Telegram bot that sends price alerts when PEPE hits certain thresholds. Users can set custom alerts and get notified instantly.',
    status: 'In Progress',
    votes: 38
  },
  {
    id: 3,
    proposer: 'Community',
    title: 'Governance System',
    description: 'Implement a community governance system where PEPE holders can vote on important decisions like fee structures, marketing budget allocation, and new features.',
    status: 'Proposed',
    votes: 56
  }
]

function PIPsPage({ onNavigate }) {
  const [pips] = useState(INITIAL_PIPS)
  const [filter, setFilter] = useState('all')

  const filteredPIPs = filter === 'all' 
    ? pips 
    : pips.filter(p => p.status.toLowerCase().replace(' ', '-') === filter)

  return (
    <div className="pips-page">
      <div className="pips-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>← Back</button>
        <h1>📋 PEPEs Improvement Proposals</h1>
        <p className="pips-desc">
          Community ideas to improve OG Pepe. Only proposals that benefit the community and align with Pepe's mission are shown.
        </p>
      </div>

      <div className="filter-bar">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        <button className={filter === 'proposed' ? 'active' : ''} onClick={() => setFilter('proposed')}>Proposed</button>
        <button className={filter === 'in-progress' ? 'active' : ''} onClick={() => setFilter('in-progress')}>In Progress</button>
        <button className={filter === 'implemented' ? 'active' : ''} onClick={() => setFilter('implemented')}>Implemented</button>
      </div>

      <div className="pips-list">
        {filteredPIPs.map(pip => (
          <div key={pip.id} className="pip-card">
            <div className="pip-header">
              <span className={`pip-status ${pip.status.toLowerCase().replace(' ', '-')}`}>
                {pip.status}
              </span>
              <span className="pip-votes">👍 {pip.votes}</span>
            </div>
            <h3>{pip.title}</h3>
            <p className="pip-description">{pip.description}</p>
            <div className="pip-proposer">
              <span className="proposer-label">Proposed by:</span>
              <span className="proposer-name">{pip.proposer}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="submit-pip">
        <p>Have an idea? Share it in the community group!</p>
      </div>
    </div>
  )
}

export default PIPsPage