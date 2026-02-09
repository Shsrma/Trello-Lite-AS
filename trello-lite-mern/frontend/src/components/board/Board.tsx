// frontend/src/components/board/Board.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { taskAPI } from '../../api/task.api';
import { Task, TaskStatus } from '../../types/task';
import { TASK_STATUS } from '../../utils/constants';
import Column from './Column';
import { useDragDrop } from '../../hooks/useDragDrop';
import { useSocket } from '../../hooks/useSocket';

const Board: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleDragStart, handleDragEnd, handleDrop } = useDragDrop();
  const { socket } = useSocket();

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  useEffect(() => {
    if (socket && projectId) {
      socket.emit('join:project', projectId);

      socket.on('task:created', (task: Task) => {
        setTasks((prev) => [...prev, task]);
      });

      socket.on('task:updated', (updatedTask: Task) => {
        setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
      });

      socket.on('tasks:reordered', (reorderedTasks: Task[]) => {
        setTasks(reorderedTasks);
      });

      return () => {
        socket.emit('leave:project', projectId);
        socket.off('task:created');
        socket.off('task:updated');
        socket.off('tasks:reordered');
      };
    }
  }, [socket, projectId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTasksByProject(projectId!);
      setTasks(response.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskDrop = async (targetStatus: TaskStatus) => {
    const result = handleDrop(targetStatus);
    if (!result) return;

    const { task, targetStatus: newStatus } = result;

    const updatedTasks = tasks.map((t) =>
      t._id === task._id ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);

    try {
      await taskAPI.updateTask(task._id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task:', error);
      setTasks(tasks);
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status).sort((a, b) => a.order - b.order);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="flex gap-4 h-full overflow-x-auto p-4">
      <Column
        title="To Do"
        status={TASK_STATUS.TODO}
        tasks={getTasksByStatus(TASK_STATUS.TODO)}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrop={handleTaskDrop}
      />
      <Column
        title="In Progress"
        status={TASK_STATUS.IN_PROGRESS}
        tasks={getTasksByStatus(TASK_STATUS.IN_PROGRESS)}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrop={handleTaskDrop}
      />
      <Column
        title="Done"
        status={TASK_STATUS.DONE}
        tasks={getTasksByStatus(TASK_STATUS.DONE)}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrop={handleTaskDrop}
      />
    </div>
  );
};

export default Board;
