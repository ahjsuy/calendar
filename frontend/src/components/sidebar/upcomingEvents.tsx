import { useEffect, useState } from "react";
import { EventType } from "../../util/db_models";
import useClickOutside from "../../hooks/useClickOutside";
import FocusModule from "../focusModule";

interface Props {
  events: EventType[];
  addEvent: Function;
  currentDate?: Date;
}

const UpcomingEvents = ({
  events,
  addEvent,
  currentDate = new Date(),
}: Props) => {
  const [upcomingEvents, setUpcomingEvents] = useState<EventType[]>([]);
  const [showEventForm, setShowEventForm] = useState<boolean>(false);

  useEffect(() => {
    events.filter((e) => new Date(e.startDate) >= currentDate);
    const listLength = Math.min(5, events.length);
    const temp: EventType[] = [];
    for (let i = 0; i < listLength; i++) {
      temp.push(events[listLength - i - 1]);
    }
    setUpcomingEvents(temp);
  }, [events]);

  const ref = useClickOutside(() => setShowEventForm(false));
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return (
    <div className="p-2 w-[20vw]">
      <h2 className="text-2xl m-1">Upcoming Events</h2>
      <div className="bg-white p-2">
        <ul>
          {upcomingEvents.map((e, i) => (
            <li>
              <div className="flex justify-between">
                <div>{e.name}</div>
                <div>{new Date(e.startDate).toLocaleDateString()}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div
        className="text-xs text-secondary-400 hover:cursor-pointer hover:underline"
        onClick={() => {
          setShowEventForm(true);
        }}
      >
        + Add another event to this calendar?
      </div>
      {showEventForm && (
        <FocusModule
          children={
            <div>
              <div className="flex flex-row justify-between">
                <input
                  className="focus-module-input"
                  placeholder="Event Name"
                />
                <div className="align-middle">
                  <input
                    className="focus-module-input medium"
                    value="2017-06-01"
                    type="date"
                  />
                  <div className="flex align-middle">
                    <input className="focus-module-input small" type="time" />
                    -
                    <input className="focus-module-input small" type="time" />
                  </div>
                </div>
              </div>
              <hr />
              <div> Description</div>

              <div> Groups</div>
              <div> Calendars </div>
            </div>
          }
          expanded={showEventForm}
          setExpanded={setShowEventForm}
          ref={ref}
        />
      )}
    </div>
  );
};

export default UpcomingEvents;
