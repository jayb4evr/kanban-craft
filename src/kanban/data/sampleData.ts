import type { KanbanBoard, KanbanCard, KanbanColumn, KanbanLabel, KanbanUser } from '../types';

// Sample users
export const sampleUsers: KanbanUser[] = [
  { id: 'user-1', name: 'Alice Johnson', initials: 'AJ', avatar: undefined },
  { id: 'user-2', name: 'Bob Smith', initials: 'BS', avatar: undefined },
  { id: 'user-3', name: 'Carol White', initials: 'CW', avatar: undefined },
  { id: 'user-4', name: 'David Lee', initials: 'DL', avatar: undefined },
];

// Sample labels
export const sampleLabels: KanbanLabel[] = [
  { id: 'label-1', name: 'Bug', color: '#ef4444' },
  { id: 'label-2', name: 'Feature', color: '#3b82f6' },
  { id: 'label-3', name: 'Enhancement', color: '#8b5cf6' },
  { id: 'label-4', name: 'Documentation', color: '#10b981' },
  { id: 'label-5', name: 'Urgent', color: '#f97316' },
];

// Helper to create cards
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

// Default board with 4 columns and sample tasks
export const defaultBoard: KanbanBoard = {
  id: 'board-1',
  title: 'Project Tasks',
  columns: [
    {
      id: 'col-todo',
      title: 'To Do',
      status: 'todo',
      order: 0,
      cards: [
        createCard('card-1', 'Design homepage layout', 'col-todo', 'high', 0, {
          description: 'Create wireframes and mockups for the new homepage',
          labels: [sampleLabels[1]],
          assignees: [sampleUsers[0]],
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }),
        createCard('card-2', 'Set up CI/CD pipeline', 'col-todo', 'medium', 1, {
          description: 'Configure GitHub Actions for automated testing and deployment',
          labels: [sampleLabels[2]],
          assignees: [sampleUsers[1]],
        }),
        createCard('card-3', 'Write API documentation', 'col-todo', 'low', 2, {
          labels: [sampleLabels[3]],
        }),
      ],
    },
    {
      id: 'col-in-progress',
      title: 'In Progress',
      status: 'in-progress',
      order: 1,
      cards: [
        createCard('card-4', 'Implement user authentication', 'col-in-progress', 'high', 0, {
          description: 'Add login, logout, and registration functionality',
          labels: [sampleLabels[1]],
          assignees: [sampleUsers[2]],
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        }),
        createCard('card-5', 'Fix navigation bug on mobile', 'col-in-progress', 'medium', 1, {
          labels: [sampleLabels[0]],
          assignees: [sampleUsers[0]],
        }),
      ],
    },
    {
      id: 'col-review',
      title: 'Review',
      status: 'review',
      order: 2,
      cards: [
        createCard('card-6', 'Database schema optimization', 'col-review', 'medium', 0, {
          description: 'Review and optimize database queries for better performance',
          labels: [sampleLabels[2]],
          assignees: [sampleUsers[3]],
        }),
      ],
    },
    {
      id: 'col-done',
      title: 'Done',
      status: 'done',
      order: 3,
      cards: [
        createCard('card-7', 'Project kickoff meeting', 'col-done', 'low', 0, {
          assignees: [sampleUsers[0], sampleUsers[1], sampleUsers[2]],
        }),
        createCard('card-8', 'Requirements gathering', 'col-done', 'medium', 1, {
          labels: [sampleLabels[3]],
        }),
      ],
    },
  ],
};

// Empty board
export const emptyBoard: KanbanBoard = {
  id: 'board-empty',
  title: 'Empty Board',
  columns: [
    { id: 'col-todo', title: 'To Do', status: 'todo', order: 0, cards: [] },
    { id: 'col-in-progress', title: 'In Progress', status: 'in-progress', order: 1, cards: [] },
    { id: 'col-review', title: 'Review', status: 'review', order: 2, cards: [] },
    { id: 'col-done', title: 'Done', status: 'done', order: 3, cards: [] },
  ],
};

// Generate large dataset board (30+ tasks)
export const generateLargeDatasetBoard = (): KanbanBoard => {
  const priorities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
  const taskTitles = [
    'Implement feature',
    'Fix bug in',
    'Optimize performance of',
    'Write tests for',
    'Refactor',
    'Update documentation for',
    'Review PR for',
    'Deploy',
    'Configure',
    'Design',
  ];
  const modules = [
    'user module',
    'payment system',
    'dashboard',
    'API endpoints',
    'authentication',
    'database layer',
    'caching system',
    'notification service',
    'reporting module',
    'admin panel',
  ];

  let cardIndex = 0;
  const columns: KanbanColumn[] = [
    { id: 'col-todo', title: 'To Do', status: 'todo', order: 0, cards: [] },
    { id: 'col-in-progress', title: 'In Progress', status: 'in-progress', order: 1, cards: [] },
    { id: 'col-review', title: 'Review', status: 'review', order: 2, cards: [] },
    { id: 'col-done', title: 'Done', status: 'done', order: 3, cards: [] },
  ];

  // Generate 10 cards per column (40 total)
  columns.forEach((column) => {
    for (let i = 0; i < 10; i++) {
      const title = `${taskTitles[i % taskTitles.length]} ${modules[cardIndex % modules.length]}`;
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const assignee = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
      const label = sampleLabels[Math.floor(Math.random() * sampleLabels.length)];
      
      column.cards.push(
        createCard(`card-large-${cardIndex}`, title, column.id, priority, i, {
          description: `Task description for ${title}`,
          labels: Math.random() > 0.5 ? [label] : [],
          assignees: Math.random() > 0.3 ? [assignee] : [],
          dueDate: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000) : undefined,
        })
      );
      cardIndex++;
    }
  });

  return {
    id: 'board-large',
    title: 'Large Dataset Board (40 Tasks)',
    columns,
  };
};

// Board with different priorities showcase
export const priorityShowcaseBoard: KanbanBoard = {
  id: 'board-priorities',
  title: 'Priority Levels Showcase',
  columns: [
    {
      id: 'col-low',
      title: 'Low Priority',
      status: 'todo',
      order: 0,
      cards: [
        createCard('p-1', 'Documentation update', 'col-low', 'low', 0, {
          description: 'Update README with latest changes',
          labels: [sampleLabels[3]],
        }),
        createCard('p-2', 'Code cleanup', 'col-low', 'low', 1, {
          description: 'Remove unused imports and variables',
        }),
        createCard('p-3', 'Add unit tests', 'col-low', 'low', 2, {
          description: 'Increase test coverage to 80%',
        }),
      ],
    },
    {
      id: 'col-medium',
      title: 'Medium Priority',
      status: 'in-progress',
      order: 1,
      cards: [
        createCard('p-4', 'Feature enhancement', 'col-medium', 'medium', 0, {
          description: 'Add filtering options to the dashboard',
          labels: [sampleLabels[2]],
          assignees: [sampleUsers[0]],
        }),
        createCard('p-5', 'Performance optimization', 'col-medium', 'medium', 1, {
          description: 'Optimize database queries',
          assignees: [sampleUsers[1]],
        }),
        createCard('p-6', 'UI improvements', 'col-medium', 'medium', 2, {
          description: 'Enhance mobile responsiveness',
        }),
      ],
    },
    {
      id: 'col-high',
      title: 'High Priority',
      status: 'review',
      order: 2,
      cards: [
        createCard('p-7', 'Critical bug fix', 'col-high', 'high', 0, {
          description: 'Fix authentication bypass vulnerability',
          labels: [sampleLabels[0], sampleLabels[4]],
          assignees: [sampleUsers[2]],
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        }),
        createCard('p-8', 'Production deployment', 'col-high', 'high', 1, {
          description: 'Deploy v2.0 release to production',
          labels: [sampleLabels[4]],
          assignees: [sampleUsers[3]],
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Overdue
        }),
        createCard('p-9', 'Security patch', 'col-high', 'high', 2, {
          description: 'Apply latest security patches',
          labels: [sampleLabels[0]],
        }),
      ],
    },
  ],
};

export const largeDatasetBoard = generateLargeDatasetBoard();
