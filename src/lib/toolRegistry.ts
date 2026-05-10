import { Calculator, Type, Globe, Code, Lock, Shield, FileText, Palette } from 'lucide-react';
import React from 'react';
import type { ToolDefinition } from '../types/tool';

export const toolRegistry: ToolDefinition[] = [
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    description: 'Calculate your exact age in years, months, and days.',
    category: 'Calculator',
    icon: Calculator,
    component: React.lazy(() => import('../features/tools/calculator/AgeCalculator')),
  },
  {
    id: 'text-case-converter',
    name: 'Text Case Converter',
    description: 'Convert text between uppercase, lowercase, sentence case, and more.',
    category: 'Text',
    icon: Type,
    component: React.lazy(() => import('../features/tools/text/CaseConverter')),
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Create secure, random passwords with custom requirements.',
    category: 'Security',
    icon: Lock,
    component: React.lazy(() => import('../features/tools/security/PasswordGenerator')),
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Prettify, validate, and minify your JSON data.',
    category: 'Developer',
    icon: Code,
    component: React.lazy(() => import('../features/tools/developer/JsonFormatter')),
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between different units of length, mass, and more.',
    category: 'Converter',
    icon: Globe,
    component: React.lazy(() => import('../features/tools/converter/UnitConverter')),
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-256, and other hashes from text.',
    category: 'Security',
    icon: Shield,
    component: React.lazy(() => import('../features/tools/security/HashGenerator')),
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum',
    description: 'Generate placeholder text for your designs.',
    category: 'Text',
    icon: FileText,
    component: React.lazy(() => import('../features/tools/text/LoremIpsum')),
  },
  {
    id: 'color-picker',
    name: 'Color Picker',
    description: 'Select colors and get their HEX, RGB, and HSL values.',
    category: 'Design',
    icon: Palette,
    component: React.lazy(() => import('../features/tools/design/ColorPicker')),
  },
];
