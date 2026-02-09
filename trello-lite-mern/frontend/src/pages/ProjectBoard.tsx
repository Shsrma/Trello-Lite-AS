import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI } from '../api/project.api';
import { Project } from '../types/project';
import Board from '../components/board/Board';
import Button from '../components/common/Button';
import NotificationBell from '../components/notifications/NotificationBell';

const ProjectBoard = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await projectAPI.getProjectById(id!);
      setProject(response.project);
    } catch (error) {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate('/dashboard')} variant="secondary" size="sm">
                ← Back
              </Button>
              <h1 className="text-xl font-bold">{project.name}</h1>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 overflow-hidden">
        <Board />
      </div>
    </div>
  );
};

export default ProjectBoard;
