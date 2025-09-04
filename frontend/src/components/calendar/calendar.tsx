import { useState, useEffect } from "react";

import MonthlyView from "./body/month/monthlyView";
import CalendarHeader from "./calendarHeader";
import { CalendarType, EventType } from "../../util/db_models";
import { API_BASE } from "../../util/api";

interface Props {
  calendars: CalendarType[];
}

const Calendar = ({ calendars }: Props) => {
  const [currentCalendarIndex, setCurrentCalendarIndex] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<string>("month");
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/calendars/${calendars[currentCalendarIndex].id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data: { events: EventType[] }) => {
        setEvents(data.events);
      });
  }, [currentCalendarIndex]);

  return (
    <div>
      <div className="flex flex-row place-items-center place-content-center">
        <div
          className="bg-white rounded-full p-1 w-fit h-[2.5rem] cursor-pointer"
          onClick={() => {
            setCurrentCalendarIndex((prev) =>
              prev === 0 ? calendars.length - 1 : prev - 1
            );
          }}
        >
          {" "}
          <span className="material-icons-round text-gray-400 text-4xl m-0 p-0">
            arrow_back_ios
          </span>{" "}
        </div>
        <h1 className="m-3 pl-7 mr-7">
          {calendars[currentCalendarIndex] &&
            calendars[currentCalendarIndex].name}
        </h1>
        <div
          className="bg-white rounded-full p-1 w-fit h-[2.5rem] cursor-pointer"
          onClick={() => {
            setCurrentCalendarIndex((prev) =>
              prev === calendars.length - 1 ? 0 : prev + 1
            );
          }}
        >
          {" "}
          <span className="material-icons-round text-gray-400 text-4xl m-0 p-0">
            arrow_forward_ios
          </span>{" "}
        </div>
      </div>
      <div className="rounded-xl">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          setDate={setCurrentDate}
          setView={setView}
        />
        <MonthlyView currentDate={currentDate} events={events} />
      </div>
    </div>
  );
};

export default Calendar;
