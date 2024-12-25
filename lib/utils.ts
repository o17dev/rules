import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isImageUrl(url: string): boolean {
  if (!url) return false;
  // if (/^https:\/\/avatars\.githubusercontent\.com\/u\/\d+(\?.*)?$/.test(url)) return true;
  // return /\.(jpg|jpeg|png|gif|bmp|svg|webp|ico)$/i.test(url);
  return true;
}

export function generateNameAbbr(name: string): string {
  if (!name) return "";
  const words = name.split(/\s+/);
  if (words.length === 1) {
    return name.slice(0, 2).toUpperCase();
  }
  return words.slice(0, 2).map(word => word[0]).join("").toUpperCase();
}
