import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";
import { Scene } from "@/lib/types";
import { formatDuration } from "@/lib/utils";
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import Animated from "react-native-reanimated";

interface DraggableTimelineClipProps {
  scene: Scene;
  index: number;
  isDragging: boolean;
  onEdit: (sceneId: string) => void;
  onDelete: (sceneId: string) => void;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
}

export function DraggableTimelineClip({
  scene,
  index,
  isDragging,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
}: DraggableTimelineClipProps) {
  const colors = useColors();
  const [isPressed, setIsPressed] = useState(false);
  const scaleValue = useSharedValue(1);

  const contentTypeIcons: Record<string, string> = {
    image: "image-outline",
    video: "film-outline",
    text: "text-outline",
    audio: "volume-high-outline",
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const handlePressIn = () => {
    setIsPressed(true);
    scaleValue.value = withSpring(0.98);
    onDragStart(index);
  };

  const handlePressOut = () => {
    setIsPressed(false);
    scaleValue.value = withSpring(1);
    onDragEnd();
  };

  return (
    <Animated.View style={[animatedStyle, { marginBottom: 12 }]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        <View
          style={{
            backgroundColor: isDragging ? colors.primary + "20" : colors.surface,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: isDragging ? colors.primary : colors.border,
            overflow: "hidden",
            opacity: isDragging ? 0.8 : 1,
          }}
        >
          {/* Drag Handle */}
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
                width: 24,
                height: 24,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 8,
              }}
            >
              <Ionicons name="reorder-three" size={20} color={colors.primary} />
            </View>
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
      </TouchableOpacity>
    </Animated.View>
  );
}
