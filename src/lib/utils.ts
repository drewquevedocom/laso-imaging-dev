import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Replaces "MRI" with "MRI - CT" for consistent branding
 */
export function formatEquipmentText(text: string): string {
  return text.replace(/\bMRI\b/g, "MRI - CT");
}
