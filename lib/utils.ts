import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(amount);
}

export function whatsappUrl(phone: string, businessName: string, productName?: string) {
  const cleaned = phone.replace(/\D/g, "");
  const message = productName
    ? `Hello ${businessName}, I found ${productName} on Reemsun Commerce Map. Is it available?`
    : `Hello ${businessName}, I found your store on Reemsun Commerce Map. I would like to make an enquiry.`;

  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function directionsUrl(latitude: number, longitude: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}
