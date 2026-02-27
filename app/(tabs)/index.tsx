import { ScrollView, Text, View, TouchableOpacity, FlatList, Alert, TextInput, Modal } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useProjects } from "@/lib/project-context";
import { formatDate, formatDuration } from "@/lib/utils";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function HomeScreen() {
  const { state, createProject, deleteProject } = useProjects();
  const router = useRouter();
  const colors = useColors();
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<"9:16" | "16:9">("9:16");

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      Alert.alert("Error", "Please enter a project name");
      return;
    }
    await createProject(projectName, selectedAspectRatio);
    setProjectName("");
    setShowNewProjectForm(false);
  };

  const handleDeleteProject = (projectId: string) => {
    Alert.alert("Delete Project", "Are you sure you want to delete this project?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Delete",
        onPress: async () => {
          await deleteProject(projectId);
        },
        style: "destructive",
      },
    ]);
  };

  const handleOpenProject = (projectId: string) => {
    router.push({
      pathname: "/(tabs)/project-detail",
      params: { projectId },
    });
  };

  const renderProjectCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handleOpenProject(item.id)}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
      }}
      activeOpacity={0.7}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground, marginBottom: 4 }}>
            {item.name}
          </Text>
          <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 8 }}>
            {item.aspectRatio} • {formatDate(item.updatedAt)}
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Text style={{ fontSize: 12, color: colors.muted }}>
              Scenes: {item.scenes.length}
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>
              Duration: {formatDuration(item.targetDuration)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteProject(item.id)}
          style={{ padding: 8 }}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-4">
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 32, fontWeight: "700", color: colors.foreground, marginBottom: 4 }}>
            Video Assembler
          </Text>
          <Text style={{ fontSize: 14, color: colors.muted }}>
            Create stunning 1-minute videos from AI content
          </Text>
        </View>

        {/* Projects List */}
        {state.projects.length > 0 ? (
          <FlatList
            data={state.projects}
            renderItem={renderProjectCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ marginBottom: 16 }}
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 48,
            }}
          >
            <Ionicons name="film-outline" size={64} color={colors.muted} style={{ marginBottom: 16 }} />
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground, marginBottom: 8 }}>
              No Projects Yet
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center" }}>
              Create your first video project to get started
            </Text>
          </View>
        )}

        {/* Create Project Form */}
        {showNewProjectForm && (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginBottom: 12 }}>
              New Project
            </Text>
            <TextInput
              placeholder="Project Name"
              placeholderTextColor={colors.muted}
              value={projectName}
              onChangeText={setProjectName}
              style={{
                backgroundColor: colors.background,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 12,
                paddingVertical: 10,
                marginBottom: 12,
                color: colors.foreground,
                fontSize: 14,
              }}
            />

            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground, marginBottom: 8 }}>
              Aspect Ratio
            </Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
              {(["9:16", "16:9"] as const).map((ratio) => (
                <TouchableOpacity
                  key={ratio}
                  onPress={() => setSelectedAspectRatio(ratio)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: selectedAspectRatio === ratio ? colors.primary : colors.border,
                    backgroundColor:
                      selectedAspectRatio === ratio ? colors.primary + "20" : "transparent",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color:
                        selectedAspectRatio === ratio ? colors.primary : colors.muted,
                    }}
                  >
                    {ratio}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                onPress={() => setShowNewProjectForm(false)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
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
                onPress={handleCreateProject}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 8,
                  backgroundColor: colors.primary,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.background }}>
                  Create
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Create Project Button */}
        {!showNewProjectForm && (
          <TouchableOpacity
            onPress={() => setShowNewProjectForm(true)}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Ionicons name="add" size={24} color={colors.background} />
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.background }}>
              New Project
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScreenContainer>
  );
}
