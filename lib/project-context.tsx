import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Project, AppState } from "./types";
import { generateId } from "./utils";

type Action =
  | { type: "SET_PROJECTS"; payload: Project[] }
  | { type: "ADD_PROJECT"; payload: Project }
  | { type: "UPDATE_PROJECT"; payload: Project }
  | { type: "DELETE_PROJECT"; payload: string }
  | { type: "SET_CURRENT_PROJECT"; payload: string | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: AppState = {
  projects: [],
  currentProjectId: null,
  isLoading: true,
  error: null,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_PROJECTS":
      return { ...state, projects: action.payload, isLoading: false };
    case "ADD_PROJECT":
      return { ...state, projects: [action.payload, ...state.projects] };
    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case "DELETE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.payload),
        currentProjectId:
          state.currentProjectId === action.payload
            ? null
            : state.currentProjectId,
      };
    case "SET_CURRENT_PROJECT":
      return { ...state, currentProjectId: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

interface ProjectContextType {
  state: AppState;
  createProject: (name: string, aspectRatio: "9:16" | "16:9") => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  loadProjects: () => Promise<void>;
  setCurrentProject: (projectId: string | null) => void;
  getCurrentProject: () => Project | null;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load projects from AsyncStorage on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const stored = await AsyncStorage.getItem("projects");
      const projects = stored ? JSON.parse(stored) : [];
      dispatch({ type: "SET_PROJECTS", payload: projects });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to load projects",
      });
    }
  };

  const saveProjects = async (projects: Project[]) => {
    try {
      await AsyncStorage.setItem("projects", JSON.stringify(projects));
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to save projects",
      });
    }
  };

  const createProject = async (name: string, aspectRatio: "9:16" | "16:9") => {
    const newProject: Project = {
      id: generateId(),
      name,
      aspectRatio,
      targetDuration: 60,
      visualStyle: "cinematic",
      script: "",
      scenes: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    dispatch({ type: "ADD_PROJECT", payload: newProject });
    await saveProjects([newProject, ...state.projects]);
  };

  const updateProject = async (project: Project) => {
    const updated = { ...project, updatedAt: Date.now() };
    dispatch({ type: "UPDATE_PROJECT", payload: updated });
    const updatedProjects = state.projects.map((p) =>
      p.id === updated.id ? updated : p
    );
    await saveProjects(updatedProjects);
  };

  const deleteProject = async (projectId: string) => {
    dispatch({ type: "DELETE_PROJECT", payload: projectId });
    const filtered = state.projects.filter((p) => p.id !== projectId);
    await saveProjects(filtered);
  };

  const setCurrentProject = (projectId: string | null) => {
    dispatch({ type: "SET_CURRENT_PROJECT", payload: projectId });
  };

  const getCurrentProject = () => {
    return (
      state.projects.find((p) => p.id === state.currentProjectId) || null
    );
  };

  return (
    <ProjectContext.Provider
      value={{
        state,
        createProject,
        updateProject,
        deleteProject,
        loadProjects,
        setCurrentProject,
        getCurrentProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within ProjectProvider");
  }
  return context;
}
