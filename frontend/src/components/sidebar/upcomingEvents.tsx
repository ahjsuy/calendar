import { useEffect, useState } from "react";
import { EventType } from "../../util/db_models";
import { API_BASE } from "../../util/api";

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
        <div
          className={`transition-all duration-300 ease-in-out  ${
            showEventForm ? `event-button-expanded` : `event-button`
          }`}
        >
          <form>Create a new event</form>
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;
