import { Scene } from "./types";
import { generateId } from "./utils";

/**
 * Segments a script into scenes based on natural breaks (periods, line breaks)
 * Allocates duration evenly across scenes to fit the target duration
 */
export function segmentScriptIntoScenes(
  script: string,
  targetDuration: number
): Scene[] {
  if (!script.trim()) return [];

  // Split script into paragraphs/sentences
  const paragraphs = script
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (paragraphs.length === 0) return [];

  // Calculate duration per scene
  const durationPerScene = Math.floor(targetDuration / paragraphs.length);
  const remainingDuration = targetDuration % paragraphs.length;

  // Create scenes from paragraphs
  const scenes: Scene[] = paragraphs.map((description, index) => {
    const extraDuration = index < remainingDuration ? 1 : 0;
    const duration = durationPerScene + extraDuration;

    const scene: Scene = {
      id: generateId(),
      projectId: "",
      description: description.substring(0, 200),
      duration,
      contentType: "image",
      imageUrl: undefined,
      voiceoverUrl: undefined,
      voiceoverText: "",
      order: index,
      transition: "fade",
    };
    return scene;
  });

  return scenes;
}

/**
 * Validates scene configuration for video export
 */
export function validateScenesForExport(scenes: Scene[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (scenes.length === 0) {
    errors.push("No scenes in timeline");
  }

  scenes.forEach((scene, index) => {
    if (!scene.description || scene.description.trim().length === 0) {
      errors.push(`Scene ${index + 1}: Missing description`);
    }
    if (scene.duration <= 0) {
      errors.push(`Scene ${index + 1}: Invalid duration`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculates total video duration from scenes
 */
export function calculateTotalDuration(scenes: Scene[]): number {
  return scenes.reduce((sum, scene) => sum + scene.duration, 0);
}

/**
 * Generates a mock video file for MVP
 * In production, this would use a real video composition library
 */
export async function generateMockVideo(
  scenes: Scene[],
  projectName: string
): Promise<{ success: boolean; message: string; filename: string }> {
  return new Promise((resolve) => {
    const delay = 2000 + Math.random() * 2000;

    setTimeout(() => {
      const totalDuration = calculateTotalDuration(scenes);
      const filename = `${projectName}_${Date.now()}.mp4`;

      resolve({
        success: true,
        message: `Video generated successfully! Duration: ${Math.floor(totalDuration)}s`,
        filename,
      });
    }, delay);
  });
}

/**
 * Formats video metadata for export
 */
export function generateVideoMetadata(
  projectName: string,
  scenes: Scene[],
  aspectRatio: string
) {
  return {
    title: projectName,
    duration: calculateTotalDuration(scenes),
    sceneCount: scenes.length,
    aspectRatio,
    generatedAt: new Date().toISOString(),
    scenes: scenes.map((s, i) => ({
      number: i + 1,
      description: s.description,
      duration: s.duration,
      hasImage: !!s.imageUrl,
      hasVoiceover: !!s.voiceoverUrl,
    })),
  };
}
