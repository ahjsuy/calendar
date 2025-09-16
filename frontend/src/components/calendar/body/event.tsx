import { useState } from "react";
import { CalendarType, EventType } from "../../../util/db_models";
import useClickOutside from "../../../hooks/useClickOutside";

interface Props {
  event: EventType;
  calendarGroups?: CalendarType;
}

const Event = ({ event }: Props) => {
  const [expanded, setExpanded] = useState<Boolean>(false);
  const ref = useClickOutside(() => {
    setExpanded(false);
  });
  return (
    <div
      className={`transition-all duration-300 ease-in-out  ${
        expanded ? `event-button-expanded` : `event-button`
      }`}
      ref={ref}
    >
      <div>
        <div
          className="flex flex-row gap-3 justify-between"
          onClick={() => setExpanded(true)}
        >
          {expanded && (
            <div
              className="absolute right-[1rem] top-[.5rem] text-gray-400 cursor-pointer z-50"
              onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                e.stopPropagation();
                setExpanded(false);
                console.log("set expanded ", expanded);
              }}
            >
              <span className="material-icons-round">close</span>
            </div>
          )}
          <div className={`text-left ${!expanded ? `pl-2 pt-1` : `pl-2 pt-5`}`}>
            {event.name}
          </div>

          <div className={`text-left ${!expanded ? `pr-2 pt-1` : `pr-2 pt-5`}`}>
            {new Date(event.startDate).getHours()}:
            {new Date(event.startDate).getMinutes()}
            {expanded && event.endDate && (
              <div>
                {new Date(event.endDate).getHours()}:
                {new Date(event.endDate).getMinutes()}
              </div>
            )}
          </div>
        </div>
        {expanded && (
          <hr className="text-white h-[2rem] w-full m-auto mt-3"></hr>
        )}
      </div>
      {expanded && (
        <div className="text-left pl-2 flex flex-col text-[1.25rem]">
          <div className="">{event.description}</div>
          <div className="absolute bottom-[2.25rem] w-full">
            <div className="flex flex-row justify-between">
              <div className="w-[50%]">Owner:</div>
              <div className="w-[50%]">Group(s):</div>
            </div>
            <div className="text-sm">
              {" "}
              created on {new Date(event.createdAt).toDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Event;

//transition-all duration-300 ease-in-out cursor-pointer
