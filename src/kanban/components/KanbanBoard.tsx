import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, Search, Filter } from 'lucide-react';
import type { KanbanBoardProps, DragState, KanbanCard } from '../types';
import { KanbanColumnComponent } from './KanbanColumn';
import { useKanbanStore } from '../store';
import { cn } from '@/lib/utils';
import { AddCardModal } from './AddCardModal';

const initialDragState: DragState = {
  isDragging: false,
  draggedCardId: null,
  sourceColumnId: null,
  targetColumnId: null,
  targetIndex: null,
};

export function KanbanBoard({
  board,
  onCardMove,
  onCardClick,
  onCardCreate,
  onCardUpdate,
  onCardDelete,
  onColumnCreate,
  onColumnUpdate,
  onColumnDelete,
  className,
}: KanbanBoardProps) {
  const [dragState, setDragState] = useState<DragState>(initialDragState);
  const [searchQuery, setSearchQuery] = useState('');
  const [addCardColumnId, setAddCardColumnId] = useState<string | null>(null);

  const handleDragStart = useCallback((cardId: string, columnId: string) => {
    setDragState({
      isDragging: true,
      draggedCardId: cardId,
      sourceColumnId: columnId,
      targetColumnId: null,
      targetIndex: null,
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState(initialDragState);
  }, []);

  const handleDragOver = useCallback((columnId: string, index: number) => {
    setDragState((prev) => ({
      ...prev,
      targetColumnId: columnId,
      targetIndex: index,
    }));
  }, []);

  const handleCardMove = useCallback(
    (cardId: string, sourceColumnId: string, targetColumnId: string, newIndex: number) => {
      onCardMove?.(cardId, sourceColumnId, targetColumnId, newIndex);
      setDragState(initialDragState);
    },
    [onCardMove]
  );

  const handleCardCreate = useCallback((columnId: string) => {
    setAddCardColumnId(columnId);
  }, []);

  const handleAddCard = useCallback(
    (title: string, description: string, priority: 'low' | 'medium' | 'high') => {
      if (addCardColumnId && onCardCreate) {
        onCardCreate(addCardColumnId);
      }
      setAddCardColumnId(null);
    },
    [addCardColumnId, onCardCreate]
  );

  // Filter cards based on search
  const filteredBoard = searchQuery
    ? {
        ...board,
        columns: board.columns.map((column) => ({
          ...column,
          cards: column.cards.filter(
            (card) =>
              card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              card.description?.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        })),
      }
    : board;

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Board Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-foreground">{board.title}</h1>
          <span className="text-sm text-muted-foreground">
            {board.columns.reduce((acc, col) => acc + col.cards.length, 0)} tasks
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-64 h-9 pl-9 pr-4 rounded-lg',
                'bg-secondary border-none',
                'text-sm text-foreground placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring'
              )}
            />
          </div>

          {/* Filter Button */}
          <button
            className={cn(
              'flex items-center gap-2 h-9 px-3 rounded-lg',
              'bg-secondary text-secondary-foreground',
              'text-sm font-medium',
              'hover:bg-secondary/80 transition-colors'
            )}
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>

          {/* Add Column Button */}
          <button
            onClick={onColumnCreate}
            className={cn(
              'flex items-center gap-2 h-9 px-4 rounded-lg',
              'bg-primary text-primary-foreground',
              'text-sm font-medium',
              'hover:bg-primary/90 transition-colors'
            )}
          >
            <Plus className="w-4 h-4" />
            <span>Add Column</span>
          </button>
        </div>
      </header>

      {/* Board Content */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 bg-background">
        <div className="flex gap-4 h-full">
          <AnimatePresence mode="popLayout">
            {filteredBoard.columns.map((column) => (
              <KanbanColumnComponent
                key={column.id}
                column={column}
                onCardMove={handleCardMove}
                onCardClick={onCardClick}
                onCardCreate={handleCardCreate}
                onColumnUpdate={onColumnUpdate}
                onColumnDelete={onColumnDelete}
                dragState={dragState}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
              />
            ))}
          </AnimatePresence>

          {/* Add Column Placeholder */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onColumnCreate}
            className={cn(
              'flex flex-col items-center justify-center',
              'w-72 min-w-[288px] min-h-[200px]',
              'rounded-xl border-2 border-dashed border-border/50',
              'text-muted-foreground hover:text-foreground',
              'hover:border-border hover:bg-secondary/30',
              'transition-all duration-200'
            )}
          >
            <Plus className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Add Column</span>
          </motion.button>
        </div>
      </div>

      {/* Add Card Modal */}
      <AddCardModal
        isOpen={!!addCardColumnId}
        onClose={() => setAddCardColumnId(null)}
        onAdd={handleAddCard}
      />
    </div>
  );
}
