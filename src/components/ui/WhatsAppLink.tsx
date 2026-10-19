import { getWhatsAppUrl } from "@/lib/whatsapp";

type WhatsAppLinkProps = {
  message: string;
  className?: string;
  children: React.ReactNode;
};

export function WhatsAppLink({ message, className, children }: WhatsAppLinkProps) {
  return (
    <a
      href={getWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
