import { useState } from 'react';

interface Props {
  onJoin: (name: string) => void;
}

export default function LoginScreen({ onJoin }: Props) {
  const [name, setName] = useState('');

  return (
    <div style={{
      width: '100vw', height: '100vh', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a0a', color: '#e0e0e0', fontFamily: 'Courier New'
    }}>
      <div style={{
        background: '#111', border: '1px solid #333', padding: '3rem',
        borderRadius: '4px', textAlign: 'center', maxWidth: '500px'
      }}>
        <h1 style={{ color: '#ffcc00', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          SCP-3008
        </h1>
        <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
          Object Class: Euclid
        </p>
        <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.85rem', lineHeight: 1.6 }}>
          A perfectly normal, regular old IKEA.<br />
          The store is now open. Please enter the building.
        </p>

        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="Enter your name, D-Class..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && name.trim() && onJoin(name.trim())}
            style={{
              width: '100%', padding: '0.8rem', fontSize: '1rem',
              background: '#1a1a1a', border: '1px solid #444', color: '#fff',
              fontFamily: 'Courier New', borderRadius: '2px'
            }}
          />
        </div>

        <button
          onClick={() => name.trim() && onJoin(name.trim())}
          disabled={!name.trim()}
          style={{
            padding: '0.8rem 2rem', fontSize: '1rem',
            background: name.trim() ? '#003399' : '#222',
            color: name.trim() ? '#fff' : '#555',
            border: '1px solid #444', cursor: name.trim() ? 'pointer' : 'default',
            fontFamily: 'Courier New', borderRadius: '2px', width: '100%'
          }}
        >
          ENTER SCP-3008
        </button>

        <p style={{ color: '#444', marginTop: '1.5rem', fontSize: '0.75rem' }}>
          WASD to move | Mouse to look | Shift to sprint
        </p>
      </div>
    </div>
  );
}
