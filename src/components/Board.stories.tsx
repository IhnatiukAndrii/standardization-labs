import type { Meta, StoryObj } from '@storybook/react-vite';
import { Board } from './Board';

const meta: Meta<typeof Board> = {
  title: 'Components/Board',
  component: Board,
  tags: ['autodocs'],
  argTypes: {
    boardSize: {
      control: { type: 'number', min: 3, max: 5 },
      description: 'The grid size (3 for 3x3, 4 for 4x4, 5 for 5x5)',
    },
    tiles: {
      control: { type: 'object' },
      description: 'The array of tile values, with 0 representing the empty tile',
    },
    onTileClick: { action: 'tileClicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Board>;

export const Grid3x3: Story = {
  args: {
    boardSize: 3,
    tiles: [1, 2, 3, 4, 5, 6, 7, 8, 0],
  },
};

export const Grid4x4Standard: Story = {
  args: {
    boardSize: 4,
    tiles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0],
  },
};

export const Grid5x5: Story = {
  args: {
    boardSize: 5,
    tiles: [
      1, 2, 3, 4, 5,
      6, 7, 8, 9, 10,
      11, 12, 13, 14, 15,
      16, 17, 18, 19, 20,
      21, 22, 23, 24, 0
    ],
  },
};

export const InGameStateShuffled: Story = {
  args: {
    boardSize: 4,
    tiles: [12, 1, 2, 15, 11, 6, 3, 7, 13, 9, 5, 4, 14, 10, 8, 0],
  },
};
