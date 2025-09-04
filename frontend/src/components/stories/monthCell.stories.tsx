import type { Meta, StoryObj } from "@storybook/react";

import MonthCell from "../calendar/body/month/monthCell";
import { birthdayEvent, deadlineEvent, lunchEvent } from "../../util/eventObjs";

const meta = {
  component: MonthCell,
  title: "Month Cell",
  tags: ["cal"],
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  args: {
    day: 1,
    events: [],
  },
} satisfies Meta<typeof MonthCell>;

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
    events: [birthdayEvent, deadlineEvent, lunchEvent],
  },
};
