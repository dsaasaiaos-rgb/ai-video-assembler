import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";
import { Scene } from "@/lib/types";
import { formatDuration } from "@/lib/utils";

interface TimelineClipProps {
  scene: Scene;
  index: number;
  onEdit: (sceneId: string) => void;
  onDelete: (sceneId: string) => void;
}

export function TimelineClip({ scene, index, onEdit, onDelete }: TimelineClipProps) {
  const colors = useColors();
  const contentTypeIcons: Record<string, string> = {
    image: "image-outline",
    video: "film-outline",
    text: "text-outline",
    audio: "volume-high-outline",
  };

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 12,
        overflow: "hidden",
      }}
    >
      {/* Clip Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 10,
          backgroundColor: colors.primary + "15",
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.background }}>
            {index + 1}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>
            Clip {index + 1}
          </Text>
          <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>
            {formatDuration(scene.duration)}
          </Text>
        </View>
        <Ionicons
          name={(contentTypeIcons[scene.contentType] || "film-outline") as any}
          size={20}
          color={colors.primary}
          style={{ marginRight: 8 }}
        />
      </View>

      {/* Clip Content */}
      <View style={{ padding: 12 }}>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 12,
            color: colors.foreground,
            lineHeight: 16,
            marginBottom: 8,
          }}
        >
          {scene.description}
        </Text>

        {/* Content Status */}
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
          {scene.imageUrl && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.success + "20",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
              }}
            >
              <Ionicons name="checkmark-circle" size={12} color={colors.success} style={{ marginRight: 4 }} />
              <Text style={{ fontSize: 10, color: colors.success }}>Image</Text>
            </View>
          )}
          {scene.voiceoverUrl && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.success + "20",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
              }}
            >
              <Ionicons name="checkmark-circle" size={12} color={colors.success} style={{ marginRight: 4 }} />
              <Text style={{ fontSize: 10, color: colors.success }}>Voiceover</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            onPress={() => onEdit(scene.id)}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: colors.primary,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: "600", color: colors.primary }}>
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(scene.id)}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: colors.error,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: "600", color: colors.error }}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
