import { CalendarType } from "./db_models";

export const workCalendar: CalendarType = {
  id: "538bda6b-ecf0-4eb0-bff2-ace6f5a09129",
  owner_id: "c25058e0-bbea-4574-a1b3-00b1ac615064",
  name: "Work",
  description: "calendar for work",
  createdAt: new Date(2024, 0, 1, 0, 0, 0).toString(),
  color: "gray",
};

export const familyCalendar: CalendarType = {
  id: "20bb5f62-fe2d-4003-a22f-713a8bbb0640",
  owner_id: "c25058e0-bbea-4574-a1b3-00b1ac615064",
  name: "Family",
  description: "calendar for family",
  createdAt: new Date(2024, 0, 1, 0, 0, 0).toString(),
  color: "yellow",
};

export const friendsCalendar: CalendarType = {
  id: "796373d9-df0b-4d0d-b16b-faa815f0092c",
  owner_id: "c25058e0-bbea-4574-a1b3-00b1ac615064",
  name: "Friends",
  description: "calendar for friends",
  createdAt: new Date(2024, 0, 1, 0, 0, 0).toString(),
  color: "green",
};
