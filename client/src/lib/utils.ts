import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function for merging class names, with Tailwind merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Use environment variable for API base URL or fallback to the Strapi URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.dachyubagain.store';

// Type for imageObject to ensure type safety
interface ImageObject {
  url?: string;
}

// Function to get image URL from Strapi API, ensuring no CORS issues by proxying through our API
export const getImageUrl = (imageObject: ImageObject | null): string => {
  if (!imageObject || !imageObject.url) return ''; // Safely handle imageObject and its URL
  // Return the full URL for the image based on the Strapi API base URL
  return `${API_BASE_URL}${imageObject.url}`;
};

// Function to format a number as a USD price
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};
