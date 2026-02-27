import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";

interface ScriptEditorProps {
  initialScript: string;
  onSave: (script: string) => void;
  onCancel: () => void;
}

export function ScriptEditor({ initialScript, onSave, onCancel }: ScriptEditorProps) {
  const [script, setScript] = useState(initialScript);
  const colors = useColors();
  const wordCount = script.trim().split(/\s+/).filter((w) => w.length > 0).length;
  const estimatedReadTime = Math.ceil(wordCount / 150); // ~150 words per minute

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
          Edit Script
        </Text>
        <TouchableOpacity onPress={onCancel} style={{ padding: 8 }}>
          <Ionicons name="close" size={24} color={colors.muted} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }} showsVerticalScrollIndicator={false}>
        <TextInput
          multiline
          numberOfLines={12}
          placeholder="Write your video script here. Describe each scene, dialogue, and key moments..."
          placeholderTextColor={colors.muted}
          value={script}
          onChangeText={setScript}
          style={{
            backgroundColor: colors.surface,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 12,
            color: colors.foreground,
            fontSize: 14,
            lineHeight: 20,
            textAlignVertical: "top",
            marginBottom: 16,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            gap: 16,
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: colors.surface,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 16,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>
              Words
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
              {wordCount}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>
              Est. Read Time
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
              {estimatedReadTime}m
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>
              Characters
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
              {script.length}
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 12, lineHeight: 16 }}>
          💡 Tip: Write your script as a sequence of scenes. Each scene should describe what happens, who speaks, and any key visuals. The app will help you break this into individual video clips.
        </Text>
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          gap: 8,
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <TouchableOpacity
          onPress={onCancel}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSave(script)}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 8,
            backgroundColor: colors.primary,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.background }}>
            Save Script
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
