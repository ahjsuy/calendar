import Event from "../event";
import { EventType } from "../../../../util/db_models";
interface Props {
  day: number;
  events: EventType[];
}

const MonthCell = ({ day, events }: Props) => {
  return (
    <div className="w-[10rem] h-[9rem] flex flex-col">
      <div className="m-3">{day}</div>
      <div className="mt-auto flex flex-col gap-1 m-1 overflow-visible">
        {events
          .sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate))
          .map((e) => (
            <Event event={e} />
          ))}
      </div>
    </div>
  );
};

export default MonthCell;
