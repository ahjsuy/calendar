import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./components/navbar";
import Card from "./components/card";
import AnnouncementsList from "./components/test";
import { Link } from "react-router";

function App() {
  return (
    <div className="w-full h-full flex-col">
      <Navbar />
      <div className="h-[50vh] bg-gradient-to-br from-secondary-800 to-secondary-600 font-sans text-white p-10 flex flex-col place-items-center place-content-center">
        <div className="max-w-[1280px] place-items-center place-content-center">
          <h1 className="font-bold m-5">An organized life starts here.</h1>
          <h2 className="m-3 w-[75%]">
            Calendshare makes it easy to coordinate schedules with friends,
            family, and coworkers while giving helpful insights on your time
          </h2>
          <button className="bg-accent-500 font-semibold p-3 pl-4 pr-4 rounded-full text-2xl mt-5">
            <Link to="/register">Get Started</Link>
          </button>
        </div>
      </div>
      <div className="w-full place-content-center place-items-center bg-card-500">
        <div className="flex flex-row place-items-center place-content-between p-5 gap-5 h-[40vh] max-w-[1280px] ">
          <Card
            logo="calendar_month"
            title="Intuitive Calendar View"
            text="Easily view your schedule with different views and identify which events are coming up at a glance"
          />
          <Card
            logo="groups"
            title="Seamless Sharing & Collaboration"
            text="Share calendars with groups, friends, or family with fine grained control over what they see"
          />
          <Card
            logo="3p"
            title="Smart Availability Finder"
            text="Quickly find the best time to meet by seeing your friends' availability"
          />
        </div>
      </div>
      <div className="bg-secondary-900 flex flex-row ">
        <div className="max-w-[1280px] text-white text-xs p-3 pr-5 ml-auto">
          <div>Contact me @angelinasuy3@gmail.com for any inquiries</div>
        </div>
      </div>
    </div>
  );
}

export default App;
