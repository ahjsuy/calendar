import { useEffect, useState } from "react";
import { EventType } from "../../../../util/db_models";
import MonthCell from "./monthCell";
import events from "storybook/internal/core-events";

interface Props {
  currentDate: Date;
  events: EventType[];
}

interface CalendarDay {
  dayNumber: number;
  events: EventType[];
}

const MonthlyView = ({ currentDate, events }: Props) => {
  // each week is an array of 7
  // 1. get the days of the month
  // 2. add previous days to the front of the array if the start of the
  // month is not on sunday
  // 3. add more days to the end
  // 4. map the array to the headers
  const [calendarDisplay, setCalendarDisplay] = useState<CalendarDay[][]>([]);
  const [monthlyEvents, setMonthlyEvents] = useState<EventType[][]>(
    Array.from({ length: 31 }, () => [])
  );

  const days: string[] = ["S", "M", "T", "W", "TH", "F", "S"];
  const fillCalendarArray = () => {
    const calendarArray: CalendarDay[][] = [[]];
    const daysInCurrentMonth: number = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const monthStartDay: number = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    const monthLastDay: number = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDay();

    // fill the days from previous month
    const prevMonthTotalDays = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    ).getDate();

    // fill events array
    const currentMonth = currentDate.getMonth();
    const eventsArray: EventType[][] = Array.from({ length: 31 }, () => []);
    events
      .filter((e) => new Date(e.startDate).getMonth() === currentMonth)
      .forEach((e) => {
        console.log(new Date(e.startDate).getDate());
        eventsArray[new Date(e.startDate).getDate() - 1].push(e);
      });

    let daysOfPreviousMonth = prevMonthTotalDays - monthStartDay + 1;

    for (let i = 0; i < monthStartDay; i++) {
      calendarArray[0].push({
        dayNumber: daysOfPreviousMonth,
        events: new Array(),
      } as CalendarDay);
      daysOfPreviousMonth++;
    }

    // fill in days from current month
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      if (calendarArray[calendarArray.length - 1].length === 7) {
        calendarArray.push([]);
      }
      calendarArray[calendarArray.length - 1].push({
        dayNumber: i,
        events: eventsArray[i - 1],
      });
    }

    // fill in days for next month
    let nextMonthDays = 1;
    while (calendarArray[calendarArray.length - 1].length < 7) {
      calendarArray[calendarArray.length - 1].push({
        dayNumber: nextMonthDays,
        events: new Array(),
      });
      nextMonthDays++;
    }
    setCalendarDisplay(calendarArray);
  };

  //move this logic to include last / next months'
  const fillMonthlyEvents = () => {
    const currentMonth = currentDate.getMonth();
    console.log(currentMonth);
    const eventsArray: EventType[][] = Array.from({ length: 31 }, () => []);
    events
      .filter((e) => new Date(e.startDate).getMonth() === currentMonth)
      .forEach((e) => {
        console.log("this is the e ", currentMonth);
        console.log(new Date(e.startDate).getDate());
        eventsArray[new Date(e.startDate).getDate()].push(e);
      });
    setMonthlyEvents(eventsArray);
  };

  useEffect(() => {
    fillCalendarArray();
  }, [currentDate]);

  return (
    <div>
      <table className="place-content-center">
        <thead className="place-content-center bg-secondary-300">
          <tr>
            {days.map((item, i) => (
              <th className="border border-gray" key={i}>
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarDisplay.map((week, i) => (
            <tr key={i}>
              {week.map((day) => (
                <td className="border border-gray">
                  <MonthCell day={day.dayNumber} events={day.events} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyView;
