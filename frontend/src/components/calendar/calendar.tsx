import { useState, useEffect } from "react";

import MonthlyView from "./body/month/monthlyView";
import CalendarHeader from "./calendarHeader";
import { CalendarType, EventType, GroupType } from "../../util/db_models";
import { API_BASE } from "../../util/api";
import UpcomingEvents from "../sidebar/upcomingEvents";
import Groups from "../sidebar/groups";
import useClickOutside from "../../hooks/useClickOutside";

interface Props {
  calendars: CalendarType[];
  testDate?: Date;
}

const Calendar = ({ calendars, testDate = new Date() }: Props) => {
  const [currentCalendarIndex, setCurrentCalendarIndex] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState<Date>(testDate);
  const [view, setView] = useState<string>("month");
  const [events, setEvents] = useState<EventType[]>([]);
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  const ref = useClickOutside(() => {
    setShowDropDown(false);
  });
  const today = testDate;

  useEffect(() => {
    // get different calendars
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
        console.log(data.events);
        setEvents(data.events);
      });

    // get groups for calendars
    fetch(
      `${API_BASE}/calendars/${calendars[currentCalendarIndex].id}/groups`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data: { groups: GroupType[] }) => {
        setGroups(data.groups);
      });
  }, [currentCalendarIndex]);

  const addEvent = (event: EventType) => {
    fetch(`${API_BASE}/calendars/${calendars[currentCalendarIndex].id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: event.name,
        startDate: event.startDate,
        endDate: event.endDate,
        visibility: event.visibility,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status.toString());
        }
      })
      .catch((err) => alert("Something went wrong! " + err.message));
  };

  return (
    <div className="">
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
        <div ref={ref}>
          <div
            className="text-5xl"
            onClick={() => {
              setShowDropDown(true);
            }}
          >
            {calendars[currentCalendarIndex] &&
              calendars[currentCalendarIndex].name}
          </div>
          {showDropDown && (
            <ul className="absolute border border-solid border-gray-500">
              {calendars.map((c, i) => (
                <div className="">
                  {i !== currentCalendarIndex && (
                    <li
                      onClick={() => {
                        setCurrentCalendarIndex(i);
                        setShowDropDown(false);
                      }}
                      className=" hover:bg-slate-300 hover:cursor-pointer w-full"
                    >
                      {c.name}
                    </li>
                  )}
                </div>
              ))}
            </ul>
          )}
        </div>
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
      <div className="flex flex-row">
        <div className="flex flex-col m-3">
          <span className="h-[5rem] "> </span>
          {
            <UpcomingEvents
              events={events}
              addEvent={addEvent}
              currentDate={today}
            />
          }
          {<Groups groups={groups} />}
        </div>
        <div className="flex flex-col">
          <CalendarHeader
            currentDate={currentDate}
            view={view}
            setDate={setCurrentDate}
            setView={setView}
          />
          <MonthlyView currentDate={currentDate} events={events} />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
