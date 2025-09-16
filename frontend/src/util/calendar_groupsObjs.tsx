import { Calendar_GroupType } from "./db_models";

export const work_Calendar_Group: Calendar_GroupType = {
  calendar_id: "538bda6b-ecf0-4eb0-bff2-ace6f5a09129",
  group_id: "04c07bbe-7ace-4fc7-aa53-98d2a75ef9ec",
  permission: "write",
  granted_at: new Date(2024, 0, 1, 0, 0, 0).toString(),
  visibility: "full-detail",
};

export const family_Calendar_Group: Calendar_GroupType = {
  calendar_id: "20bb5f62-fe2d-4003-a22f-713a8bbb0640",
  group_id: "70e8bd44-5852-4680-a358-1690115a4a67",
  permission: "write",
  granted_at: new Date(2024, 0, 1, 0, 0, 0).toString(),
  visibility: "full-detail",
};
export const friends_Calendar_Group: Calendar_GroupType = {
  calendar_id: "796373d9-df0b-4d0d-b16b-faa815f0092c",
  group_id: "7498495b-a170-4b4b-a06c-fd9bc01da98d",
  permission: "read",
  granted_at: new Date(2024, 0, 1, 0, 0, 0).toString(),
  visibility: "busy-only",
};
