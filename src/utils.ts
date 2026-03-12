import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Project {
  id: number;
  title: string;
  description: string;
  author: string;
  category: string;
  difficulty: string;
  image_url: string;
  content: string;
  created_at: string;
}
