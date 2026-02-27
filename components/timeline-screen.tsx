import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";
import { Project, Scene } from "@/lib/types";
import { formatDuration } from "@/lib/utils";
import { DraggableTimelineClip } from "./draggable-timeline-clip";
import { generateMockVideo, validateScenesForExport } from "@/lib/video-utils";

interface TimelineScreenProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
  onEditScene: (sceneId: string) => void;
}

export function TimelineScreen({ project, onUpdateProject, onEditScene }: TimelineScreenProps) {
  const colors = useColors();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [reorderedScenes, setReorderedScenes] = useState<Scene[]>(project.scenes);
  const [isExporting, setIsExporting] = useState(false);

  const totalDuration = reorderedScenes.reduce((sum, scene) => sum + scene.duration, 0);
  const remainingTime = project.targetDuration - totalDuration;
  const isComplete = remainingTime === 0;
  const isOvertime = remainingTime < 0;

  const handleDeleteScene = (sceneId: string) => {
    Alert.alert("Delete Scene", "Are you sure you want to delete this scene?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Delete",
        onPress: () => {
          const updatedScenes = reorderedScenes.filter((s) => s.id !== sceneId);
          setReorderedScenes(updatedScenes);
          onUpdateProject({ ...project, scenes: updatedScenes });
        },
        style: "destructive",
      },
    ]);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleMoveSceneUp = (index: number) => {
    if (index === 0) return;
    const newScenes = [...reorderedScenes];
    [newScenes[index], newScenes[index - 1]] = [newScenes[index - 1], newScenes[index]];
    setReorderedScenes(newScenes);
    onUpdateProject({ ...project, scenes: newScenes });
  };

  const handleMoveSceneDown = (index: number) => {
    if (index === reorderedScenes.length - 1) return;
    const newScenes = [...reorderedScenes];
    [newScenes[index], newScenes[index + 1]] = [newScenes[index + 1], newScenes[index]];
    setReorderedScenes(newScenes);
    onUpdateProject({ ...project, scenes: newScenes });
  };

  const handleExportVideo = async () => {
    if (reorderedScenes.length === 0) {
      Alert.alert("Error", "Add scenes to your timeline before exporting");
      return;
    }
    if (isOvertime) {
      Alert.alert("Warning", "Your video exceeds the 1-minute limit. Please trim some scenes.");
      return;
    }

    const validation = validateScenesForExport(reorderedScenes);
    if (!validation.isValid) {
      Alert.alert("Validation Error", validation.errors.join("\n"));
      return;
    }

    setIsExporting(true);

    try {
      const result = await generateMockVideo(reorderedScenes, project.name);
      if (result.success) {
        Alert.alert(
          "Success!",
          `Video generated successfully!\n\nDuration: ${Math.floor(totalDuration)}s\nClips: ${reorderedScenes.length}\n\nIn production, this would be saved to your camera roll.`,
          [{ text: "Done" }]
        );
      }
    } catch (error) {
      Alert.alert("Export Failed", "There was an error exporting your video. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Duration Summary */}
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 12,
          marginBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Text style={{ fontSize: 12, color: colors.muted }}>Total Duration</Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: isOvertime ? colors.error : colors.success,
            }}
          >
            {formatDuration(totalDuration)} / {formatDuration(project.targetDuration)}
          </Text>
        </View>
        <View
          style={{
            height: 6,
            backgroundColor: colors.border,
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${Math.min((totalDuration / project.targetDuration) * 100, 100)}%`,
              backgroundColor: isOvertime ? colors.error : isComplete ? colors.success : colors.primary,
              borderRadius: 3,
            }}
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
          <Text style={{ fontSize: 11, color: colors.muted }}>
            {isComplete
              ? "✓ Perfect timing"
              : isOvertime
                ? `⚠ ${formatDuration(Math.abs(remainingTime))} over`
                : `${formatDuration(remainingTime)} remaining`}
          </Text>
          <Text style={{ fontSize: 11, color: colors.muted }}>
            {reorderedScenes.length} clip{reorderedScenes.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {/* Timeline Clips */}
      {reorderedScenes.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 48,
          }}
        >
          <Ionicons name="film-outline" size={48} color={colors.muted} style={{ marginBottom: 12 }} />
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground, marginBottom: 8 }}>
            No Clips Yet
          </Text>
          <Text style={{ fontSize: 13, color: colors.muted, textAlign: "center" }}>
            Add scenes from the Scenes tab to build your timeline
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginBottom: 12 }}>
          {reorderedScenes.map((scene, index) => (
            <View key={scene.id} style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
              {/* Reorder Controls */}
              <View style={{ justifyContent: "center", gap: 4 }}>
                <TouchableOpacity
                  onPress={() => handleMoveSceneUp(index)}
                  disabled={index === 0}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    backgroundColor: index === 0 ? colors.border : colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="chevron-up"
                    size={18}
                    color={index === 0 ? colors.muted : colors.background}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleMoveSceneDown(index)}
                  disabled={index === reorderedScenes.length - 1}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    backgroundColor: index === reorderedScenes.length - 1 ? colors.border : colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="chevron-down"
                    size={18}
                    color={index === reorderedScenes.length - 1 ? colors.muted : colors.background}
                  />
                </TouchableOpacity>
              </View>

              {/* Draggable Clip */}
              <View style={{ flex: 1 }}>
                <DraggableTimelineClip
                  scene={scene}
                  index={index}
                  isDragging={draggedIndex === index}
                  onEdit={onEditScene}
                  onDelete={handleDeleteScene}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Action Buttons */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TouchableOpacity
          onPress={() => setIsPreviewMode(!isPreviewMode)}
          disabled={isExporting}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: isExporting ? colors.muted : colors.primary,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 6,
            opacity: isExporting ? 0.5 : 1,
          }}
        >
          <Ionicons name="play-circle-outline" size={18} color={isExporting ? colors.muted : colors.primary} />
          <Text style={{ fontSize: 14, fontWeight: "600", color: isExporting ? colors.muted : colors.primary }}>
            Preview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleExportVideo}
          disabled={reorderedScenes.length === 0 || isExporting}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 8,
            backgroundColor: reorderedScenes.length === 0 || isExporting ? colors.muted : colors.primary,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {isExporting ? (
            <ActivityIndicator color={colors.background} size="small" />
          ) : (
            <>
              <Ionicons name="download-outline" size={18} color={colors.background} />
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.background }}>
                Export
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
