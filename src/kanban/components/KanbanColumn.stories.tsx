import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { KanbanColumnComponent } from './KanbanColumn';
import { sampleUsers, sampleLabels } from '../data/sampleData';
import type { KanbanColumn, DragState, KanbanCard } from '../types';

const createCard = (
  id: string,
  title: string,
  columnId: string,
  priority: 'low' | 'medium' | 'high',
  order: number,
  options: Partial<KanbanCard> = {}
): KanbanCard => ({
  id,
  title,
  columnId,
  priority,
  order,
  labels: [],
  assignees: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...options,
});

const defaultDragState: DragState = {
  isDragging: false,
  draggedCardId: null,
  sourceColumnId: null,
  targetColumnId: null,
  targetIndex: null,
};

const sampleColumn: KanbanColumn = {
  id: 'col-1',
  title: 'To Do',
  status: 'todo',
  order: 0,
  cards: [
    createCard('card-1', 'Design homepage', 'col-1', 'high', 0, {
      labels: [sampleLabels[1]],
      assignees: [sampleUsers[0]],
    }),
    createCard('card-2', 'Setup CI/CD', 'col-1', 'medium', 1),
    createCard('card-3', 'Write documentation', 'col-1', 'low', 2),
  ],
};

const meta: Meta<typeof KanbanColumnComponent> = {
  title: 'Components/KanbanColumn',
  component: KanbanColumnComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', padding: '16px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof KanbanColumnComponent>;

// Interactive wrapper
const InteractiveColumn = ({ column: initialColumn }: { column: KanbanColumn }) => {
  const [column, setColumn] = useState(initialColumn);
  const [dragState, setDragState] = useState<DragState>(defaultDragState);

  return (
    <KanbanColumnComponent
      column={column}
      dragState={dragState}
      onDragStart={(cardId, colId) =>
        setDragState({ ...defaultDragState, isDragging: true, draggedCardId: cardId, sourceColumnId: colId })
      }
      onDragEnd={() => setDragState(defaultDragState)}
      onDragOver={(colId, index) =>
        setDragState((prev) => ({ ...prev, targetColumnId: colId, targetIndex: index }))
      }
      onCardMove={(cardId, source, target, index) => console.log('Move:', { cardId, source, target, index })}
      onCardClick={(card) => console.log('Clicked:', card)}
      onCardCreate={(colId) => {
        const newCard = createCard(`card-${Date.now()}`, 'New Task', colId, 'medium', column.cards.length);
        setColumn((prev) => ({ ...prev, cards: [...prev.cards, newCard] }));
      }}
      onColumnUpdate={(col) => setColumn(col)}
      onColumnDelete={(id) => console.log('Delete column:', id)}
    />
  );
};

/**
 * ## Default Column
 * Standard column with tasks.
 */
export const Default: Story = {
  render: () => <InteractiveColumn column={sampleColumn} />,
};

/**
 * ## Empty Column
 * Column with no tasks, showing empty state.
 */
export const Empty: Story = {
  render: () => (
    <InteractiveColumn
      column={{
        ...sampleColumn,
        cards: [],
      }}
    />
  ),
};

/**
 * ## With WIP Limit
 * Column showing Work-In-Progress limit indicator.
 */
export const WithWIPLimit: Story = {
  render: () => (
    <InteractiveColumn
      column={{
        ...sampleColumn,
        limit: 5,
      }}
    />
  ),
};

/**
 * ## At WIP Limit
 * Column at its WIP limit (warning state).
 */
export const AtWIPLimit: Story = {
  render: () => (
    <InteractiveColumn
      column={{
        ...sampleColumn,
        limit: 3,
      }}
    />
  ),
};

/**
 * ## Many Tasks (Scrollable)
 * Column with many tasks to demonstrate scrolling.
 */
export const ManyTasks: Story = {
  render: () => (
    <InteractiveColumn
      column={{
        ...sampleColumn,
        cards: Array.from({ length: 15 }, (_, i) =>
          createCard(`card-${i}`, `Task ${i + 1}`, 'col-1', ['low', 'medium', 'high'][i % 3] as 'low' | 'medium' | 'high', i, {
            assignees: i % 3 === 0 ? [sampleUsers[i % sampleUsers.length]] : [],
          })
        ),
      }}
    />
  ),
};

/**
 * ## In Progress Status
 * Column with "In Progress" status styling.
 */
export const InProgress: Story = {
  render: () => (
    <InteractiveColumn
      column={{
        ...sampleColumn,
        id: 'col-in-progress',
        title: 'In Progress',
        status: 'in-progress',
      }}
    />
  ),
};

/**
 * ## Review Status
 * Column with "Review" status styling.
 */
export const Review: Story = {
  render: () => (
    <InteractiveColumn
      column={{
        ...sampleColumn,
        id: 'col-review',
        title: 'Review',
        status: 'review',
      }}
    />
  ),
};

/**
 * ## Done Status
 * Column with "Done" status styling.
 */
export const Done: Story = {
  render: () => (
    <InteractiveColumn
      column={{
        ...sampleColumn,
        id: 'col-done',
        title: 'Done',
        status: 'done',
      }}
    />
  ),
};
