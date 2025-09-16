import { EventType } from "./db_models";

export const birthdayEvent: EventType = {
  id: "9ce1d9d4-633e-46bc-9a00-83b589457f7e",
  calendar_id: "20bb5f62-fe2d-4003-a22f-713a8bbb0640",
  name: "Ethan's Birthday",
  startDate: "2025-08-27T03:27:15+00:00",
  endDate: "2025-08-27T4:27:15+00:00",
  visibility: "full-detail",
  createdAt: "2025-08-21T03:27:15+00:00",
  description: "Ethan's Birthday party. It's at 2021 Fake Ave. 96621 SC, CA.",
};

export const deadlineEvent: EventType = {
  id: "99f28cf4-09ae-4641-bcab-c0dff0a4ff46",
  calendar_id: "538bda6b-ecf0-4eb0-bff2-ace6f5a09129",
  name: "Project Deadline",
  startDate: "2025-08-27T01:27:15+00:00",
  endDate: "",
  visibility: "busy-only",
  createdAt: "2025-08-21T03:27:15+00:00",
  description: "Aegis Project Deadline for Q4.",
};

export const lunchEvent: EventType = {
  id: "75bf17ee-281f-42da-9b3c-1b739de8c565",
  calendar_id: "796373d9-df0b-4d0d-b16b-faa815f0092c",
  name: "Lunch with Susie",
  startDate: "2025-08-01T12:30:15+00:00",
  endDate: "2025-08-01T01:30:15+00:00",
  visibility: "full-detail",
  createdAt: "2025-07-28T12:30:15+00:00",
  description: "Lunch with Susie at Dao's. My turn to pay.",
};

export const projectCelebration: EventType = {
  id: "92f28cf4-09ae-4641-bcab-c0dff0a4ff46",
  calendar_id: "538bda5b-ecf0-4eb0-bff2-ace6f5a09129",
  name: "Project Finish Celebration",
  startDate: "2025-08-27T06:00:15+00:00",
  endDate: "",
  visibility: "busy-only",
  createdAt: "2025-08-21T03:27:15+00:00",
  description: "Aegis' project wrapup party. Volunteered to bring pizzas.",
};
