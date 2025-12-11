import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { KanbanBoard, KanbanCard, KanbanColumn, DragState } from './types';

interface KanbanStore {
  board: KanbanBoard | null;
  dragState: DragState;
  setBoard: (board: KanbanBoard) => void;
  moveCard: (cardId: string, sourceColumnId: string, targetColumnId: string, newIndex: number) => void;
  addCard: (columnId: string, card: Omit<KanbanCard, 'id' | 'order' | 'createdAt' | 'updatedAt'>) => void;
  updateCard: (cardId: string, updates: Partial<KanbanCard>) => void;
  deleteCard: (cardId: string) => void;
  addColumn: (column: Omit<KanbanColumn, 'id' | 'order' | 'cards'>) => void;
  updateColumn: (columnId: string, updates: Partial<KanbanColumn>) => void;
  deleteColumn: (columnId: string) => void;
  setDragState: (state: Partial<DragState>) => void;
  resetDragState: () => void;
}

const initialDragState: DragState = {
  isDragging: false,
  draggedCardId: null,
  sourceColumnId: null,
  targetColumnId: null,
  targetIndex: null,
};

const generateId = () => Math.random().toString(36).substring(2, 11);

export const useKanbanStore = create<KanbanStore>()(
  immer((set) => ({
    board: null,
    dragState: initialDragState,

    setBoard: (board) => set({ board }),

    moveCard: (cardId, sourceColumnId, targetColumnId, newIndex) =>
      set((state) => {
        if (!state.board) return;

        const sourceColumn = state.board.columns.find((c) => c.id === sourceColumnId);
        const targetColumn = state.board.columns.find((c) => c.id === targetColumnId);

        if (!sourceColumn || !targetColumn) return;

        const cardIndex = sourceColumn.cards.findIndex((c) => c.id === cardId);
        if (cardIndex === -1) return;

        const [card] = sourceColumn.cards.splice(cardIndex, 1);
        card.columnId = targetColumnId;
        card.updatedAt = new Date();

        targetColumn.cards.splice(newIndex, 0, card);

        // Reorder cards
        sourceColumn.cards.forEach((c, i) => (c.order = i));
        targetColumn.cards.forEach((c, i) => (c.order = i));
      }),

    addCard: (columnId, cardData) =>
      set((state) => {
        if (!state.board) return;

        const column = state.board.columns.find((c) => c.id === columnId);
        if (!column) return;

        const newCard: KanbanCard = {
          ...cardData,
          id: generateId(),
          columnId,
          order: column.cards.length,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        column.cards.push(newCard);
      }),

    updateCard: (cardId, updates) =>
      set((state) => {
        if (!state.board) return;

        for (const column of state.board.columns) {
          const card = column.cards.find((c) => c.id === cardId);
          if (card) {
            Object.assign(card, updates, { updatedAt: new Date() });
            break;
          }
        }
      }),

    deleteCard: (cardId) =>
      set((state) => {
        if (!state.board) return;

        for (const column of state.board.columns) {
          const index = column.cards.findIndex((c) => c.id === cardId);
          if (index !== -1) {
            column.cards.splice(index, 1);
            column.cards.forEach((c, i) => (c.order = i));
            break;
          }
        }
      }),

    addColumn: (columnData) =>
      set((state) => {
        if (!state.board) return;

        const newColumn: KanbanColumn = {
          ...columnData,
          id: generateId(),
          order: state.board.columns.length,
          cards: [],
        };

        state.board.columns.push(newColumn);
      }),

    updateColumn: (columnId, updates) =>
      set((state) => {
        if (!state.board) return;

        const column = state.board.columns.find((c) => c.id === columnId);
        if (column) {
          Object.assign(column, updates);
        }
      }),

    deleteColumn: (columnId) =>
      set((state) => {
        if (!state.board) return;

        const index = state.board.columns.findIndex((c) => c.id === columnId);
        if (index !== -1) {
          state.board.columns.splice(index, 1);
          state.board.columns.forEach((c, i) => (c.order = i));
        }
      }),

    setDragState: (newState) =>
      set((state) => {
        Object.assign(state.dragState, newState);
      }),

    resetDragState: () => set({ dragState: initialDragState }),
  }))
);
