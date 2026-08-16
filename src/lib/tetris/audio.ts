let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let sfx: GainNode | null = null;
let muted = false;

function ensure() {
  if (ctx) return ctx;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  ctx = new AC({ latencyHint: "interactive" });
  master = ctx.createGain();
  sfx = ctx.createGain();
  sfx.gain.value = 0.22;
  master.gain.value = muted ? 0 : 1;
  sfx.connect(master);
  master.connect(ctx.destination);
  return ctx;
}

export function unlockAudio() {
  const audio = ensure();
  if (audio.state === "suspended") void audio.resume();
}

export function isMuted() {
  return muted;
}

export function setMuted(next: boolean) {
  muted = next;
  if (master && ctx) {
    master.gain.setTargetAtTime(next ? 0 : 1, ctx.currentTime, 0.02);
  }
}

function beep(freq: number, dur: number, type: OscillatorType, gain = 1) {
  const audio = ctx;
  if (!audio || !sfx || muted) return;
  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.18 * gain, now + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(g);
  g.connect(sfx);
  osc.start(now);
  osc.stop(now + dur + 0.02);
  osc.onended = () => {
    osc.disconnect();
    g.disconnect();
  };
}

export const sfxMove = () => beep(420, 0.04, "square", 0.45);
export const sfxRotate = () => beep(560, 0.05, "square", 0.5);
export const sfxLock = () => beep(180, 0.08, "triangle", 0.7);
export const sfxDrop = () => beep(140, 0.07, "triangle", 0.85);
export const sfxHold = () => beep(300, 0.06, "sine", 0.55);
export const sfxClear = (n: number) => {
  beep(520 + n * 80, 0.12, "square", 0.7);
  if (n >= 4) beep(220, 0.22, "sawtooth", 0.45);
};
export const sfxOver = () => {
  beep(180, 0.2, "sawtooth", 0.6);
  beep(110, 0.35, "triangle", 0.7);
};
