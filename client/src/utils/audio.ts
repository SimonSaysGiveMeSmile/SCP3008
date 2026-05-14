const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

let ambientSource: AudioBufferSourceNode | null = null;
let initialized = false;

function createNoise(duration: number, frequency: number): AudioBuffer {
  const sampleRate = audioCtx.sampleRate;
  const length = sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  let phase = 0;
  for (let i = 0; i < length; i++) {
    phase += (2 * Math.PI * frequency) / sampleRate;
    data[i] = Math.sin(phase) * 0.02 + (Math.random() - 0.5) * 0.005;
  }
  return buffer;
}

function playTone(frequency: number, duration: number, volume: number = 0.1) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export function playFootstep(sprinting: boolean = false) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const freq = sprinting ? 60 + Math.random() * 30 : 90 + Math.random() * 50;
  const vol = sprinting ? 0.07 : 0.04;
  const dur = sprinting ? 0.06 : 0.09;
  playTone(freq, dur, vol);
  // Add a subtle high-frequency click for shoe impact
  playTone(800 + Math.random() * 400, 0.02, sprinting ? 0.03 : 0.015);
}

export function playObjectPush() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  // Scraping/sliding sound
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.value = 50 + Math.random() * 30;
  gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.15);
}

export function playObjectHit() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  // Thud when hitting a solid object
  playTone(70 + Math.random() * 20, 0.12, 0.1);
  playTone(140 + Math.random() * 40, 0.06, 0.05);
}

export function playAttackSwing() {
  playTone(200, 0.15, 0.08);
  setTimeout(() => playTone(150, 0.1, 0.05), 50);
}

export function playHit() {
  playTone(100, 0.2, 0.12);
  playTone(60, 0.3, 0.08);
}

export function playDamage() {
  playTone(300, 0.1, 0.15);
  setTimeout(() => playTone(200, 0.15, 0.1), 80);
}

export function playNPCVoice(aggressive: boolean) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const baseFreq = aggressive ? 120 : 180;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = aggressive ? 'sawtooth' : 'triangle';
  osc.frequency.value = baseFreq + Math.random() * 40;
  osc.frequency.linearRampToValueAtTime(
    baseFreq + (aggressive ? -30 : 20),
    audioCtx.currentTime + 0.4
  );
  gain.gain.setValueAtTime(aggressive ? 0.08 : 0.04, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (aggressive ? 0.6 : 0.3));
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.6);
}

export function playStoreClosing() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const frequencies = [440, 392, 349, 330];
  frequencies.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.5, 0.12), i * 500);
  });
}

export function playFlashlightClick() {
  playTone(2000, 0.03, 0.06);
}

export function startAmbience() {
  if (initialized) return;
  initialized = true;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const buffer = createNoise(4, 60);
  ambientSource = audioCtx.createBufferSource();
  ambientSource.buffer = buffer;
  ambientSource.loop = true;
  const gain = audioCtx.createGain();
  gain.gain.value = 0.015;
  ambientSource.connect(gain);
  gain.connect(audioCtx.destination);
  ambientSource.start();
}

export function initAudio() {
  const resume = () => {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    startAmbience();
  };
  document.addEventListener('click', resume, { once: true });
  document.addEventListener('keydown', resume, { once: true });
}
