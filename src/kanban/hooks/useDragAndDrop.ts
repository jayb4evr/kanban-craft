import { useState, useCallback } from 'react';
import type { DragState } from '../types';

const initialDragState: DragState = {
  isDragging: false,
  draggedCardId: null,
  sourceColumnId: null,
  targetColumnId: null,
  targetIndex: null,
};

/**
 * Custom hook for managing drag-and-drop state
 * Uses native HTML Drag API
 */
export const useDragAndDrop = () => {
  const [state, setState] = useState<DragState>(initialDragState);

  const handleDragStart = useCallback((cardId: string, columnId: string) => {
    setState({
      isDragging: true,
      draggedCardId: cardId,
      sourceColumnId: columnId,
      targetColumnId: null,
      targetIndex: null,
    });
  }, []);

  const handleDragOver = useCallback((targetColumnId: string, index: number) => {
    setState((prev) => ({
      ...prev,
      targetColumnId,
      targetIndex: index,
    }));
  }, []);

  const handleDragEnd = useCallback(() => {
    setState(initialDragState);
  }, []);

  const resetDragState = useCallback(() => {
    setState(initialDragState);
  }, []);

  return {
    ...state,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    resetDragState,
  };
};
