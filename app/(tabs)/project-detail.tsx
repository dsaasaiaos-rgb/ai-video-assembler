import { View, Text, TouchableOpacity, ScrollView, Alert, Modal } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useProjects } from "@/lib/project-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { formatDuration } from "@/lib/utils";
import { ScriptEditor } from "@/components/script-editor";
import { SceneGenerator } from "@/components/scene-generator";
import { TimelineScreen } from "@/components/timeline-screen";

export default function ProjectDetailScreen() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { state, updateProject } = useProjects();
  const router = useRouter();
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<"script" | "scenes" | "timeline">("script");
  const [showScriptEditor, setShowScriptEditor] = useState(false);
  const [selectedSceneForGeneration, setSelectedSceneForGeneration] = useState<string | null>(null);

  const project = state.projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <ScreenContainer className="p-4">
        <Text style={{ color: colors.foreground, fontSize: 16 }}>Project not found</Text>
      </ScreenContainer>
    );
  }

  const handleUpdateScript = (newScript: string) => {
    updateProject({ ...project, script: newScript });
    setShowScriptEditor(false);
  };

  const handleGenerateImageForScene = async (sceneId: string) => {
    // TODO: Integrate with AI backend for image generation
    console.log("Generating image for scene:", sceneId);
  };

  const handleGenerateVoiceoverForScene = async (sceneId: string, text: string) => {
    // TODO: Integrate with AI backend for voiceover generation
    console.log("Generating voiceover for scene:", sceneId, text);
  };

  const selectedScene = project.scenes.find((s) => s.id === selectedSceneForGeneration);

  return (
    <ScreenContainer className="p-4">
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground }}>
              {project.name}
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
              {project.aspectRatio} • {formatDuration(project.targetDuration)}
            </Text>
          </View>
          <TouchableOpacity style={{ padding: 8 }}>
            <Ionicons name="ellipsis-vertical" size={24} color={colors.muted} />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View
          style={{
            flexDirection: "row",
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            marginBottom: 16,
          }}
        >
          {(["script", "scenes", "timeline"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderBottomWidth: activeTab === tab ? 2 : 0,
                borderBottomColor: colors.primary,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: activeTab === tab ? "600" : "400",
                  color: activeTab === tab ? colors.primary : colors.muted,
                  textTransform: "capitalize",
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        {activeTab === "script" && (
          <ScrollView style={{ flex: 1, marginBottom: 16 }} showsVerticalScrollIndicator={false}>
            <View>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginBottom: 12 }}>
                Video Script
              </Text>
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: 12,
                  minHeight: 200,
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    color: project.script ? colors.foreground : colors.muted,
                    fontSize: 14,
                    lineHeight: 20,
                  }}
                >
                  {project.script || "No script yet. Start writing your video script here..."}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowScriptEditor(true)}
                style={{
                  paddingVertical: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.primary,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.primary }}>
                  {project.script ? "Edit Script" : "Write Script"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {activeTab === "scenes" && (
          <ScrollView style={{ flex: 1, marginBottom: 16 }} showsVerticalScrollIndicator={false}>
            <View>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginBottom: 12 }}>
                Scenes ({project.scenes.length})
              </Text>
              {project.scenes.length === 0 ? (
                <View
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: colors.border,
                    padding: 24,
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="film-outline" size={40} color={colors.muted} style={{ marginBottom: 12 }} />
                  <Text style={{ color: colors.muted, fontSize: 14 }}>
                    No scenes yet. Write a script first.
                  </Text>
                </View>
              ) : (
                project.scenes.map((scene, idx) => (
                  <TouchableOpacity
                    key={scene.id}
                    onPress={() => setSelectedSceneForGeneration(scene.id)}
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: colors.border,
                      padding: 12,
                      marginBottom: 8,
                    }}
                  >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 12, fontWeight: "600", color: colors.primary, marginBottom: 4 }}>
                          Scene {idx + 1}
                        </Text>
                        <Text style={{ fontSize: 14, color: colors.foreground, marginBottom: 4 }}>
                          {scene.description}
                        </Text>
                        <Text style={{ fontSize: 12, color: colors.muted }}>
                          Duration: {formatDuration(scene.duration)}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={colors.muted} style={{ marginLeft: 8 }} />
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </ScrollView>
        )}

        {activeTab === "timeline" && (
          <View style={{ flex: 1, marginBottom: 16 }}>
            <TimelineScreen
              project={project}
              onUpdateProject={updateProject}
              onEditScene={(sceneId) => setSelectedSceneForGeneration(sceneId)}
            />
          </View>
        )}

        {/* Modals */}
        <Modal visible={showScriptEditor} animationType="slide">
          <ScriptEditor
            initialScript={project.script}
            onSave={handleUpdateScript}
            onCancel={() => setShowScriptEditor(false)}
          />
        </Modal>

        {selectedScene && (
          <Modal visible={!!selectedSceneForGeneration} animationType="slide">
            <SceneGenerator
              scene={selectedScene}
              onGenerateImage={handleGenerateImageForScene}
              onGenerateVoiceover={handleGenerateVoiceoverForScene}
              onClose={() => setSelectedSceneForGeneration(null)}
            />
          </Modal>
        )}
      </View>
    </ScreenContainer>
  );
}
