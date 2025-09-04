import type { Meta, StoryObj } from "@storybook/react";
import MonthlyView from "../calendar/body/month/monthlyView";
import {
  birthdayEvent,
  deadlineEvent,
  lunchEvent,
  projectCelebration,
} from "../../util/eventObjs";

const meta = {
  component: MonthlyView,
  title: "Monthly View",
  tags: ["cal"],
  args: {
    currentDate: new Date(2025, 7, 1), // August 1, 2025 (month is 0-indexed)
    events: [],
  },
} satisfies Meta<typeof MonthlyView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OneEvent: Story = {
  args: {
    events: [birthdayEvent],
  },
};

export const MultipleEvents: Story = {
  args: {
    events: [birthdayEvent, deadlineEvent, lunchEvent, projectCelebration],
  },
};
