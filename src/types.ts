export interface Project {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
  updatedAt: number;
  isFavorite: boolean;
  isArchived: boolean;
  versionHistory: { version: number; timestamp: number; html: string; css: string; js: string; note: string }[];
}

export interface Layer {
  id: string;
  name: string;
  type: string; // e.g., 'div', 'button', 'svg', 'h1', etc.
  selector: string; // class or id selector in HTML/CSS
  isLocked: boolean;
  isHidden: boolean;
  parentId?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'svg' | 'font' | 'video' | 'audio' | 'json' | 'gradient' | 'color-palette';
  content: string; // URL, SVG content, gradient string, or JSON representation
  category?: string;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  sender: {
    username: string;
    avatar: string;
    status: 'online' | 'offline' | 'away';
  };
  text: string;
  timestamp: number;
  attachmentUrl?: string;
  isPinned?: boolean;
}

export interface SystemNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
}

export interface ToolTemplate {
  id: string;
  name: string;
  category: 'Shapes' | 'Typography' | 'Components' | 'Layout' | 'Interactive' | 'Media' | 'Utilities';
  icon: string; // lucide icon name
  html: string;
  css: string;
  js?: string;
  description: string;
}

export interface CSSVisualProperties {
  width: string;
  height: string;
  backgroundColor: string;
  opacity: number;
  borderRadius: string;
  boxShadow: string;
  textShadow: string;
  borderWidth: string;
  borderColor: string;
  borderStyle: string;
  padding: string;
  margin: string;
  fontSize: string;
  color: string;
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  display: string;
  flexDirection: string;
  justifyContent: string;
  alignItems: string;
  transform: string;
  transition: string;
  animation: string;
  backdropFilter: string;
  clipPath: string;
}

export type PreviewDevice = 'desktop' | 'laptop' | 'tablet' | 'phone' | 'responsive';
export type PreviewOrientation = 'portrait' | 'landscape';

export interface WorkspacePanel {
  id: 'preview' | 'editor' | 'sidebar';
  title: string;
  size: number; // percentage
  isCollapsed: boolean;
  isFullscreen: boolean;
}
