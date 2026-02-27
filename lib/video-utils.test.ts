import { describe, it, expect } from "vitest";
import {
  segmentScriptIntoScenes,
  validateScenesForExport,
  calculateTotalDuration,
  generateMockVideo,
  generateVideoMetadata,
} from "./video-utils";
import { Scene } from "./types";

describe("Video Utils", () => {
  describe("segmentScriptIntoScenes", () => {
    it("should create empty array for empty script", () => {
      const scenes = segmentScriptIntoScenes("", 60);
      expect(scenes).toEqual([]);
    });

    it("should create scenes from script paragraphs", () => {
      const script = "First scene description.\n\nSecond scene description.\n\nThird scene description.";
      const scenes = segmentScriptIntoScenes(script, 60);
      expect(scenes.length).toBe(3);
      expect(scenes[0].description).toContain("First");
      expect(scenes[1].description).toContain("Second");
      expect(scenes[2].description).toContain("Third");
    });

    it("should distribute duration evenly across scenes", () => {
      const script = "Scene 1.\n\nScene 2.\n\nScene 3.";
      const scenes = segmentScriptIntoScenes(script, 60);
      const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
      expect(totalDuration).toBe(60);
    });

    it("should set correct scene properties", () => {
      const script = "Test scene.";
      const scenes = segmentScriptIntoScenes(script, 60);
      expect(scenes[0]).toHaveProperty("id");
      expect(scenes[0]).toHaveProperty("duration");
      expect(scenes[0]).toHaveProperty("contentType");
      expect(scenes[0].contentType).toBe("image");
      expect(scenes[0].transition).toBe("fade");
    });

    it("should limit description length", () => {
      const longText = "a".repeat(300);
      const script = longText;
      const scenes = segmentScriptIntoScenes(script, 60);
      expect(scenes[0].description.length).toBeLessThanOrEqual(200);
    });
  });

  describe("validateScenesForExport", () => {
    it("should return valid for proper scenes", () => {
      const scenes: Scene[] = [
        {
          id: "1",
          projectId: "p1",
          order: 0,
          description: "Valid scene",
          duration: 30,
          contentType: "image",
          transition: "fade",
        },
      ];
      const result = validateScenesForExport(scenes);
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it("should detect empty scenes array", () => {
      const result = validateScenesForExport([]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("No scenes in timeline");
    });

    it("should detect missing description", () => {
      const scenes: Scene[] = [
        {
          id: "1",
          projectId: "p1",
          order: 0,
          description: "",
          duration: 30,
          contentType: "image",
          transition: "fade",
        },
      ];
      const result = validateScenesForExport(scenes);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should detect invalid duration", () => {
      const scenes: Scene[] = [
        {
          id: "1",
          projectId: "p1",
          order: 0,
          description: "Scene",
          duration: 0,
          contentType: "image",
          transition: "fade",
        },
      ];
      const result = validateScenesForExport(scenes);
      expect(result.isValid).toBe(false);
    });
  });

  describe("calculateTotalDuration", () => {
    it("should return 0 for empty scenes", () => {
      expect(calculateTotalDuration([])).toBe(0);
    });

    it("should sum all scene durations", () => {
      const scenes: Scene[] = [
        {
          id: "1",
          projectId: "p1",
          order: 0,
          description: "Scene 1",
          duration: 20,
          contentType: "image",
          transition: "fade",
        },
        {
          id: "2",
          projectId: "p1",
          order: 1,
          description: "Scene 2",
          duration: 40,
          contentType: "image",
          transition: "fade",
        },
      ];
      expect(calculateTotalDuration(scenes)).toBe(60);
    });
  });

  describe("generateMockVideo", () => {
    it("should return success result", async () => {
      const scenes: Scene[] = [
        {
          id: "1",
          projectId: "p1",
          order: 0,
          description: "Test",
          duration: 60,
          contentType: "image",
          transition: "fade",
        },
      ];
      const result = await generateMockVideo(scenes, "TestProject");
      expect(result.success).toBe(true);
      expect(result.filename).toContain("TestProject");
      expect(result.message).toContain("successfully");
    });
  });

  describe("generateVideoMetadata", () => {
    it("should generate correct metadata", () => {
      const scenes: Scene[] = [
        {
          id: "1",
          projectId: "p1",
          order: 0,
          description: "Scene",
          duration: 60,
          contentType: "image",
          transition: "fade",
          imageUrl: "http://example.com/image.jpg",
          voiceoverUrl: "http://example.com/audio.mp3",
        },
      ];
      const metadata = generateVideoMetadata("TestProject", scenes, "16:9");
      expect(metadata.title).toBe("TestProject");
      expect(metadata.duration).toBe(60);
      expect(metadata.sceneCount).toBe(1);
      expect(metadata.aspectRatio).toBe("16:9");
      expect(metadata.scenes[0].hasImage).toBe(true);
      expect(metadata.scenes[0].hasVoiceover).toBe(true);
    });
  });
});
