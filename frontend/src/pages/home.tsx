import { useEffect, useState } from "react";
import Calendar from "../components/calendar/calendar";
import Navbar from "../components/navbar";
import { API_BASE } from "../util/api";
import { CalendarType } from "../util/db_models";

const Home = () => {
  // fetch all calendars associated with the account

  const [calendars, setCalendars] = useState<CalendarType[]>([]);

  useEffect(() => {
    handleFetchCalendars();
  }, []);

  const handleFetchCalendars = () => {
    fetch(`${API_BASE}/calendars/owned`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const calendarsList: CalendarType[] = [];
        data.calendars.forEach((calendar) => calendarsList.push(calendar));
        setCalendars(calendarsList);
      });
  };

  const handleCreateCalendar = () => {
    fetch("https://localhost:8081/api/calendars/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: `Master Calendar`,
        description: "Default Master Calendar",
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status.toString());
        }
      })
      .catch((err) => alert("Something went wrong! " + err.message));
    handleFetchCalendars();
  };

  return (
    <div>
      <Navbar />
      <div>
        <Calendar calendars={calendars} />
        <button onClick={handleCreateCalendar}>Create Calendar</button>
        {calendars.map((c) => (
          <div>{JSON.stringify(c)}</div>
        ))}
      </div>
    </div>
  );
};

export default Home;
