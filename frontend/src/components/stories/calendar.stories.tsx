import type { Meta, StoryObj } from "@storybook/react";
import Calendar from "../calendar/calendar";
import { birthdayEvent, deadlineEvent, lunchEvent } from "../../util/eventObjs";
import {
  workCalendar,
  familyCalendar,
  friendsCalendar,
} from "../../util/calendarObjs";
import { http, HttpResponse } from "msw";
import { API_BASE } from "../../util/api";
import { EventType } from "../../util/db_models";

const events: EventType[] = [birthdayEvent, deadlineEvent, lunchEvent];

const meta = {
  component: Calendar,
  title: "Dashboard/Calendar",
  tags: ["cal"],
  args: {
    calendars: [workCalendar, familyCalendar, friendsCalendar],
  },
  parameters: {
    msw: {
      handlers: [
        http.get(`${API_BASE}/calendars/:id`, (req) => {
          const { id } = req.params;
          return HttpResponse.json({
            events: events.filter((e) => e.calendarID === id),
          });
        }),
      ],
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {};
