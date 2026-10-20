/** Keep high-frequency input work to one callback per paint. */
export function createFrameCoalescer(callback) {
  let frame = 0;
  return {
    schedule() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        callback();
      });
    },
    cancel() {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}
