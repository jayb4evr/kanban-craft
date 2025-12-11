// Kanban Board Component Library
// Production-ready drag-and-drop Kanban board

// Components
export { KanbanBoard } from './components/KanbanBoard';
export { KanbanColumnComponent as KanbanColumn } from './components/KanbanColumn';
export { KanbanCardComponent as KanbanCard } from './components/KanbanCard';
export { AddCardModal } from './components/AddCardModal';

// State Management
export { useKanbanStore } from './store';

// Hooks
export { useDragAndDrop } from './hooks/useDragAndDrop';

// Utils
export * from './utils/task.utils';
export * from './utils/column.utils';

// Sample Data (for Storybook)
export * from './data/sampleData';

// Types
export type {
  KanbanBoard as KanbanBoardType,
  KanbanColumn as KanbanColumnType,
  KanbanCard as KanbanCardType,
  KanbanUser,
  KanbanLabel,
  Priority,
  ColumnStatus,
  DragState,
  KanbanBoardProps,
  KanbanColumnProps,
  KanbanCardProps,
} from './types';
