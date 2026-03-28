import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Project {
  id: string; // Changed to string (UUID)
  title: string;
  description: string;
  author: string;
  user_id: string;
  category: string;
  difficulty: string;
  image_url: string;
  content: string; // Markdown project body
  components: string[]; // List of hardware components
  code_snippet?: string; // Optional code block
  schematic_url?: string; // Optional link to schematic
  created_at: string;
}
