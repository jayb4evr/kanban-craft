/**
 * Checks if a task is overdue
 */
export const isOverdue = (dueDate: Date): boolean => {
  return new Date() > dueDate;
};

/**
 * Gets initials from a name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Calculates priority color classes
 */
export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    low: 'border-l-4 border-priority-low',
    medium: 'border-l-4 border-priority-medium',
    high: 'border-l-4 border-priority-high',
  };
  return colors[priority] || colors.medium;
};

/**
 * Reorders tasks after drag and drop within same column
 */
export const reorderTasks = <T>(
  tasks: T[],
  startIndex: number,
  endIndex: number
): T[] => {
  const result = Array.from(tasks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Moves task between columns
 */
export const moveTaskBetweenColumns = <T>(
  sourceColumn: T[],
  destColumn: T[],
  sourceIndex: number,
  destIndex: number
): { source: T[]; destination: T[] } => {
  const sourceClone = Array.from(sourceColumn);
  const destClone = Array.from(destColumn);
  const [removed] = sourceClone.splice(sourceIndex, 1);
  destClone.splice(destIndex, 0, removed);

  return {
    source: sourceClone,
    destination: destClone,
  };
};

/**
 * Format date for display
 */
export const formatDueDate = (date: Date): string => {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return `${Math.abs(days)} days overdue`;
  } else if (days === 0) {
    return 'Due today';
  } else if (days === 1) {
    return 'Due tomorrow';
  } else if (days <= 7) {
    return `Due in ${days} days`;
  } else {
    return date.toLocaleDateString();
  }
};
