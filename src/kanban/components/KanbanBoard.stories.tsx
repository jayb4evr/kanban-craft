import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { KanbanBoard } from './KanbanBoard';
import {
  defaultBoard,
  emptyBoard,
  largeDatasetBoard,
  priorityShowcaseBoard,
} from '../data/sampleData';
import type { KanbanBoard as KanbanBoardType, KanbanCard, KanbanColumn } from '../types';

const meta: Meta<typeof KanbanBoard> = {
  title: 'Components/KanbanBoard',
  component: KanbanBoard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Kanban Board Component

A fully functional drag-and-drop Kanban board built with:
- **Native HTML Drag API** for drag-and-drop
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Framer Motion** for animations

## Features
- Drag-and-drop cards between columns
- Search and filter tasks
- Add new columns and cards
- Priority indicators
- Due date badges
- Assignee avatars
- Responsive design

## Keyboard Navigation
- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and links
- **Escape**: Close modals
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', width: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof KanbanBoard>;

// Interactive wrapper for stateful stories
const InteractiveBoard = ({ initialBoard }: { initialBoard: KanbanBoardType }) => {
  const [board, setBoard] = useState<KanbanBoardType>(initialBoard);

  const handleCardMove = (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string,
    newIndex: number
  ) => {
    setBoard((prev) => {
      const newColumns = prev.columns.map((col) => ({
        ...col,
        cards: [...col.cards],
      }));

      const sourceCol = newColumns.find((c) => c.id === sourceColumnId);
      const targetCol = newColumns.find((c) => c.id === targetColumnId);

      if (!sourceCol || !targetCol) return prev;

      const cardIndex = sourceCol.cards.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return prev;

      const [card] = sourceCol.cards.splice(cardIndex, 1);
      card.columnId = targetColumnId;
      targetCol.cards.splice(newIndex, 0, card);

      return { ...prev, columns: newColumns };
    });
  };

  const handleColumnCreate = () => {
    const newColumn: KanbanColumn = {
      id: `col-${Date.now()}`,
      title: 'New Column',
      status: 'todo',
      cards: [],
      order: board.columns.length,
    };
    setBoard((prev) => ({
      ...prev,
      columns: [...prev.columns, newColumn],
    }));
  };

  const handleCardCreate = (columnId: string) => {
    const newCard: KanbanCard = {
      id: `card-${Date.now()}`,
      title: 'New Task',
      columnId,
      priority: 'medium',
      labels: [],
      assignees: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      order: board.columns.find((c) => c.id === columnId)?.cards.length || 0,
    };
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
      ),
    }));
  };

  return (
    <KanbanBoard
      board={board}
      onCardMove={handleCardMove}
      onColumnCreate={handleColumnCreate}
      onCardCreate={handleCardCreate}
      onCardClick={(card) => console.log('Card clicked:', card)}
      onCardUpdate={(card) => console.log('Card updated:', card)}
      onCardDelete={(id) => console.log('Card deleted:', id)}
      onColumnUpdate={(col) => console.log('Column updated:', col)}
      onColumnDelete={(id) => console.log('Column deleted:', id)}
    />
  );
};

/**
 * ## Default Board
 * 
 * Standard Kanban board with 4 columns and sample tasks.
 * Demonstrates core functionality including:
 * - Task cards with priority indicators
 * - Assignee avatars
 * - Due date badges
 * - Labels/tags
 */
export const Default: Story = {
  render: () => <InteractiveBoard initialBoard={defaultBoard} />,
};

/**
 * ## Empty State
 * 
 * Board with no tasks in any column.
 * Shows empty state messaging and the ability to add new tasks.
 */
export const EmptyState: Story = {
  render: () => <InteractiveBoard initialBoard={emptyBoard} />,
};

/**
 * ## Large Dataset (40+ Tasks)
 * 
 * Stress test with 40 tasks across 4 columns.
 * Demonstrates performance with large datasets.
 */
export const LargeDataset: Story = {
  render: () => <InteractiveBoard initialBoard={largeDatasetBoard} />,
};

/**
 * ## Priority Levels Showcase
 * 
 * Demonstrates different priority levels:
 * - **Low**: Blue indicator
 * - **Medium**: Yellow indicator  
 * - **High**: Red indicator
 * 
 * Also shows overdue date styling.
 */
export const DifferentPriorities: Story = {
  render: () => <InteractiveBoard initialBoard={priorityShowcaseBoard} />,
};

/**
 * ## Interactive Demo
 * 
 * Fully functional drag-and-drop demonstration.
 * 
 * **Try these interactions:**
 * 1. Drag a card from one column to another
 * 2. Use the search bar to filter tasks
 * 3. Click "Add Column" to create new columns
 * 4. Click "+" on a column to add new cards
 */
export const InteractiveDemo: Story = {
  render: () => <InteractiveBoard initialBoard={defaultBoard} />,
  parameters: {
    docs: {
      description: {
        story: `
### Drag and Drop Instructions

1. **Start drag**: Click and hold on any card
2. **Dragging**: Move the card over columns - valid drop targets highlight
3. **Drop**: Release to place the card in the new position
4. **Cancel**: Press Escape or drop outside valid areas

### Search
Type in the search bar to filter tasks by title or description.
        `,
      },
    },
  },
};

/**
 * ## Mobile View
 * 
 * Responsive layout optimized for mobile devices.
 * Use the viewport controls to switch between device sizes.
 */
export const MobileView: Story = {
  render: () => <InteractiveBoard initialBoard={defaultBoard} />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
};

/**
 * ## Tablet View
 * 
 * Responsive layout for tablet devices.
 */
export const TabletView: Story = {
  render: () => <InteractiveBoard initialBoard={defaultBoard} />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

/**
 * ## Accessibility Demo
 * 
 * Demonstrates keyboard navigation and accessibility features.
 * 
 * ### Keyboard Controls:
 * - **Tab**: Navigate between interactive elements
 * - **Shift+Tab**: Navigate backwards
 * - **Enter/Space**: Activate focused element
 * - **Escape**: Close modals
 * 
 * ### ARIA Features:
 * - Proper ARIA labels on all interactive elements
 * - Focus indicators visible on all controls
 * - Semantic HTML structure
 */
export const Accessibility: Story = {
  render: () => <InteractiveBoard initialBoard={defaultBoard} />,
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'keyboard', enabled: true },
        ],
      },
    },
  },
};
