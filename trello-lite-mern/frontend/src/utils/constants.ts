// frontend/src/utils/constants.ts
export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
} as const;

export const TASK_STATUS_LABELS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
} as const;
