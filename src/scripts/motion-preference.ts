// The site owner wants full motion always enabled, without a visitor switch.
export function motionEnabled(){return true;}
export function syncMotionPreference(){
  document.documentElement.dataset.motion='full';
  return true;
}
