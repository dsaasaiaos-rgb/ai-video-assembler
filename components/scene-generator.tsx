import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";
import { Scene } from "@/lib/types";

interface SceneGeneratorProps {
  scene: Scene;
  onGenerateImage: (sceneId: string) => Promise<void>;
  onGenerateVoiceover: (sceneId: string, text: string) => Promise<void>;
  onClose: () => void;
}

export function SceneGenerator({
  scene,
  onGenerateImage,
  onGenerateVoiceover,
  onClose,
}: SceneGeneratorProps) {
  const colors = useColors();
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [voiceoverText, setVoiceoverText] = useState(scene.voiceoverText || "");

  const handleGenerateImage = async () => {
    try {
      setIsGeneratingImage(true);
      await onGenerateImage(scene.id);
      Alert.alert("Success", "Image generated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to generate image. Please try again.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateVoiceover = async () => {
    if (!voiceoverText.trim()) {
      Alert.alert("Error", "Please enter voiceover text");
      return;
    }
    try {
      setIsGeneratingVoice(true);
      await onGenerateVoiceover(scene.id, voiceoverText);
      Alert.alert("Success", "Voiceover generated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to generate voiceover. Please try again.");
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
          Generate Content
        </Text>
        <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
          <Ionicons name="close" size={24} color={colors.muted} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }} showsVerticalScrollIndicator={false}>
        {/* Scene Info */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 12,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>
            Scene Description
          </Text>
          <Text style={{ fontSize: 14, color: colors.foreground, lineHeight: 20 }}>
            {scene.description}
          </Text>
        </View>

        {/* Generate Image Section */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginBottom: 12 }}>
            📸 Generate Image
          </Text>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 16,
              alignItems: "center",
            }}
          >
            {scene.imageUrl ? (
              <View style={{ alignItems: "center", width: "100%" }}>
                <Ionicons name="checkmark-circle" size={40} color={colors.success} style={{ marginBottom: 8 }} />
                <Text style={{ fontSize: 12, color: colors.success, marginBottom: 12 }}>
                  Image generated
                </Text>
                <TouchableOpacity
                  onPress={handleGenerateImage}
                  disabled={isGeneratingImage}
                  style={{
                    backgroundColor: colors.primary,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 6,
                  }}
                >
                  {isGeneratingImage ? (
                    <ActivityIndicator color={colors.background} />
                  ) : (
                    <Text style={{ fontSize: 12, fontWeight: "600", color: colors.background }}>
                      Regenerate
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ alignItems: "center", width: "100%" }}>
                <Ionicons name="image-outline" size={40} color={colors.muted} style={{ marginBottom: 8 }} />
                <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 12, textAlign: "center" }}>
                  AI will generate an image based on your scene description
                </Text>
                <TouchableOpacity
                  onPress={handleGenerateImage}
                  disabled={isGeneratingImage}
                  style={{
                    backgroundColor: colors.primary,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 6,
                  }}
                >
                  {isGeneratingImage ? (
                    <ActivityIndicator color={colors.background} />
                  ) : (
                    <Text style={{ fontSize: 12, fontWeight: "600", color: colors.background }}>
                      Generate Image
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Generate Voiceover Section */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginBottom: 12 }}>
            🎤 Generate Voiceover
          </Text>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 12,
            }}
          >
            <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 8 }}>
              Voiceover Text
            </Text>
            <TextInput
              multiline
              numberOfLines={4}
              placeholder="Enter the narration or dialogue for this scene..."
              placeholderTextColor={colors.muted}
              value={voiceoverText}
              onChangeText={setVoiceoverText}
              style={{
                backgroundColor: colors.background,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: 12,
                color: colors.foreground,
                padding: 10,
                fontSize: 12,
                lineHeight: 16,
                textAlignVertical: "top",
              }}
            />
            <TouchableOpacity
              onPress={handleGenerateVoiceover}
              disabled={isGeneratingVoice}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 10,
                borderRadius: 6,
                alignItems: "center",
              }}
            >
              {isGeneratingVoice ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.background }}>
                  {scene.voiceoverUrl ? "Regenerate Voiceover" : "Generate Voiceover"}
                </Text>
              )}
            </TouchableOpacity>
            {scene.voiceoverUrl && (
              <View style={{ marginTop: 12, alignItems: "center" }}>
                <Ionicons name="checkmark-circle" size={24} color={colors.success} style={{ marginBottom: 4 }} />
                <Text style={{ fontSize: 12, color: colors.success }}>Voiceover generated</Text>
              </View>
            )}
          </View>
        </View>

        {/* Info */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 12,
          }}
        >
          <Text style={{ fontSize: 12, color: colors.muted, lineHeight: 16 }}>
            💡 The AI will generate an image and voiceover based on your scene description and the text you provide. You can regenerate either element as many times as you like.
          </Text>
        </View>
      </ScrollView>

      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <TouchableOpacity
          onPress={onClose}
          style={{
            paddingVertical: 12,
            borderRadius: 8,
            backgroundColor: colors.primary,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.background }}>
            Done
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
