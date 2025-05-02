import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Using our Express server as proxy to avoid CORS issues
export const API_BASE_URL = '';

export const getImageUrl = (imageObject: any): string => {
  if (!imageObject) return '';
  // Use our proxy for images to avoid CORS issues
  return imageObject.url;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};
