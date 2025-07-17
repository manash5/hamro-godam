'use client';

import React from "react";
import { ContinuousCalendar } from "../../../../components/ContinuousCalendar";
import Sidebar from "@/components/employee/sidebar";

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarPage() {

  const onClickHandler = (day, month, year) => {
    const snackMessage = `Clicked on ${monthNames[month]} ${day}, ${year}`;
    console.log(snackMessage); 
  }

  return (
    <div className="relative flex h-screen max-h-screen w-full  gap-4  items-center justify-start bg-slate-100 ">
      <Sidebar/>
      <div className="relative ">
        <ContinuousCalendar onClick={onClickHandler} />
      </div>
    </div>
  );
}