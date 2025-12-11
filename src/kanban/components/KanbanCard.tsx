import { memo, useCallback, useRef } from 'react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { Calendar, MoreHorizontal } from 'lucide-react';
import type { KanbanCardProps, Priority } from '../types';
import { cn } from '@/lib/utils';

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-success/10 text-success' },
  medium: { label: 'Medium', className: 'bg-warning/10 text-warning' },
  high: { label: 'High', className: 'bg-destructive/10 text-destructive' },
};

function formatDueDate(date: Date): string {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'MMM d');
}

function getDueDateClassName(date: Date): string {
  if (isPast(date) && !isToday(date)) return 'text-destructive';
  if (isToday(date)) return 'text-warning';
  return 'text-muted-foreground';
}

export const KanbanCardComponent = memo(function KanbanCard({
  card,
  onClick,
  onDragStart,
  onDragEnd,
  isDragging,
  className,
}: KanbanCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', card.id);
      
      // Create custom drag image
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        e.dataTransfer.setDragImage(cardRef.current, rect.width / 2, 20);
      }
      
      onDragStart(card.id, card.columnId);
    },
    [card.id, card.columnId, onDragStart]
  );

  const handleDragEnd = useCallback(() => {
    onDragEnd();
  }, [onDragEnd]);

  const handleClick = useCallback(() => {
    onClick?.(card);
  }, [card, onClick]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.(card);
      }
    },
    [card, onClick]
  );

  const priorityInfo = priorityConfig[card.priority];

  return (
    <div
      ref={cardRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Task: ${card.title}`}
      className={cn(
        'group relative bg-card rounded-lg border border-border p-3 cursor-grab',
        'shadow-card hover:shadow-card-hover transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'active:cursor-grabbing',
        isDragging && 'opacity-50 shadow-card-drag ring-2 ring-primary/20 scale-[1.02]',
        className
      )}
    >
      {/* Priority & Labels Row */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span
          className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            priorityInfo.className
          )}
        >
          {priorityInfo.label}
        </span>
        {card.labels.slice(0, 2).map((label) => (
          <span
            key={label.id}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${label.color}20`, color: label.color }}
          >
            {label.name}
          </span>
        ))}
        {card.labels.length > 2 && (
          <span className="text-xs text-muted-foreground">+{card.labels.length - 2}</span>
        )}
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-card-foreground mb-2 line-clamp-2">
        {card.title}
      </h4>

      {/* Description Preview */}
      {card.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {card.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Due Date */}
          {card.dueDate && (
            <div className={cn('flex items-center gap-1 text-xs', getDueDateClassName(card.dueDate))}>
              <Calendar className="w-3 h-3" />
              <span>{formatDueDate(card.dueDate)}</span>
            </div>
          )}
        </div>

        {/* Assignees */}
        {card.assignees.length > 0 && (
          <div className="flex -space-x-2">
            {card.assignees.slice(0, 3).map((user) => (
              <div
                key={user.id}
                className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium ring-2 ring-card"
                title={user.name}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  user.initials
                )}
              </div>
            ))}
            {card.assignees.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs font-medium ring-2 ring-card">
                +{card.assignees.length - 3}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hover Menu Button */}
      <button
        className={cn(
          'absolute top-2 right-2 p-1 rounded-md',
          'opacity-0 group-hover:opacity-100 transition-opacity',
          'hover:bg-secondary text-muted-foreground hover:text-foreground'
        )}
        onClick={(e) => {
          e.stopPropagation();
          // Menu action placeholder
        }}
        aria-label="Card options"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
});
