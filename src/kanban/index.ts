// Kanban Board Component Library
// Production-ready, fully functional Kanban Board

export { KanbanBoard } from './components/KanbanBoard';
export { KanbanColumnComponent as KanbanColumn } from './components/KanbanColumn';
export { KanbanCardComponent as KanbanCard } from './components/KanbanCard';
export { AddCardModal } from './components/AddCardModal';

export { useKanbanStore } from './store';

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
