// frontend/src/components/board/Column.tsx
import React from 'react';
import { Task, TaskStatus } from '../../types/task';
import TaskCard from './TaskCard';

interface ColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onDragStart: (task: Task, status: TaskStatus) => void;
  onDragEnd: () => void;
  onDrop: (status: TaskStatus) => void;
}

const Column: React.FC<ColumnProps> = ({ title, status, tasks, onDragStart, onDragEnd, onDrop }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(status);
  };

  return (
    <div className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <span className="bg-gray-300 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div
        className="space-y-3 min-h-[200px]"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onDragStart={() => onDragStart(task, status)}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
