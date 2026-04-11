import { useState, useEffect } from 'react';
import type { PageProps } from './types';

interface MemeSubmission {
  id: number;
  author: string;
  memeUrl: string;
  title: string;
  votes: number;
  submittedAt: string;
}

const INITIAL_MEMES: MemeSubmission[] = [
  {
    id: 1,
    author: 'Community Member',
    memeUrl: '/ogpepebot/memez/1.png',
    title: 'When you see the PEPE chart go brrr',
    votes: 42,
    submittedAt: new Date().toISOString()
  },
  {
    id: 2,
    author: 'OG Holder',
    memeUrl: '/ogpepebot/memez/2.png',
    title: 'Me waiting for 100x',
    votes: 28,
    submittedAt: new Date().toISOString()
  }
];

function MemeBattleArena({ onNavigate }: PageProps) {
  const [memes, setMemes] = useState<MemeSubmission[]>(INITIAL_MEMES);
  const [newMeme, setNewMeme] = useState({ author: '', title: '', memeUrl: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleVote = (id: number) => {
    setMemes(memes.map(meme => 
      meme.id === id ? { ...meme, votes: meme.votes + 1 } : meme
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMeme.author && newMeme.title && newMeme.memeUrl) {
      const newSubmission: MemeSubmission = {
        id: memes.length + 1,
        author: newMeme.author,
        memeUrl: newMeme.memeUrl,
        title: newMeme.title,
        votes: 0,
        submittedAt: new Date().toISOString()
      };
      setMemes([newSubmission, ...memes]);
      setNewMeme({ author: '', title: '', memeUrl: '' });
      setSubmitted(true);
    }
  };

  return (
    <div className="meme-battle-arena">
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('pips')}>← Back to PIPs</button>
        <h1>OG Pepe Meme Battle Arena</h1>
        <p className="page-desc">Weekly meme competitions. Submit your best Pepe memes and vote for your favorites to win PEPE rewards!</p>
      </div>

      <div className="meme-submission-form">
        <h2>Submit Your Meme</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={newMeme.author}
            onChange={(e) => setNewMeme({ ...newMeme, author: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Meme title"
            value={newMeme.title}
            onChange={(e) => setNewMeme({ ...newMeme, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Meme image URL (or upload to IPFS)"
            value={newMeme.memeUrl}
            onChange={(e) => setNewMeme({ ...newMeme, memeUrl: e.target.value })}
            required
          />
          <button type="submit">Submit Meme</button>
        </form>
        {submitted && <p className="success-message">Meme submitted successfully! Good luck! 🍀</p>}
      </div>

      <div className="meme-leaderboard">
        <h2>Current Leaderboard</h2>
        <div className="meme-list">
          {memes.map(meme => (
            <div key={meme.id} className="meme-card">
              <img src={meme.memeUrl} alt={meme.title} />
              <div className="meme-info">
                <h3>{meme.title}</h3>
                <p>by {meme.author}</p>
                <div className="meme-stats">
                  <span className="vote-count">{meme.votes} votes</span>
                  <button onClick={() => handleVote(meme.id)}>👍 Vote for this meme</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="meme-rules">
        <h3>🏆 Rules</h3>
        <ul>
          <li>Only original Pepe memes allowed</li>
          <li>No offensive content</li>
          <li>One submission per person per week</li>
          <li>Winners chosen by community votes</li>
          <li>Prizes: Top 3 memes win PEPE tokens!</li>
        </ul>
      </div>
    </div>
  );
}

export default MemeBattleArena;
