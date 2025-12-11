import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { AddCardModal } from './AddCardModal';

const meta: Meta<typeof AddCardModal> = {
  title: 'Components/AddCardModal',
  component: AddCardModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof AddCardModal>;

// Interactive wrapper
const ModalDemo = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
      >
        Open Modal
      </button>
      <AddCardModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAdd={(title, description, priority) => {
          console.log('Added card:', { title, description, priority });
          setIsOpen(false);
        }}
      />
    </>
  );
};

/**
 * ## Default Modal
 * Standard add card modal with title, description, and priority fields.
 */
export const Default: Story = {
  render: () => <ModalDemo />,
};

/**
 * ## Closed State
 * Modal in closed state (button to open).
 */
export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    onAdd: () => {},
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Add New Card
        </button>
        <AddCardModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onAdd={(title, description, priority) => {
            console.log('Added:', { title, description, priority });
            setIsOpen(false);
          }}
        />
      </>
    );
  },
};
