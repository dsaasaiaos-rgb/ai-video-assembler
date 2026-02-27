# AI Video Assembler - Mobile App Design

## Overview

A mobile app that helps users take AI-generated content (text, images, audio) and piece it together into a cohesive 1-minute video. The app provides tools for scripting, scene planning, content generation, and video assembly with an intuitive timeline interface.

---

## Screen List

1. **Home Screen** - Project list and quick-start options
2. **Project Setup Screen** - Create/edit project with duration and aspect ratio
3. **Script Editor Screen** - Write and organize video script with scenes
4. **Scene Planner Screen** - Plan individual scenes with timing and content type
5. **Content Generator Screen** - Generate AI images, text, and audio for scenes
6. **Timeline/Assembly Screen** - Arrange clips, preview, and export video
7. **Settings Screen** - App preferences and API configuration

---

## Primary Content and Functionality

### Home Screen
- **Content**: List of saved video projects with thumbnails/previews
- **Functionality**:
  - Tap project to open it
  - Create new project button
  - Delete/duplicate project options
  - Show project duration and last edited date

### Project Setup Screen
- **Content**: Project metadata form
- **Functionality**:
  - Set project name
  - Choose aspect ratio (9:16 portrait or 16:9 landscape)
  - Set target duration (1 minute = 60 seconds)
  - Set visual style/mood (e.g., cinematic, casual, professional)
  - Save project

### Script Editor Screen
- **Content**: Text editor for video script
- **Functionality**:
  - Write full script or scene-by-scene breakdown
  - Auto-save to project
  - Character count and estimated reading time
  - Organize into scenes with timing suggestions
  - Add notes for each scene

### Scene Planner Screen
- **Content**: List of scenes with timing breakdown
- **Functionality**:
  - View all scenes with duration allocation
  - Edit scene content (description, dialogue, narration)
  - Assign content type to each scene (image, video, text overlay)
  - Set transitions between scenes
  - Reorder scenes via drag-and-drop

### Content Generator Screen
- **Content**: AI generation interface for individual scenes
- **Functionality**:
  - Generate AI images based on scene description
  - Generate text overlays/captions
  - Generate voiceover/narration audio
  - Preview generated content
  - Accept/reject and regenerate
  - Upload custom media

### Timeline/Assembly Screen
- **Content**: Visual timeline showing all clips and their arrangement
- **Functionality**:
  - Drag clips to reorder
  - Adjust clip duration/trim
  - Add transitions between clips
  - Preview full video
  - Export to camera roll or share
  - Show total duration and remaining time

### Settings Screen
- **Content**: App configuration options
- **Functionality**:
  - API key management (if using external AI services)
  - Video quality settings
  - Default aspect ratio preference
  - About and help information

---

## Key User Flows

### Flow 1: Create and Assemble a 1-Minute Video
1. User taps "New Project" on Home Screen
2. Enters project name and settings on Project Setup Screen
3. Writes script on Script Editor Screen
4. System auto-segments into scenes on Scene Planner Screen
5. User generates content for each scene on Content Generator Screen
6. User arranges clips on Timeline/Assembly Screen
7. User previews and exports video

### Flow 2: Edit Existing Project
1. User taps project on Home Screen
2. Project opens to Timeline/Assembly Screen
3. User can jump to Script Editor or Scene Planner to make changes
4. Changes auto-save
5. User re-previews and re-exports

### Flow 3: Generate Content for a Scene
1. User navigates to Content Generator Screen
2. Selects scene to generate content for
3. Taps "Generate Image" → AI generates image based on scene description
4. Taps "Generate Voiceover" → AI generates audio narration
5. Previews results
6. Accepts or regenerates

---

## Color Choices

**Brand Colors** (tailored for video creation theme):
- **Primary**: `#6366F1` (Indigo) - Creative, modern, video-editing feel
- **Background**: `#FFFFFF` (Light) / `#0F172A` (Dark) - Clean, professional
- **Surface**: `#F1F5F9` (Light) / `#1E293B` (Dark) - Card backgrounds
- **Foreground**: `#0F172A` (Light) / `#F1F5F9` (Dark) - Text
- **Muted**: `#64748B` (Light) / `#94A3B8` (Dark) - Secondary text
- **Border**: `#E2E8F0` (Light) / `#334155` (Dark) - Dividers
- **Success**: `#10B981` (Emerald) - Successful generation/export
- **Warning**: `#F59E0B` (Amber) - Processing, caution
- **Error**: `#EF4444` (Red) - Errors, deletions

---

## Interaction Design Principles

1. **One-Handed Usage**: All interactive elements positioned within thumb reach
2. **Clear Feedback**: Visual and haptic feedback on all actions
3. **Progressive Disclosure**: Show only relevant options for current task
4. **Consistent Navigation**: Tab bar for main sections, back button for nested screens
5. **Undo/Redo**: Support for content generation and timeline edits

---

## Data Model

### Project
- `id`: Unique identifier
- `name`: Project title
- `aspectRatio`: "9:16" | "16:9"
- `targetDuration`: 60 (seconds)
- `visualStyle`: String description (e.g., "cinematic")
- `script`: Full script text
- `scenes`: Array of Scene objects
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Scene
- `id`: Unique identifier
- `order`: Sequence number
- `description`: Scene content description
- `duration`: Allocated time in seconds
- `contentType`: "image" | "video" | "text" | "audio"
- `generatedContent`: Reference to generated media
- `voiceover`: Audio file reference
- `transition`: Transition type to next scene

### GeneratedContent
- `id`: Unique identifier
- `sceneId`: Reference to scene
- `type`: "image" | "audio" | "text"
- `prompt`: Original generation prompt
- `mediaUrl`: File path or URL
- `createdAt`: Timestamp

---

## Technical Considerations

- **Local Storage**: Use AsyncStorage for project data (no cloud sync required initially)
- **Media Handling**: Store generated images/audio locally in app filesystem
- **Video Export**: Use native video composition or third-party library
- **AI Integration**: Backend API calls for image/audio generation
- **Performance**: Lazy load project data, cache thumbnails
