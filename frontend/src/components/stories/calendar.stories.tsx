import type { Meta, StoryObj } from "@storybook/react";
import Calendar from "../calendar/calendar";
import { birthdayEvent, deadlineEvent, lunchEvent } from "../../util/eventObjs";
import {
  workCalendar,
  familyCalendar,
  friendsCalendar,
} from "../../util/calendarObjs";
import {
  work_Calendar_Group,
  family_Calendar_Group,
  friends_Calendar_Group,
} from "../../util/calendar_groupsObjs";
import { workGroup, familyGroup, friendsGroup } from "../../util/groupObjs";
import { http, HttpResponse } from "msw";
import { API_BASE } from "../../util/api";
import { Calendar_GroupType, EventType, GroupType } from "../../util/db_models";

const events: EventType[] = [birthdayEvent, deadlineEvent, lunchEvent];
const calendar_groups: Calendar_GroupType[] = [
  work_Calendar_Group,
  family_Calendar_Group,
  friends_Calendar_Group,
];
const groups: GroupType[] = [workGroup, familyGroup, friendsGroup];

const mockFindCalendarGroups = (calendar_id: string) => {
  const cg = calendar_groups
    .filter((c) => c.calendar_id === calendar_id)
    .map((x) => x.group_id);
  const g = groups.filter((x) => cg.includes(x.id));
  return g;
};

const meta = {
  component: Calendar,
  title: "Dashboard/Calendar",
  tags: ["cal"],
  args: {
    calendars: [workCalendar, familyCalendar, friendsCalendar],
    testDate: new Date(2025, 7, 3),
  },
  parameters: {
    msw: {
      handlers: [
        http.get(`${API_BASE}/calendars/:id`, (req) => {
          const { id } = req.params;
          return HttpResponse.json({
            events: events.filter((e) => e.calendar_id === id),
          });
        }),
        http.get(`${API_BASE}/calendars/:id/groups`, (req) => {
          const id = req.params.id as string;
          return HttpResponse.json({
            groups: mockFindCalendarGroups(id),
          });
        }),
      ],
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {};
