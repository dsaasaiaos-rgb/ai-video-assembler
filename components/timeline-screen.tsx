import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, FlatList } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";
import { Project, Scene } from "@/lib/types";
import { formatDuration } from "@/lib/utils";
import { TimelineClip } from "./timeline-clip";

interface TimelineScreenProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
  onEditScene: (sceneId: string) => void;
}

export function TimelineScreen({ project, onUpdateProject, onEditScene }: TimelineScreenProps) {
  const colors = useColors();
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const totalDuration = project.scenes.reduce((sum, scene) => sum + scene.duration, 0);
  const remainingTime = project.targetDuration - totalDuration;
  const isComplete = remainingTime === 0;
  const isOvertime = remainingTime < 0;

  const handleDeleteScene = (sceneId: string) => {
    Alert.alert("Delete Scene", "Are you sure you want to delete this scene?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Delete",
        onPress: () => {
          const updatedScenes = project.scenes.filter((s) => s.id !== sceneId);
          onUpdateProject({ ...project, scenes: updatedScenes });
        },
        style: "destructive",
      },
    ]);
  };

  const handleExportVideo = () => {
    if (project.scenes.length === 0) {
      Alert.alert("Error", "Add scenes to your timeline before exporting");
      return;
    }
    if (isOvertime) {
      Alert.alert("Warning", "Your video exceeds the 1-minute limit. Please trim some scenes.");
      return;
    }
    Alert.alert("Export", "Video export feature coming soon!");
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
            {project.scenes.length} clip{project.scenes.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {/* Timeline Clips */}
      {project.scenes.length === 0 ? (
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
        <FlatList
          data={project.scenes}
          renderItem={({ item, index }) => (
            <TimelineClip
              scene={item}
              index={index}
              onEdit={onEditScene}
              onDelete={handleDeleteScene}
            />
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={{ marginBottom: 12 }}
        />
      )}

      {/* Action Buttons */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TouchableOpacity
          onPress={() => setIsPreviewMode(!isPreviewMode)}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.primary,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Ionicons name="play-circle-outline" size={18} color={colors.primary} />
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.primary }}>
            Preview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleExportVideo}
          disabled={project.scenes.length === 0}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 8,
            backgroundColor: project.scenes.length === 0 ? colors.muted : colors.primary,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Ionicons
            name="download-outline"
            size={18}
            color={colors.background}
          />
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.background }}>
            Export
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
