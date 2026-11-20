// Browser site mute and device output controls govern these gesture-triggered tones.
window.CoySound = (() => {
  const cues = {
    swipe: [[620, 830, 0, .055]],
    like: [[535, 690, 0, .12]],
    pass: [[460, 350, 0, .10]],
    match: [[392, 392, 0, .19], [494, 494, .065, .22], [587, 587, .13, .25]]
  };
  let context, output;
  async function unlock() {
    if (document.hidden) return;
    try {
      if (!context) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return;
        context = new Audio();
        output = context.createGain();
        output.connect(context.destination);
      }
      if (context.state !== 'running') await context.resume();
    } catch { /* Visual feedback remains available. */ }
  }
  async function play(name) {
    await unlock();
    if (document.hidden || context?.state !== 'running') return;
    for (const [from, to, delay, duration] of cues[name]) {
      const tone = context.createOscillator(), gain = context.createGain();
      const start = context.currentTime + delay, end = start + duration;
      tone.frequency.setValueAtTime(from, start);
      tone.frequency.exponentialRampToValueAtTime(to, end);
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.linearRampToValueAtTime(.13, start + .012);
      gain.gain.linearRampToValueAtTime(.085, start + duration * .55);
      gain.gain.exponentialRampToValueAtTime(.0001, end);
      tone.connect(gain).connect(output);
      tone.onended = () => { tone.disconnect(); gain.disconnect(); };
      tone.start(start); tone.stop(end);
    }
  }
  return { unlock, play };
})();
