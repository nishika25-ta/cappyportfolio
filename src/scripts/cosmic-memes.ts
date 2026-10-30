import { isAllowedMemeId, isAllowedVideoSource } from './security.mjs';

interface CosmicMemeCleanup {
  destroy: () => void;
}

const SPEED_STEPS = [1.0, 1.5, 2.0];
const MEME_IDS = [
  'meme-1', 'meme-2', 'meme-3', 'meme-4', 'meme-5',
  'meme-6', 'meme-7', 'meme-8', 'meme-9', 'meme-10'
] as const;

export function initCosmicMemeVault(): CosmicMemeCleanup | undefined {
  const root = document.getElementById('cosmic-terminal-root');
  if (!root) return undefined;
  const rootEl = root;

  const controller = new AbortController();
  const { signal } = controller;

  let activeMemeId = rootEl.dataset.activeMeme || 'meme-1';
  let isAudioEnabled = false;
  let currentSpeedIndex = 0;
  let audioCtx: AudioContext | null = null;

  const screenContainer = document.getElementById('terminal-screen');
  const fxCanvas = document.getElementById('cosmic-fx-canvas');
  const counterEl = document.getElementById('active-channel-counter');
  const tickerText = document.getElementById('terminal-ticker-text');
  const footerAudio = document.getElementById('footer-audio-status');
  const audioBtn = document.getElementById('btn-toggle-audio');
  const audioLabel = document.getElementById('audio-label');
  const speedBtn = document.getElementById('btn-toggle-speed');
  const speedLabel = document.getElementById('speed-label');
  const scanlinesBtn = document.getElementById('btn-toggle-scanlines');
  const warpBtn = document.getElementById('btn-hyperspace-warp');

  const channelTabs = [...document.querySelectorAll<HTMLButtonElement>('[data-channel-meme]')];
  const scenes = [...document.querySelectorAll<HTMLElement>('.meme-scene')];
  const lorePanels = [...document.querySelectorAll<HTMLElement>('.lore-panel')];
  const capsuleCards = [...document.querySelectorAll<HTMLElement>('[data-capsule-meme]')];

  // Synthesize lightweight retro sci-fi sound effects via Web Audio API
  function playCosmicTone(type: 'beep' | 'warp' | 'burst') {
    try {
      if (!isAudioEnabled) return;
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      if (type === 'beep') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'warp') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.35);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'burst') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(740, now);
        osc.frequency.exponentialRampToValueAtTime(1280, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch {
      // AudioContext unavailable or blocked
    }
  }

  // Particle emission helper (DOM-safe, no innerHTML)
  function emitParticles(count = 8) {
    if (!fxCanvas) return;
    const glyphs = ['✦', '★', '♡', '🐾', '✨', '🛸'];
    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      span.className = 'cosmic-sparkle';
      span.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      span.style.left = `${15 + Math.random() * 70}%`;
      span.style.top = `${20 + Math.random() * 60}%`;
      span.style.setProperty('--dx', `${(Math.random() - 0.5) * 160}px`);
      span.style.setProperty('--dy', `${-40 - Math.random() * 120}px`);
      span.style.setProperty('--dr', `${(Math.random() - 0.5) * 180}deg`);
      span.style.color = ['#37ed89', '#f8e5a7', '#f2b6cb', '#bfd8db'][Math.floor(Math.random() * 4)];
      fxCanvas.appendChild(span);
      setTimeout(() => span.remove(), 1500);
    }
  }

  // Video playback helper
  function updateVideoPlayback(scene: HTMLElement, shouldPlay: boolean) {
    const video = scene.querySelector<HTMLVideoElement>('video');
    if (!video) return;

    if (shouldPlay) {
      const src = video.dataset.memeSrc;
      if (src && !video.getAttribute('src') && isAllowedVideoSource(src, false)) {
        video.src = src;
      }
      video.muted = !isAudioEnabled;
      video.playbackRate = SPEED_STEPS[currentSpeedIndex];
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  // Switch to a specific meme
  function selectMeme(memeId: string, triggerSound = true) {
    if (!isAllowedMemeId(memeId)) return;
    activeMemeId = memeId;
    rootEl.dataset.activeMeme = memeId;

    const memeIndex = MEME_IDS.indexOf(memeId as typeof MEME_IDS[number]);
    if (counterEl) {
      const current = String(memeIndex + 1).padStart(2, '0');
      const total = String(MEME_IDS.length).padStart(2, '0');
      counterEl.textContent = `${current} / ${total}`;
    }

    // Update Channel Tabs
    let activeChannelBtn: HTMLElement | null = null;
    channelTabs.forEach(tab => {
      const isMatch = tab.dataset.channelMeme === memeId;
      tab.setAttribute('aria-selected', String(isMatch));
      tab.tabIndex = isMatch ? 0 : -1;
      if (isMatch) activeChannelBtn = tab;
    });

    // Auto-scroll active channel into view in the tuner list
    if (activeChannelBtn) {
      (activeChannelBtn as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    // Update Scenes
    scenes.forEach(scene => {
      const isMatch = scene.dataset.memeId === memeId;
      scene.hidden = !isMatch;
      updateVideoPlayback(scene, isMatch);
    });

    // Update Lore Panels
    lorePanels.forEach(lore => {
      const isMatch = lore.id === `lore-${memeId}`;
      lore.hidden = !isMatch;
    });

    // Highlight Capsule Card
    capsuleCards.forEach(card => {
      const isMatch = card.dataset.capsuleMeme === memeId;
      if (isMatch) {
        card.style.borderColor = '#37ed89';
        card.style.boxShadow = '0 0 16px rgba(55, 237, 137, 0.25)';
      } else {
        card.style.borderColor = '';
        card.style.boxShadow = '';
      }
    });

    // Status ticker update
    if (tickerText) {
      const activeTab = channelTabs.find(t => t.dataset.channelMeme === memeId);
      const name = activeTab?.querySelector('.channel-btn-name')?.textContent || memeId;
      tickerText.textContent = `Locked onto channel 0${memeIndex + 1}: ${name}. Telemetry active.`;
    }

    // Update 90s OSD on CRT glass
    const osd = document.getElementById('crt-osd-text');
    if (osd) {
      const chNum = String(memeIndex + 1).padStart(2, '0');
      osd.textContent = `AV-${chNum} STEREO // 7777 MHz`;
    }

    if (triggerSound) {
      playCosmicTone('beep');
    }
  }

  // Channel Tabs click & keyboard navigation
  channelTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const id = tab.dataset.channelMeme;
      if (id) selectMeme(id);
    }, { signal });

    tab.addEventListener('keydown', (e: KeyboardEvent) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      const current = channelTabs.indexOf(tab);
      let nextIndex = 0;
      if (e.key === 'Home') nextIndex = 0;
      else if (e.key === 'End') nextIndex = channelTabs.length - 1;
      else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') nextIndex = (current + 1) % channelTabs.length;
      else nextIndex = (current - 1 + channelTabs.length) % channelTabs.length;

      const nextTab = channelTabs[nextIndex];
      const nextId = nextTab.dataset.channelMeme;
      if (nextId) {
        selectMeme(nextId);
        nextTab.focus();
      }
    }, { signal });
  });

  // Audio Toggle
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      isAudioEnabled = !isAudioEnabled;
      audioBtn.setAttribute('aria-pressed', String(isAudioEnabled));
      if (audioLabel) {
        audioLabel.textContent = isAudioEnabled ? 'Sound ON' : 'Muted';
      }
      if (footerAudio) {
        footerAudio.textContent = isAudioEnabled ? 'AUDIO LIVE' : 'MUTED (TAP UNMUTE)';
      }
      // Apply to active video
      const activeScene = document.getElementById(`meme-scene-${activeMemeId}`);
      const activeVideo = activeScene?.querySelector<HTMLVideoElement>('video');
      if (activeVideo) {
        activeVideo.muted = !isAudioEnabled;
        if (isAudioEnabled) {
          activeVideo.play().catch(() => {});
        }
      }
      if (isAudioEnabled) {
        playCosmicTone('burst');
        emitParticles(6);
      }
    }, { signal });
  }

  // Speed Booster Toggle
  if (speedBtn) {
    speedBtn.addEventListener('click', () => {
      currentSpeedIndex = (currentSpeedIndex + 1) % SPEED_STEPS.length;
      const speed = SPEED_STEPS[currentSpeedIndex];
      if (speedLabel) {
        speedLabel.textContent = `${speed.toFixed(1)}x Speed`;
      }
      const activeScene = document.getElementById(`meme-scene-${activeMemeId}`);
      const activeVideo = activeScene?.querySelector<HTMLVideoElement>('video');
      if (activeVideo) {
        activeVideo.playbackRate = speed;
      }
      playCosmicTone('beep');
    }, { signal });
  }

  // CRT Scanlines Toggle
  if (scanlinesBtn && screenContainer) {
    scanlinesBtn.addEventListener('click', () => {
      const active = screenContainer.classList.toggle('crt-scanlines-active');
      scanlinesBtn.setAttribute('aria-pressed', String(active));
      playCosmicTone('beep');
    }, { signal });
  }

  // Hyperspace Jump Button
  if (warpBtn) {
    warpBtn.addEventListener('click', () => {
      // Pick a random meme different from the current one
      const others = MEME_IDS.filter(id => id !== activeMemeId);
      const nextId = others[Math.floor(Math.random() * others.length)];
      playCosmicTone('warp');
      emitParticles(16);
      selectMeme(nextId, false);
      if (tickerText) {
        tickerText.textContent = `🚀 Hyperspace jump executed! Transmitted to ${nextId.toUpperCase()}.`;
      }
    }, { signal });
  }

  // Degauss Screen Wobble Button
  const degaussBtn = document.getElementById('btn-crt-degauss');
  const monitorEl = document.getElementById('retro-crt-monitor');
  if (degaussBtn && monitorEl) {
    degaussBtn.addEventListener('click', () => {
      monitorEl.classList.remove('degauss-active');
      // Trigger reflow to restart animation
      void monitorEl.offsetWidth;
      monitorEl.classList.add('degauss-active');
      playCosmicTone('warp');
      emitParticles(8);
      setTimeout(() => monitorEl.classList.remove('degauss-active'), 550);
    }, { signal });
  }

  // CRT Power Switch
  const powerBtn = document.getElementById('btn-crt-power');
  if (powerBtn) {
    powerBtn.addEventListener('click', () => {
      const activeScene = document.getElementById(`meme-scene-${activeMemeId}`);
      const video = activeScene?.querySelector<HTMLVideoElement>('video');
      if (video) {
        if (video.paused) {
          video.play().catch(() => {});
          playCosmicTone('burst');
        } else {
          video.pause();
          playCosmicTone('beep');
        }
      }
    }, { signal });
  }

  // Transmit Meow Stardust buttons
  document.querySelectorAll<HTMLButtonElement>('[data-beam-meme]').forEach(btn => {
    btn.addEventListener('click', () => {
      emitParticles(12);
      playCosmicTone('burst');
    }, { signal });
  });

  // Video play/pause indicator clicks
  document.querySelectorAll<HTMLElement>('[data-toggle-playback]').forEach(btn => {
    btn.addEventListener('click', () => {
      const scene = btn.closest('.meme-scene');
      const video = scene?.querySelector<HTMLVideoElement>('video');
      if (!video) return;
      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }, { signal });
  });

  // Space Capsule selectors (from the grid cards)
  document.querySelectorAll<HTMLElement>('[data-capsule-select]').forEach(btn => {
    btn.addEventListener('click', () => {
      const memeId = btn.dataset.capsuleSelect;
      if (memeId) {
        selectMeme(memeId);
        rootEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        emitParticles(10);
      }
    }, { signal });
  });

  // IntersectionObserver to pause video when terminal is scrolled off screen
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
      const activeScene = document.getElementById(`meme-scene-${activeMemeId}`);
      if (activeScene) {
        updateVideoPlayback(activeScene, isVisible);
      }
    }
  }, { rootMargin: '100px 0px', threshold: [0, 0.15] });

  observer.observe(rootEl);

  // Initialize initial meme
  selectMeme(activeMemeId, false);

  return {
    destroy: () => {
      controller.abort();
      observer.disconnect();
      scenes.forEach(scene => {
        const v = scene.querySelector<HTMLVideoElement>('video');
        if (v) {
          v.pause();
          v.removeAttribute('src');
          v.load();
        }
      });
      if (audioCtx) {
        audioCtx.close().catch(() => {});
        audioCtx = null;
      }
    }
  };
}
