import type { KanbanColumn } from '../types';

/**
 * Reorders columns
 */
export const reorderColumns = (
  columns: KanbanColumn[],
  startIndex: number,
  endIndex: number
): KanbanColumn[] => {
  const result = Array.from(columns);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result.map((col, index) => ({ ...col, order: index }));
};

/**
 * Check if column is at WIP limit
 */
export const isAtWIPLimit = (column: KanbanColumn): boolean => {
  if (!column.limit) return false;
  return column.cards.length >= column.limit;
};

/**
 * Check if column is over WIP limit
 */
export const isOverWIPLimit = (column: KanbanColumn): boolean => {
  if (!column.limit) return false;
  return column.cards.length > column.limit;
};

/**
 * Get column status color
 */
export const getColumnStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    todo: 'bg-kanban-todo',
    'in-progress': 'bg-kanban-progress',
    review: 'bg-kanban-review',
    done: 'bg-kanban-done',
  };
  return colors[status] || colors.todo;
};
