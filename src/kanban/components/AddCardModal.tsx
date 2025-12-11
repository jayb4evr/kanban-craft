import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Priority } from '../types';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, description: string, priority: Priority) => void;
}

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'text-success' },
  { value: 'medium', label: 'Medium', color: 'text-warning' },
  { value: 'high', label: 'High', color: 'text-destructive' },
];

export function AddCardModal({ isOpen, onClose, onAdd }: AddCardModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (title.trim()) {
        onAdd(title.trim(), description.trim(), priority);
        onClose();
      }
    },
    [title, description, priority, onAdd, onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <form
              onSubmit={handleSubmit}
              onKeyDown={handleKeyDown}
              className={cn(
                'w-[440px] bg-card rounded-xl shadow-lg',
                'border border-border overflow-hidden'
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Add New Card</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className={cn(
                    'p-1.5 rounded-md',
                    'text-muted-foreground hover:text-foreground',
                    'hover:bg-secondary transition-colors'
                  )}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                {/* Title */}
                <div>
                  <label htmlFor="card-title" className="block text-sm font-medium text-foreground mb-1.5">
                    Title <span className="text-destructive">*</span>
                  </label>
                  <input
                    ref={titleRef}
                    id="card-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title"
                    className={cn(
                      'w-full h-10 px-3 rounded-lg',
                      'bg-secondary border-none',
                      'text-sm text-foreground placeholder:text-muted-foreground',
                      'focus:outline-none focus:ring-2 focus:ring-ring'
                    )}
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="card-description" className="block text-sm font-medium text-foreground mb-1.5">
                    Description
                  </label>
                  <textarea
                    id="card-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description..."
                    rows={3}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg resize-none',
                      'bg-secondary border-none',
                      'text-sm text-foreground placeholder:text-muted-foreground',
                      'focus:outline-none focus:ring-2 focus:ring-ring'
                    )}
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Priority
                  </label>
                  <div className="flex gap-2">
                    {priorities.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setPriority(p.value)}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-lg',
                          'text-sm font-medium transition-all',
                          priority === p.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        )}
                      >
                        <Flag className={cn('w-4 h-4', priority !== p.value && p.color)} />
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border bg-secondary/30">
                <button
                  type="button"
                  onClick={onClose}
                  className={cn(
                    'h-9 px-4 rounded-lg',
                    'text-sm font-medium',
                    'bg-secondary text-secondary-foreground',
                    'hover:bg-secondary/80 transition-colors'
                  )}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className={cn(
                    'h-9 px-4 rounded-lg',
                    'text-sm font-medium',
                    'bg-primary text-primary-foreground',
                    'hover:bg-primary/90 transition-colors',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  Add Card
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
