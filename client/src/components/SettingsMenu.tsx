import { useGameStore } from '../store/gameStore';

export default function SettingsMenu() {
  const settings = useGameStore(s => s.settings);
  const setSettings = useGameStore(s => s.setSettings);
  const setSettingsOpen = useGameStore(s => s.setSettingsOpen);

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000, fontFamily: 'Courier New'
    }}>
      <div style={{
        background: '#1a1a1a', border: '1px solid #444', borderRadius: '4px',
        padding: '2rem', width: '400px', color: '#e0e0e0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#ffcc00' }}>Settings</h2>
          <button
            onClick={() => setSettingsOpen(false)}
            style={{
              background: 'none', border: '1px solid #666', color: '#aaa',
              padding: '4px 10px', cursor: 'pointer', fontFamily: 'Courier New'
            }}
          >
            ESC
          </button>
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', marginBottom: '4px', color: '#aaa', fontSize: '12px' }}>
            Render Distance: {settings.renderDistance}
          </label>
          <input
            type="range" min="1" max="5" step="1"
            value={settings.renderDistance}
            onChange={(e) => setSettings({ renderDistance: parseInt(e.target.value) })}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#666' }}>
            <span>Low</span><span>High</span>
          </div>
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', marginBottom: '4px', color: '#aaa', fontSize: '12px' }}>
            Mouse Sensitivity: {settings.mouseSensitivity.toFixed(1)}
          </label>
          <input
            type="range" min="0.2" max="3.0" step="0.1"
            value={settings.mouseSensitivity}
            onChange={(e) => setSettings({ mouseSensitivity: parseFloat(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', marginBottom: '4px', color: '#aaa', fontSize: '12px' }}>
            Field of View: {settings.fov}
          </label>
          <input
            type="range" min="50" max="110" step="5"
            value={settings.fov}
            onChange={(e) => setSettings({ fov: parseInt(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', fontSize: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.showFps}
              onChange={(e) => setSettings({ showFps: e.target.checked })}
            />
            Show FPS Counter
          </label>
        </div>

        <div style={{ borderTop: '1px solid #333', paddingTop: '1rem', marginTop: '1rem' }}>
          <p style={{ color: '#666', fontSize: '11px', margin: 0 }}>
            Press ESC to close. Lower render distance for better performance.
          </p>
        </div>
      </div>
    </div>
  );
}
