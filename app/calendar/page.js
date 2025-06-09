'use client';

import React from "react";
import { ContinuousCalendar } from "../components/ContinuousCalendar";
import Sidebar from '../components/sidebar'

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarPage() {
  // If you need snack functionality, uncomment and properly import:
  // const { createSnack } = useSnack();

  const onClickHandler = (day, month, year) => {
    const snackMessage = `Clicked on ${monthNames[month]} ${day}, ${year}`;
    console.log(snackMessage); // Replace with createSnack if needed
    // createSnack(snackMessage, 'success');
  }

  return (
    <div className="relative flex h-screen max-h-screen w-full  gap-4  items-center justify-start bg-slate-200 ">
      <Sidebar/>
      <div className="relative ">
        <ContinuousCalendar onClick={onClickHandler} />
      </div>
    </div>
  );
}