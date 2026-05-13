import { type LucideIcon } from 'lucide-react';
import React from 'react';

export type ToolCategory = 
  | 'Text' 
  | 'Calculator' 
  | 'Converter' 
  | 'Developer' 
  | 'Security' 
  | 'Design' 
  | 'Time' 
  | 'Files'
  | 'Personal';

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon | string;
  component?: React.LazyExoticComponent<React.FC>;
  url?: string;
  isCustom?: boolean;
}

export interface CustomTool {
  id: string;
  name: string;
  url: string;
  description: string;
  category: ToolCategory;
  icon: string;
  createdAt: Date | { toDate: () => Date } | null;
}

export interface SavedPassword {
  id: string;
  service: string;
  username: string;
  passwordValue: string;
  notes?: string;
  createdAt: Date | { toDate: () => Date } | null;
}
