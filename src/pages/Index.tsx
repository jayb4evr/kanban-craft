import { useState, useCallback } from 'react';
import { KanbanBoard } from '@/kanban';
import type { KanbanBoardType, KanbanCardType, KanbanColumnType, Priority, KanbanLabel, KanbanUser } from '@/kanban';

// Sample data
const sampleUsers: KanbanUser[] = [
  { id: '1', name: 'Alex Johnson', initials: 'AJ' },
  { id: '2', name: 'Sarah Miller', initials: 'SM' },
  { id: '3', name: 'Chris Davis', initials: 'CD' },
  { id: '4', name: 'Emma Wilson', initials: 'EW' },
];

const sampleLabels: KanbanLabel[] = [
  { id: '1', name: 'Feature', color: '#3b82f6' },
  { id: '2', name: 'Bug', color: '#ef4444' },
  { id: '3', name: 'Enhancement', color: '#8b5cf6' },
  { id: '4', name: 'Documentation', color: '#10b981' },
];

const generateId = () => Math.random().toString(36).substring(2, 11);

const initialBoard: KanbanBoardType = {
  id: 'board-1',
  title: 'Project Tasks',
  columns: [
    {
      id: 'col-1',
      title: 'To Do',
      status: 'todo',
      order: 0,
      limit: 10,
      cards: [
        {
          id: 'card-1',
          title: 'Design system documentation',
          description: 'Create comprehensive documentation for the design system including color palette, typography, and component guidelines.',
          columnId: 'col-1',
          priority: 'high',
          labels: [sampleLabels[3]],
          assignees: [sampleUsers[0], sampleUsers[1]],
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
          order: 0,
        },
        {
          id: 'card-2',
          title: 'Implement user authentication',
          description: 'Set up OAuth2 authentication with Google and GitHub providers.',
          columnId: 'col-1',
          priority: 'high',
          labels: [sampleLabels[0]],
          assignees: [sampleUsers[2]],
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
          order: 1,
        },
        {
          id: 'card-3',
          title: 'Fix mobile responsiveness',
          description: 'Address layout issues on smaller screens.',
          columnId: 'col-1',
          priority: 'medium',
          labels: [sampleLabels[1]],
          assignees: [sampleUsers[3]],
          createdAt: new Date(),
          updatedAt: new Date(),
          order: 2,
        },
      ],
    },
    {
      id: 'col-2',
      title: 'In Progress',
      status: 'in-progress',
      order: 1,
      limit: 5,
      cards: [
        {
          id: 'card-4',
          title: 'API integration with backend',
          description: 'Connect frontend components with REST API endpoints.',
          columnId: 'col-2',
          priority: 'high',
          labels: [sampleLabels[0]],
          assignees: [sampleUsers[0]],
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
          order: 0,
        },
        {
          id: 'card-5',
          title: 'Dashboard analytics widgets',
          description: 'Build interactive charts and graphs for the dashboard.',
          columnId: 'col-2',
          priority: 'medium',
          labels: [sampleLabels[2]],
          assignees: [sampleUsers[1], sampleUsers[2]],
          createdAt: new Date(),
          updatedAt: new Date(),
          order: 1,
        },
      ],
    },
    {
      id: 'col-3',
      title: 'Review',
      status: 'review',
      order: 2,
      cards: [
        {
          id: 'card-6',
          title: 'Code review: Payment module',
          description: 'Review and approve the payment processing implementation.',
          columnId: 'col-3',
          priority: 'high',
          labels: [sampleLabels[0]],
          assignees: [sampleUsers[3]],
          dueDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          order: 0,
        },
      ],
    },
    {
      id: 'col-4',
      title: 'Done',
      status: 'done',
      order: 3,
      cards: [
        {
          id: 'card-7',
          title: 'Project setup and configuration',
          description: 'Initial project setup with Vite, TypeScript, and Tailwind CSS.',
          columnId: 'col-4',
          priority: 'low',
          labels: [sampleLabels[0]],
          assignees: [sampleUsers[0]],
          createdAt: new Date(),
          updatedAt: new Date(),
          order: 0,
        },
        {
          id: 'card-8',
          title: 'Component library setup',
          description: 'Set up base components and styling system.',
          columnId: 'col-4',
          priority: 'low',
          labels: [sampleLabels[0], sampleLabels[3]],
          assignees: [sampleUsers[1]],
          createdAt: new Date(),
          updatedAt: new Date(),
          order: 1,
        },
      ],
    },
  ],
};

export default function Index() {
  const [board, setBoard] = useState<KanbanBoardType>(initialBoard);

  const handleCardMove = useCallback(
    (cardId: string, sourceColumnId: string, targetColumnId: string, newIndex: number) => {
      setBoard((prevBoard) => {
        const newColumns = prevBoard.columns.map((col) => ({
          ...col,
          cards: [...col.cards],
        }));

        const sourceColumn = newColumns.find((c) => c.id === sourceColumnId);
        const targetColumn = newColumns.find((c) => c.id === targetColumnId);

        if (!sourceColumn || !targetColumn) return prevBoard;

        const cardIndex = sourceColumn.cards.findIndex((c) => c.id === cardId);
        if (cardIndex === -1) return prevBoard;

        const [card] = sourceColumn.cards.splice(cardIndex, 1);
        card.columnId = targetColumnId;
        card.updatedAt = new Date();

        targetColumn.cards.splice(newIndex, 0, card);

        // Reorder
        sourceColumn.cards.forEach((c, i) => (c.order = i));
        targetColumn.cards.forEach((c, i) => (c.order = i));

        return { ...prevBoard, columns: newColumns };
      });
    },
    []
  );

  const handleCardClick = useCallback((card: KanbanCardType) => {
    console.log('Card clicked:', card);
  }, []);

  const handleCardCreate = useCallback((columnId: string) => {
    const newCard: KanbanCardType = {
      id: generateId(),
      title: 'New Task',
      description: '',
      columnId,
      priority: 'medium',
      labels: [],
      assignees: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      order: 0,
    };

    setBoard((prevBoard) => ({
      ...prevBoard,
      columns: prevBoard.columns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: [
                { ...newCard, order: 0 },
                ...col.cards.map((c, i) => ({ ...c, order: i + 1 })),
              ],
            }
          : col
      ),
    }));
  }, []);

  const handleColumnCreate = useCallback(() => {
    const newColumn: KanbanColumnType = {
      id: generateId(),
      title: 'New Column',
      status: 'todo',
      order: board.columns.length,
      cards: [],
    };

    setBoard((prevBoard) => ({
      ...prevBoard,
      columns: [...prevBoard.columns, newColumn],
    }));
  }, [board.columns.length]);

  const handleColumnUpdate = useCallback((updatedColumn: KanbanColumnType) => {
    setBoard((prevBoard) => ({
      ...prevBoard,
      columns: prevBoard.columns.map((col) =>
        col.id === updatedColumn.id ? updatedColumn : col
      ),
    }));
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden">
      <KanbanBoard
        board={board}
        onCardMove={handleCardMove}
        onCardClick={handleCardClick}
        onCardCreate={handleCardCreate}
        onColumnCreate={handleColumnCreate}
        onColumnUpdate={handleColumnUpdate}
        className="h-full"
      />
    </div>
  );
}
