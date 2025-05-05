// ── src/types/razorpay.d.ts ──
export {}; // ensure this is a module

declare global {
  interface Window {
    Razorpay: any;
  }
}
