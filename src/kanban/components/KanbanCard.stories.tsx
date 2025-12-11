import type { Meta, StoryObj } from '@storybook/react';
import { KanbanCardComponent } from './KanbanCard';
import { sampleUsers, sampleLabels } from '../data/sampleData';
import type { KanbanCard } from '../types';

const baseCard: KanbanCard = {
  id: 'card-1',
  title: 'Sample Task Card',
  description: 'This is a sample task description',
  columnId: 'col-1',
  priority: 'medium',
  labels: [],
  assignees: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  order: 0,
};

const meta: Meta<typeof KanbanCardComponent> = {
  title: 'Components/KanbanCard',
  component: KanbanCardComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '280px', padding: '16px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    isDragging: {
      control: 'boolean',
      description: 'Whether the card is currently being dragged',
    },
    card: {
      control: 'object',
      description: 'The card data object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof KanbanCardComponent>;

/**
 * ## Default Card
 * Basic task card with title and description.
 */
export const Default: Story = {
  args: {
    card: baseCard,
    isDragging: false,
    onDragStart: () => {},
    onDragEnd: () => {},
    onClick: () => console.log('Card clicked'),
  },
};

/**
 * ## Low Priority
 * Card with low priority indicator (blue).
 */
export const LowPriority: Story = {
  args: {
    card: { ...baseCard, priority: 'low', title: 'Low Priority Task' },
    isDragging: false,
    onDragStart: () => {},
    onDragEnd: () => {},
  },
};

/**
 * ## Medium Priority
 * Card with medium priority indicator (yellow).
 */
export const MediumPriority: Story = {
  args: {
    card: { ...baseCard, priority: 'medium', title: 'Medium Priority Task' },
    isDragging: false,
    onDragStart: () => {},
    onDragEnd: () => {},
  },
};

/**
 * ## High Priority
 * Card with high priority indicator (red).
 */
export const HighPriority: Story = {
  args: {
    card: { ...baseCard, priority: 'high', title: 'High Priority Task' },
    isDragging: false,
    onDragStart: () => {},
    onDragEnd: () => {},
  },
};

/**
 * ## With Labels
 * Card displaying multiple labels/tags.
 */
export const WithLabels: Story = {
  args: {
    card: {
      ...baseCard,
      title: 'Task with Labels',
      labels: [sampleLabels[0], sampleLabels[1], sampleLabels[2]],
    },
    isDragging: false,
    onDragStart: () => {},
    onDragEnd: () => {},
  },
};

/**
 * ## With Assignees
 * Card showing assigned team members.
 */
export const WithAssignees: Story = {
  args: {
    card: {
      ...baseCard,
      title: 'Task with Assignees',
      assignees: [sampleUsers[0], sampleUsers[1]],
    },
    isDragging: false,
    onDragStart: () => {},
    onDragEnd: () => {},
  },
};

/**
 * ## With Due Date
 * Card with upcoming due date.
 */
export const WithDueDate: Story = {
  args: {
    card: {
      ...baseCard,
      title: 'Task with Due Date',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    },
    isDragging: false,
    onDragStart: () => {},
    onDragEnd: () => {},
  },
};

/**
 * ## Overdue
 * Card with overdue date (shows in red).
 */
export const Overdue: Story = {
  args: {
    card: {
      ...baseCard,
      title: 'Overdue Task',
      priority: 'high',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    isDragging: false,
    onDragStart: () => {},
    onDragEnd: () => {},
  },
};

/**
 * ## Full Featured
 * Card with all features: labels, assignees, due date.
 */
export const FullFeatured: Story = {
  args: {
    card: {
      ...baseCard,
      title: 'Complete Feature Implementation',
      description: 'Implement all required features for the dashboard module',
      priority: 'high',
      labels: [sampleLabels[1], sampleLabels[4]],
      assignees: [sampleUsers[0], sampleUsers[2], sampleUsers[3]],
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    isDragging: false,
    onDragStart: () => {},
    onDragEnd: () => {},
  },
};

/**
 * ## Dragging State
 * Card in dragging state (elevated with shadow).
 */
export const Dragging: Story = {
  args: {
    card: { ...baseCard, title: 'Being Dragged' },
    isDragging: true,
    onDragStart: () => {},
    onDragEnd: () => {},
  },
};

/**
 * ## Long Title
 * Card with a very long title (truncated to 2 lines).
 */
export const LongTitle: Story = {
  args: {
    card: {
      ...baseCard,
      title:
        'This is a very long task title that should be truncated after two lines to maintain card consistency',
    },
    isDragging: false,
    onDragStart: () => {},
    onDragEnd: () => {},
  },
};
