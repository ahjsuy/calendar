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
  calendarID: string;
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
