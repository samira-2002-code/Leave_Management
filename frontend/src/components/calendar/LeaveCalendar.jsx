import { useEffect, useState } from "react";
import api from "../../services/api";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function LeaveCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.resolve().then(() => api.get("/hr/calendar")).then((response) => setEvents(response.data)).catch(() => setEvents([])).finally(() => setLoading(false));
  }, []);

  return <section className="border-t border-black/15 pt-5">{loading ? <p className="py-8 text-sm text-black/50">Chargement...</p> : <FullCalendar plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} initialView="dayGridMonth" headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }} events={events} height="auto" />}</section>;
}
