import type { QuickAction } from '../types'

export const QUICK_ACTIONS: QuickAction[] = [
  // General
  {
    id: 'analyze-project',
    label: 'Analyze Project',
    prompt:
      'Analyze this project: provide an overview of its structure, architecture, main technologies used, and potential improvements.',
    icon: 'Search',
    category: 'general',
  },
  {
    id: 'generate-architecture',
    label: 'Generate Architecture Summary',
    prompt:
      'Generate a comprehensive architecture summary for this project, including folder structure, design patterns, and component relationships.',
    icon: 'Layout',
    category: 'general',
  },
  {
    id: 'review-codebase',
    label: 'Review Current Codebase',
    prompt:
      'Review the current codebase: identify code quality issues, potential bugs, duplicate code, and suggest improvements.',
    icon: 'Eye',
    category: 'general',
  },
  {
    id: 'create-readme',
    label: 'Create README',
    prompt:
      'Create a comprehensive README.md for this project with installation instructions, usage guide, and project description.',
    icon: 'FileText',
    category: 'general',
  },
  {
    id: 'suggest-refactor',
    label: 'Suggest Refactor',
    prompt:
      'Analyze the codebase and suggest specific refactoring opportunities to improve code quality, maintainability, and performance.',
    icon: 'RefreshCw',
    category: 'general',
  },
  {
    id: 'generate-tests',
    label: 'Generate Tests',
    prompt:
      'Generate comprehensive unit tests for the main functions and components in this project.',
    icon: 'CheckSquare',
    category: 'general',
  },
  {
    id: 'review-security',
    label: 'Review Security',
    prompt:
      'Perform a security review of this codebase: identify vulnerabilities, exposed secrets, missing validations, and security best practices.',
    icon: 'Shield',
    category: 'general',
  },
  {
    id: 'fix-issue',
    label: 'Fix Current Issue',
    prompt: 'Analyze the current issue in this project and provide a fix with explanation.',
    icon: 'Wrench',
    category: 'general',
  },
  {
    id: 'propose-tasks',
    label: 'Propose Next Tasks',
    prompt:
      'Based on the current state of this project, propose the most important next development tasks and priorities.',
    icon: 'ListTodo',
    category: 'general',
  },

  // Unity
  {
    id: 'unity-analyze',
    label: 'Analyze Unity Project',
    prompt:
      'Analyze this Unity project: review the Assets structure, Scripts organization, Scene hierarchy, and suggest architectural improvements.',
    icon: 'Gamepad2',
    category: 'unity',
  },
  {
    id: 'unity-csharp',
    label: 'Generate C# Script',
    prompt:
      'Generate a well-structured C# MonoBehaviour script for Unity with proper Awake/Start/Update lifecycle methods and documentation.',
    icon: 'Code',
    category: 'unity',
  },
  {
    id: 'unity-manager',
    label: 'Create Manager Class',
    prompt:
      'Create a manager class (singleton pattern) for Unity with proper initialization, event system integration, and lifecycle management.',
    icon: 'Settings',
    category: 'unity',
  },
  {
    id: 'unity-architecture',
    label: 'Suggest Scene Architecture',
    prompt:
      'Suggest an optimal scene architecture for this Unity project, including GameObjects hierarchy, component structure, and prefab organization.',
    icon: 'Layers',
    category: 'unity',
  },
  {
    id: 'unity-monobehaviour',
    label: 'Review MonoBehaviour Design',
    prompt:
      'Review all MonoBehaviour scripts in this Unity project and suggest improvements for performance, design patterns, and Unity best practices.',
    icon: 'Bug',
    category: 'unity',
  },
  {
    id: 'unity-debug',
    label: 'Explain Unity Error',
    prompt:
      'Analyze the Unity console error logs and provide detailed explanations and fixes for each error.',
    icon: 'AlertTriangle',
    category: 'unity',
  },
  {
    id: 'unity-gameplay',
    label: 'Generate Gameplay System',
    prompt:
      'Design and generate a gameplay system draft for this Unity project including player controller, game loop, and state management.',
    icon: 'Zap',
    category: 'unity',
  },

  // Web
  {
    id: 'web-component',
    label: 'Generate React Component',
    prompt:
      'Generate a well-typed, reusable React component with TypeScript, proper props interface, and Tailwind CSS styling.',
    icon: 'Component',
    category: 'web',
  },
  {
    id: 'web-architecture',
    label: 'Review Frontend Architecture',
    prompt:
      'Review the frontend architecture of this web project: component structure, state management, routing, and suggest improvements.',
    icon: 'Globe',
    category: 'web',
  },
  {
    id: 'web-refactor',
    label: 'Refactor Page',
    prompt:
      'Refactor the current page component: improve structure, extract reusable components, optimize performance, and enhance TypeScript typing.',
    icon: 'RefreshCw',
    category: 'web',
  },
  {
    id: 'web-api',
    label: 'Explain API Structure',
    prompt:
      'Explain the API structure of this project and suggest improvements for endpoint design, error handling, and data contracts.',
    icon: 'Server',
    category: 'web',
  },
  {
    id: 'web-typescript',
    label: 'Improve TypeScript Typing',
    prompt:
      'Analyze the TypeScript code and improve type safety: add missing types, interfaces, generics, and strict type checks.',
    icon: 'Type',
    category: 'web',
  },
  {
    id: 'web-form',
    label: 'Generate Form/Dashboard',
    prompt:
      'Generate a well-structured form or dashboard layout with proper validation, error states, and responsive design.',
    icon: 'LayoutDashboard',
    category: 'web',
  },

  // Mobile
  {
    id: 'mobile-architecture',
    label: 'Review Mobile Architecture',
    prompt:
      'Review the mobile app architecture: navigation structure, state management, component reuse, and platform-specific considerations.',
    icon: 'Smartphone',
    category: 'mobile',
  },
  {
    id: 'mobile-screen',
    label: 'Generate Screen Component',
    prompt:
      'Generate a well-structured mobile screen component with proper navigation props, layout, and state management.',
    icon: 'Monitor',
    category: 'mobile',
  },
  {
    id: 'mobile-navigation',
    label: 'Improve Navigation Structure',
    prompt:
      'Analyze and improve the navigation structure of this mobile app: suggest better patterns for routing, deep linking, and user flow.',
    icon: 'Navigation',
    category: 'mobile',
  },
  {
    id: 'mobile-state',
    label: 'Refactor State Management',
    prompt:
      'Review and refactor the state management approach in this mobile app: identify inefficiencies and suggest better patterns.',
    icon: 'Database',
    category: 'mobile',
  },
  {
    id: 'mobile-api',
    label: 'Suggest API Integration',
    prompt:
      'Suggest optimal API integration patterns for this mobile app including error handling, caching, and offline support.',
    icon: 'Wifi',
    category: 'mobile',
  },
  {
    id: 'mobile-ui',
    label: 'Generate Reusable UI Block',
    prompt:
      'Generate a reusable UI component block for mobile with proper styling, accessibility, and cross-platform compatibility.',
    icon: 'Square',
    category: 'mobile',
  },
]
