import type { Meta, StoryObj } from "@storybook/react";

import UpcomingEvents from "../sidebar/upcomingEvents";
import { birthdayEvent, deadlineEvent, lunchEvent } from "../../util/eventObjs";

const meta = {
  component: UpcomingEvents,
  title: "Dashboard/UpcomingEvents",
  tags: ["cal"],
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  args: {
    currentDate: new Date(2025, 7, 3),
    events: [birthdayEvent, deadlineEvent, lunchEvent],
  },
} satisfies Meta<typeof UpcomingEvents>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// export const OneEvent: Story = {};

// export const MultipleEvents: Story = {};
