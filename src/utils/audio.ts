// Zero-lag synthesized sound effects using the standard Web Audio API
class SoundPlayer {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Chime when logging kilos successfully
  playSuccessChime() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Note 1: C5 (523.25 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(523.25, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2: E5 (659.25 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(659.25, now + 0.1);
      gain2.gain.setValueAtTime(0.12, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.45);

      // Note 3: G5 (783.99 Hz)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(783.99, now + 0.2);
      gain3.gain.setValueAtTime(0.14, now + 0.2);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(now + 0.2);
      osc3.stop(now + 0.6);
    } catch {
      // Audio not supported or blocked by autoplay policy
    }
  }

  // Celebratory fanfare for podium leader or milestone completion
  playTrophyFanfare() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [
        { freq: 440, time: 0, dur: 0.12 },
        { freq: 554.37, time: 0.12, dur: 0.12 },
        { freq: 659.25, time: 0.24, dur: 0.15 },
        { freq: 880, time: 0.42, dur: 0.45 },
      ];

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, now + n.time);
        gain.gain.setValueAtTime(0.1, now + n.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur);
      });
    } catch {
      // Audio error ignored
    }
  }

  // Light soft tick for buttons
  playTick() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Audio error ignored
    }
  }
}

export const sounds = new SoundPlayer();
