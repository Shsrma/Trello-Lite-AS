import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI } from '../api/project.api';
import { Project } from '../types/project';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import NotificationBell from '../components/notifications/NotificationBell';

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getProjects();
      setProjects(response.projects);
    } catch (error) {
      // Error handled
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await projectAPI.createProject({ name: projectName, description: projectDescription });
      setIsModalOpen(false);
      setProjectName('');
      setProjectDescription('');
      fetchProjects();
    } catch (error) {
      // Error handled
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Trello Lite</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">{user?.name}</span>
              <NotificationBell />
              <Button onClick={handleLogout} variant="secondary" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Projects</h2>
          <Button onClick={() => setIsModalOpen(true)}>Create Project</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => navigate(`/project/${project._id}`)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
              {project.description && (
                <p className="text-gray-600 text-sm mb-4">{project.description}</p>
              )}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{project.members.length} members</span>
                <span>{project.owner.name}</span>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No projects yet</p>
            <Button onClick={() => setIsModalOpen(true)}>Create Your First Project</Button>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <form onSubmit={handleCreateProject}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
