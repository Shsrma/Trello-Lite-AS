import React from 'react';
import { Task } from '../../types/task';
import { getInitials, formatDate } from '../../utils/helpers';

interface TaskCardProps {
  task: Task;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart, onDragEnd }) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-move"
    >
      <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
      {task.description && (
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      )}
      <div className="flex items-center justify-between">
        {task.assignedTo && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
              {getInitials(task.assignedTo.name)}
            </div>
            <span className="text-xs text-gray-600">{task.assignedTo.name}</span>
          </div>
        )}
        {task.dueDate && (
          <span className="text-xs text-gray-500">{formatDate(task.dueDate)}</span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
