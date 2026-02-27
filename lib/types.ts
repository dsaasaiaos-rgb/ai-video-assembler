/**
 * Core types for the AI Video Assembler app
 */

export type AspectRatio = "9:16" | "16:9";

export interface Project {
  id: string;
  name: string;
  aspectRatio: AspectRatio;
  targetDuration: number; // in seconds, typically 60
  visualStyle: string;
  script: string;
  scenes: Scene[];
  createdAt: number;
  updatedAt: number;
}

export interface Scene {
  id: string;
  projectId: string;
  order: number;
  description: string;
  duration: number; // in seconds
  contentType: ContentType;
  voiceoverText?: string;
  voiceoverUrl?: string;
  imageUrl?: string;
  transition: TransitionType;
}

export type ContentType = "image" | "video" | "text" | "audio";
export type TransitionType = "fade" | "slide" | "cut" | "zoom";

export interface GeneratedContent {
  id: string;
  sceneId: string;
  type: "image" | "audio" | "text";
  prompt: string;
  mediaUrl: string;
  createdAt: number;
}

export interface AppState {
  projects: Project[];
  currentProjectId: string | null;
  isLoading: boolean;
  error: string | null;
}
