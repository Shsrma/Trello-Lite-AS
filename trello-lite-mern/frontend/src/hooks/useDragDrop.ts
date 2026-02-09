// frontend/src/hooks/useDragDrop.ts
import { useState } from 'react';
import { Task, TaskStatus } from '../types/task';

interface DragItem {
  task: Task;
  sourceStatus: TaskStatus;
}

export const useDragDrop = () => {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);

  const handleDragStart = (task: Task, sourceStatus: TaskStatus) => {
    setDraggedItem({ task, sourceStatus });
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = (targetStatus: TaskStatus) => {
    if (!draggedItem) return null;

    if (draggedItem.sourceStatus === targetStatus) {
      setDraggedItem(null);
      return null;
    }

    const result = {
      task: draggedItem.task,
      sourceStatus: draggedItem.sourceStatus,
      targetStatus,
    };

    setDraggedItem(null);
    return result;
  };

  return {
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleDrop,
  };
};
