// frontend/src/context/ProjectContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import { Project } from '../types/project';

interface ProjectContextType {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  return (
    <ProjectContext.Provider value={{ currentProject, setCurrentProject }}>
      {children}
    </ProjectContext.Provider>
  );
};
