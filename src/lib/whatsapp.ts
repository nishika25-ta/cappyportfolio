const WHATSAPP_NUMBER = "60178478597";

export function getWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const messages = {
  general: "Hi! I'm interested in your freelance services.",
  websites: "Hi! I'm interested in your website design packages.",
  resumes: "Hi! I'm interested in your résumé/CV services.",
  food: "Hi! I'm interested in your food image enhancement services.",
} as const;

export function packageMessage(name: string, price: number) {
  return `Hi! I'm interested in the ${name} package (RM${price}). Could you tell me what you need from me to get started?`;
}
