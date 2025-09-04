import type { Meta, StoryObj } from "@storybook/react";

import Groups from "../sidebar/groups";
import { workGroup, friendsGroup, familyGroup } from "../../util/groupObjs";

const meta = {
  component: Groups,
  title: "Dashboard/Groups",
  tags: ["cal"],
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  args: { groups: [workGroup, friendsGroup, familyGroup] },
} satisfies Meta<typeof Groups>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// export const OneEvent: Story = {};

// export const MultipleEvents: Story = {};
