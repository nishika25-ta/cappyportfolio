export function getEnergyState(value) {
  const energy=Math.min(100,Math.max(0,value));
  const mood=energy<28?'calm':energy<80?'playful':'wild';
  const label=mood==='calm'?'Quietly clever':mood==='playful'?'Feeling playful':'Full purr-sonality';
  return {energy,level:energy/100,mood,label};
}
