import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
      description: 'The visual style variant of the button',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Determines if the button is interactive',
    },
    children: {
      control: { type: 'text' },
      description: 'The content inside the button',
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Action',
    disabled: false,
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Action',
    disabled: false,
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger Action',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Disabled Button',
    disabled: true,
  },
};
