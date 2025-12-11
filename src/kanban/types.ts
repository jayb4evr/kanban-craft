// Kanban Board Type Definitions

export type Priority = 'low' | 'medium' | 'high';
export type ColumnStatus = 'todo' | 'in-progress' | 'review' | 'done';

export interface KanbanUser {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
}

export interface KanbanLabel {
  id: string;
  name: string;
  color: string;
}

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  priority: Priority;
  labels: KanbanLabel[];
  assignees: KanbanUser[];
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  order: number;
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: ColumnStatus;
  cards: KanbanCard[];
  order: number;
  limit?: number;
}

export interface KanbanBoard {
  id: string;
  title: string;
  columns: KanbanColumn[];
}

export interface DragState {
  isDragging: boolean;
  draggedCardId: string | null;
  sourceColumnId: string | null;
  targetColumnId: string | null;
  targetIndex: number | null;
}

export interface KanbanBoardProps {
  board: KanbanBoard;
  onCardMove?: (cardId: string, sourceColumnId: string, targetColumnId: string, newIndex: number) => void;
  onCardClick?: (card: KanbanCard) => void;
  onCardCreate?: (columnId: string) => void;
  onCardUpdate?: (card: KanbanCard) => void;
  onCardDelete?: (cardId: string) => void;
  onColumnCreate?: () => void;
  onColumnUpdate?: (column: KanbanColumn) => void;
  onColumnDelete?: (columnId: string) => void;
  className?: string;
}

export interface KanbanColumnProps {
  column: KanbanColumn;
  onCardMove?: (cardId: string, sourceColumnId: string, targetColumnId: string, newIndex: number) => void;
  onCardClick?: (card: KanbanCard) => void;
  onCardCreate?: (columnId: string) => void;
  onColumnUpdate?: (column: KanbanColumn) => void;
  onColumnDelete?: (columnId: string) => void;
  dragState: DragState;
  onDragStart: (cardId: string, columnId: string) => void;
  onDragEnd: () => void;
  onDragOver: (columnId: string, index: number) => void;
  className?: string;
}

export interface KanbanCardProps {
  card: KanbanCard;
  onClick?: (card: KanbanCard) => void;
  onDragStart: (cardId: string, columnId: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  className?: string;
}
