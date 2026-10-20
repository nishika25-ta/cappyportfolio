export function createFrameCoalescer(callback: () => void): {
  schedule(): void;
  cancel(): void;
};
