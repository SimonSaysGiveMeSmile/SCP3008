import { useState } from 'react';
import { isTouchDevice } from '../touch';

interface Props {
  onJoin: (name: string) => void;
}

export default function LoginScreen({ onJoin }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showSubscribeMsg, setShowSubscribeMsg] = useState(false);

  const handleSubscribe = () => {
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setShowSubscribeMsg(true);
      setTimeout(() => setShowSubscribeMsg(false), 3000);
    }
  };

  return (
    <div style={{
      width: '100vw', height: '100vh', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a0a', color: '#e0e0e0', fontFamily: 'Courier New'
    }}>
      <div style={{
        background: '#111', border: '1px solid #333', padding: '2.5rem',
        borderRadius: '4px', textAlign: 'center', maxWidth: '480px', width: '90%'
      }}>
        <h1 style={{ color: '#ffcc00', fontSize: '2.5rem', marginBottom: '0.3rem' }}>
          SCP-3008
        </h1>
        <p style={{ color: '#666', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
          Object Class: Euclid
        </p>
        <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.8rem', lineHeight: 1.5 }}>
          A perfectly normal, regular old IKEA.<br />
          The store is now open. Please enter the building.
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Enter your name, D-Class..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && name.trim() && onJoin(name.trim())}
            style={{
              width: '100%', padding: '0.7rem', fontSize: '0.95rem',
              background: '#1a1a1a', border: '1px solid #444', color: '#fff',
              fontFamily: 'Courier New', borderRadius: '2px', boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          onClick={() => name.trim() && onJoin(name.trim())}
          disabled={!name.trim()}
          style={{
            padding: '0.7rem 2rem', fontSize: '1rem',
            background: name.trim() ? '#003399' : '#222',
            color: name.trim() ? '#fff' : '#555',
            border: '1px solid #444', cursor: name.trim() ? 'pointer' : 'default',
            fontFamily: 'Courier New', borderRadius: '2px', width: '100%',
            marginBottom: '1.5rem', boxSizing: 'border-box'
          }}
        >
          ENTER SCP-3008
        </button>

        <div style={{ borderTop: '1px solid #222', paddingTop: '1.2rem' }}>
          <p style={{ color: '#666', fontSize: '0.75rem', marginBottom: '0.6rem' }}>
            Subscribe for updates and survival tips
          </p>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
              disabled={subscribed}
              style={{
                flex: 1, padding: '0.5rem', fontSize: '0.8rem',
                background: subscribed ? '#1a2a1a' : '#1a1a1a',
                border: `1px solid ${subscribed ? '#2a4a2a' : '#333'}`,
                color: subscribed ? '#4a8a4a' : '#fff',
                fontFamily: 'Courier New', borderRadius: '2px'
              }}
            />
            <button
              onClick={handleSubscribe}
              disabled={subscribed || !email.includes('@')}
              style={{
                padding: '0.5rem 1rem', fontSize: '0.75rem',
                background: subscribed ? '#1a3a1a' : '#333',
                color: subscribed ? '#4a8a4a' : '#aaa',
                border: '1px solid #444', cursor: subscribed ? 'default' : 'pointer',
                fontFamily: 'Courier New', borderRadius: '2px', whiteSpace: 'nowrap'
              }}
            >
              {subscribed ? 'SUBSCRIBED' : 'SUBSCRIBE'}
            </button>
          </div>
          {showSubscribeMsg && (
            <p style={{ color: '#4a8a4a', fontSize: '0.7rem', marginTop: '0.5rem' }}>
              You will receive survival updates. Stay alive.
            </p>
          )}
        </div>

        <p style={{ color: '#444', marginTop: '1.2rem', fontSize: '0.7rem' }}>
          {isTouchDevice()
            ? 'Joystick to move · drag to look · HIT · 1–4 weapons · flashlight'
            : 'WASD Move | Mouse Look | Shift Sprint | F Flashlight | LMB Attack'}
        </p>
      </div>
    </div>
  );
}
