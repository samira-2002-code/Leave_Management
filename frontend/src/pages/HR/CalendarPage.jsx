import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LeaveCalendar from "../../components/calendar/LeaveCalendar";

export default function CalendarPage() {
  const navigate = useNavigate();
  return <main className="min-h-screen bg-[#F3F0E8] text-[#111111] px-6 md:px-10 py-8"><button onClick={() => navigate("/hr")} className="flex items-center gap-2 text-xs font-bold"><ArrowLeft size={15} /> DASHBOARD</button><header className="my-10"><p className="text-[9px] tracking-[0.4em] text-black/40">HR / PLANNING</p><h1 className="text-6xl md:text-8xl font-black tracking-[-0.08em] mt-3">CALENDAR<span className="text-black/20">.</span></h1></header><LeaveCalendar /></main>;
}
