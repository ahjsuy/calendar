export type CalendarType = {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  createdAt: string;
  color: string;
};

export type EventType = {
  id: string;
  calendar_id: string;
  name: string;
  startDate: string;
  endDate: string;
  visibility: string;
  createdAt: string;
  description: string;
};

export type GroupType = {
  id: string;
  owner_id: string;
  name: string;
  color: string;
  createdAt: string;
};

export type Calendar_GroupType = {
  calendar_id: string;
  group_id: string;
  permission: string;
  granted_at: string;
  visibility: string;
};
