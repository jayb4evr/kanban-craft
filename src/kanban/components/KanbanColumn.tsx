import { memo, useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreHorizontal, GripVertical } from 'lucide-react';
import type { KanbanColumnProps, ColumnStatus } from '../types';
import { KanbanCardComponent } from './KanbanCard';
import { cn } from '@/lib/utils';

const columnStatusConfig: Record<ColumnStatus, { bg: string; accent: string }> = {
  'todo': { bg: 'bg-column-todo', accent: 'bg-muted-foreground' },
  'in-progress': { bg: 'bg-column-progress', accent: 'bg-primary' },
  'review': { bg: 'bg-column-review', accent: 'bg-accent' },
  'done': { bg: 'bg-column-done', accent: 'bg-success' },
};

export const KanbanColumnComponent = memo(function KanbanColumn({
  column,
  onCardMove,
  onCardClick,
  onCardCreate,
  onColumnUpdate,
  onColumnDelete,
  dragState,
  onDragStart,
  onDragEnd,
  onDragOver,
  className,
}: KanbanColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [dropIndicatorIndex, setDropIndicatorIndex] = useState<number | null>(null);

  const config = columnStatusConfig[column.status] || columnStatusConfig['todo'];
  const isOverLimit = column.limit && column.cards.length >= column.limit;

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';

      if (!columnRef.current) return;

      const columnRect = columnRef.current.getBoundingClientRect();
      const cardsContainer = columnRef.current.querySelector('[data-cards-container]');
      
      if (!cardsContainer) {
        setDropIndicatorIndex(0);
        onDragOver(column.id, 0);
        return;
      }

      const cards = Array.from(cardsContainer.children) as HTMLElement[];
      let insertIndex = cards.length;

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const rect = card.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;

        if (e.clientY < midY) {
          insertIndex = i;
          break;
        }
      }

      setDropIndicatorIndex(insertIndex);
      onDragOver(column.id, insertIndex);
    },
    [column.id, onDragOver]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!columnRef.current?.contains(e.relatedTarget as Node)) {
      setDropIndicatorIndex(null);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDropIndicatorIndex(null);

      const cardId = e.dataTransfer.getData('text/plain');
      if (!cardId || !dragState.sourceColumnId) return;

      const targetIndex = dragState.targetIndex ?? column.cards.length;
      onCardMove?.(cardId, dragState.sourceColumnId, column.id, targetIndex);
    },
    [column.id, column.cards.length, dragState, onCardMove]
  );

  const handleTitleSubmit = useCallback(() => {
    if (editTitle.trim() && editTitle !== column.title) {
      onColumnUpdate?.({ ...column, title: editTitle.trim() });
    } else {
      setEditTitle(column.title);
    }
    setIsEditing(false);
  }, [editTitle, column, onColumnUpdate]);

  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleTitleSubmit();
      } else if (e.key === 'Escape') {
        setEditTitle(column.title);
        setIsEditing(false);
      }
    },
    [handleTitleSubmit, column.title]
  );

  return (
    <motion.div
      ref={columnRef}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col w-72 min-w-[288px] rounded-xl',
        config.bg,
        'transition-colors duration-200',
        dragState.targetColumnId === column.id && 'ring-2 ring-primary/30',
        className
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-3 pb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Status Indicator */}
          <div className={cn('w-2 h-2 rounded-full shrink-0', config.accent)} />

          {/* Title */}
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              className={cn(
                'flex-1 min-w-0 bg-transparent border-none outline-none',
                'text-sm font-semibold text-foreground',
                'focus:ring-0'
              )}
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 min-w-0 text-left"
            >
              <h3 className="text-sm font-semibold text-foreground truncate">
                {column.title}
              </h3>
            </button>
          )}

          {/* Card Count */}
          <span
            className={cn(
              'text-xs font-medium px-1.5 py-0.5 rounded-md shrink-0',
              isOverLimit ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-muted-foreground'
            )}
          >
            {column.cards.length}
            {column.limit && `/${column.limit}`}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onCardCreate?.(column.id)}
            disabled={isOverLimit}
            className={cn(
              'p-1 rounded-md transition-colors',
              'hover:bg-secondary text-muted-foreground hover:text-foreground',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            aria-label={`Add card to ${column.title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            className={cn(
              'p-1 rounded-md transition-colors',
              'hover:bg-secondary text-muted-foreground hover:text-foreground'
            )}
            aria-label="Column options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards Container */}
      <div
        data-cards-container
        className={cn(
          'flex-1 flex flex-col gap-2 p-2 pt-0 overflow-y-auto kanban-scrollbar',
          'min-h-[200px]'
        )}
      >
        <AnimatePresence mode="popLayout">
          {column.cards.map((card, index) => (
            <div key={card.id} className="relative">
              {/* Drop Indicator Before */}
              {dropIndicatorIndex === index && dragState.isDragging && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0 }}
                  className="h-1 bg-primary rounded-full mb-2 origin-top"
                />
              )}
              <KanbanCardComponent
                card={card}
                onClick={onCardClick}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                isDragging={dragState.draggedCardId === card.id}
              />
            </div>
          ))}
          {/* Drop Indicator at End */}
          {dropIndicatorIndex === column.cards.length && dragState.isDragging && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              className="h-1 bg-primary rounded-full origin-top"
            />
          )}
        </AnimatePresence>

        {/* Empty State */}
        {column.cards.length === 0 && !dragState.isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex items-center justify-center"
          >
            <p className="text-sm text-muted-foreground/60">No cards yet</p>
          </motion.div>
        )}
      </div>

      {/* Quick Add Card */}
      <div className="p-2 pt-0">
        <button
          onClick={() => onCardCreate?.(column.id)}
          disabled={isOverLimit}
          className={cn(
            'w-full flex items-center justify-center gap-2 p-2 rounded-lg',
            'border border-dashed border-border/50',
            'text-sm text-muted-foreground',
            'hover:border-border hover:bg-card/50 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <Plus className="w-4 h-4" />
          <span>Add card</span>
        </button>
      </div>
    </motion.div>
  );
});
