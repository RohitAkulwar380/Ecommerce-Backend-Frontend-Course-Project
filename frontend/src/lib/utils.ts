import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a relative URL to an absolute URL using the API base URL
 * @param url Relative URL starting with '/'
 * @returns Absolute URL
 */
export function getAbsoluteUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
  return url.startsWith('http') ? url : `${baseURL}${url}`;
}
