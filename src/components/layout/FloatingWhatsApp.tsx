import { messages } from "@/lib/whatsapp";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

export function FloatingWhatsApp() {
  return (
    <WhatsAppLink
      message={messages.general}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#3F5214] text-white shadow-[0_10px_24px_rgba(40,50,20,0.28)] transition-transform duration-200 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
    >
      <span className="sr-only">Chat on WhatsApp</span>
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-current">
        <path d="M12.04 3C7.31 3 3.47 6.78 3.47 11.44c0 1.48.4 2.92 1.16 4.19L3.4 21l5.52-1.2a8.7 8.7 0 0 0 3.12.57h.01c4.73 0 8.57-3.78 8.57-8.44C20.62 6.78 16.77 3 12.04 3Zm4.86 11.93c-.2.57-1.17 1.09-1.63 1.16-.42.06-.95.09-1.53-.1-.35-.11-.8-.26-1.38-.51-2.43-1.05-4.01-3.5-4.13-3.66-.12-.17-.99-1.32-.99-2.52s.63-1.79.85-2.03c.22-.25.48-.31.64-.31h.46c.15 0 .35-.06.54.41.2.48.68 1.66.74 1.78.06.12.1.26.02.42-.08.17-.12.27-.24.41-.12.15-.25.33-.36.44-.12.12-.24.25-.1.48.14.23.62 1.02 1.33 1.66.92.82 1.69 1.07 1.93 1.19.24.12.38.1.52-.06.14-.17.6-.7.76-.94.16-.23.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.14 1.15Z" />
      </svg>
    </WhatsAppLink>
  );
}
