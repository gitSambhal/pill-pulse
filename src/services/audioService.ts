/**
 * PillPulse - Web Audio Synthesizer & Sound Service
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import { SoundPreset } from '../types';

class SoundService {
  private ctx: AudioContext | null = null;

  private getAudioContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playAlarm(preset: SoundPreset = 'zen', volume: number = 0.8, repeat: number = 1): void {
    try {
      const ctx = this.getAudioContext();
      const vol = Math.max(0.05, Math.min(1, volume));

      for (let i = 0; i < repeat; i++) {
        const delay = i * 1.6;
        switch (preset) {
          case 'marimba':
            this.playMarimbaMelody(ctx, vol, delay);
            break;
          case 'pulse':
            this.playPulsingBell(ctx, vol, delay);
            break;
          case 'urgent':
            this.playUrgentAlert(ctx, vol, delay);
            break;
          case 'harp':
            this.playHarpCascade(ctx, vol, delay);
            break;
          case 'zen':
          default:
            this.playZenChime(ctx, vol, delay);
            break;
        }
      }

      // Haptic feedback if available on mobile
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate([200, 100, 200, 100, 300]);
        } catch {
          // ignore if denied
        }
      }
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  }

  private playTone(ctx: AudioContext, freq: number, startTime: number, duration: number, volume: number, type: OscillatorType = 'sine') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }

  // 1. Zen Chime: Soft meditative harmonious bell
  private playZenChime(ctx: AudioContext, vol: number, offset: number) {
    const now = ctx.currentTime + offset;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      this.playTone(ctx, freq, now + idx * 0.12, 1.2 - idx * 0.1, vol * 0.7, 'sine');
    });
  }

  // 2. Marimba: Upbeat, warm percussive chime
  private playMarimbaMelody(ctx: AudioContext, vol: number, offset: number) {
    const now = ctx.currentTime + offset;
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, idx) => {
      this.playTone(ctx, freq, now + idx * 0.08, 0.4, vol * 0.8, 'triangle');
    });
  }

  // 3. Pulsing Bell: Calm resonant reminder
  private playPulsingBell(ctx: AudioContext, vol: number, offset: number) {
    const now = ctx.currentTime + offset;
    this.playTone(ctx, 587.33, now, 0.9, vol * 0.8, 'sine'); // D5
    this.playTone(ctx, 880.00, now + 0.15, 0.9, vol * 0.6, 'sine'); // A5
  }

  // 4. Urgent Alert: High-visibility two-tone alert
  private playUrgentAlert(ctx: AudioContext, vol: number, offset: number) {
    const now = ctx.currentTime + offset;
    for (let j = 0; j < 3; j++) {
      const step = now + j * 0.28;
      this.playTone(ctx, 880, step, 0.1, vol * 0.9, 'triangle');
      this.playTone(ctx, 1174.66, step + 0.12, 0.12, vol * 0.9, 'sine');
    }
  }

  // 5. Harp: Soothing ascending arpeggio
  private playHarpCascade(ctx: AudioContext, vol: number, offset: number) {
    const now = ctx.currentTime + offset;
    const freqs = [329.63, 392.00, 493.88, 587.33, 659.25]; // E4, G4, B4, D5, E5
    freqs.forEach((freq, idx) => {
      this.playTone(ctx, freq, now + idx * 0.09, 0.8, vol * 0.6, 'sine');
    });
  }
}

export const audioService = new SoundService();
