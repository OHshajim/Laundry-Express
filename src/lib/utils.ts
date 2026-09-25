import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind and conditional classes safely.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats numeric amount to USD currency string ($XX.XX).
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a date string or Date object into human-friendly format.
 * e.g., "Monday, Oct 12, 2026"
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

/**
 * Generates human-friendly sequential order code (e.g. LX-2026-0042).
 */
export function generateOrderNumber(sequence: number): string {
  const year = new Date().getFullYear();
  const padded = sequence.toString().padStart(4, "0");
  return `LX-${year}-${padded}`;
}

/**
 * Truncates long text gracefully.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
