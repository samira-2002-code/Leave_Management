import { useEffect, useMemo, useState } from "react";

import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    CircleUserRound,
    Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import api from "../services/api";

const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
];

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function Dashboard() {
    const today = useMemo(() => new Date(), []);
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [selectedDay, setSelectedDay] = useState(null);
    const [profile, setProfile] = useState(null);
    const [balances, setBalances] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const year = today.getFullYear();

    useEffect(() => {
        Promise.all([
            api.get("/auth/profile"),
            api.get("/leave-balances"),
            api.get("/leave-requests"),
        ]).then(([profileResponse, balancesResponse, requestsResponse]) => {
            setProfile({ ...profileResponse.data.user, roles: profileResponse.data.roles || [] });
            setBalances(balancesResponse.data.balances || []);
            setRequests(requestsResponse.data.requests || []);
        }).catch((requestError) => {
            setError(requestError.response?.data?.message || "Impossible de charger votre espace.");
        }).finally(() => setLoading(false));
    }, []);

    const availableDays = balances.reduce((total, balance) => total + Number(balance.remaining_days || 0), 0);
    const leaveHistory = useMemo(() => requests.reduce((history, request) => {
        if (request.status !== "approved") return history;
        const month = new Date(request.start_date).getMonth() + 1;
        const existing = history.find((item) => item.month === month);
        if (existing) existing.days += Number(request.duration || 0);
        else history.push({ month, days: Number(request.duration || 0) });
        return history;
    }, []), [requests]);
    const nextBreak = useMemo(() => requests.filter((request) => new Date(request.start_date) >= today && ["approved", "pending_manager", "pending_hr"].includes(request.status)).sort((a, b) => new Date(a.start_date) - new Date(b.start_date))[0], [requests, today]);

    const firstDay = new Date(year, currentMonth, 1);
    let startDay = firstDay.getDay();

    startDay = startDay === 0 ? 6 : startDay - 1;

    const daysInMonth = new Date(
        year,
        currentMonth + 1,
        0
    ).getDate();

    const calendarDays = [];

    for (let i = 0; i < startDay; i++) {
        calendarDays.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    const previousMonth = () => {
        setCurrentMonth((value) => Math.max(0, value - 1));
        setSelectedDay(null);
    };

    const nextMonth = () => {
        setCurrentMonth((value) => Math.min(11, value + 1));
        setSelectedDay(null);
    };

    return (
        <div className="min-h-screen bg-[#F3F0E8] text-[#111111]">

            {/* TOP NAV */}
            <header className="px-6 md:px-10 py-6 border-b border-black/10">

                <div className="max-w-375 mx-auto flex justify-between items-center">

                    <div>
                        <div className="font-black tracking-[0.45em] text-sm">
                            TIME DNA
                        </div>

                        <div className="text-[9px] tracking-[0.35em] text-black/40 mt-1">
                            YOUR TIME HAS A SHAPE
                        </div>
                    </div>

                    <div className="flex items-center gap-5">

                        <div className="hidden md:block text-right">
                            <p className="text-xs font-bold">{profile?.name || "COLLABORATEUR"}</p>

                            <p className="text-[9px] tracking-widest text-black/40">
                                {profile?.roles?.[0] || "EMPLOYEE"}
                            </p>
                        </div>

                        <CircleUserRound
                            size={32}
                            strokeWidth={1.3}
                        />

                        <button onClick={async () => { await api.post("/auth/logout"); localStorage.clear(); navigate("/login"); }} className="hidden md:block text-[9px] tracking-[0.25em]">
                            LOG OUT
                        </button>

                    </div>

                </div>

            </header>

            <main className="max-w-375 mx-auto px-6 md:px-10 py-10">

                {/* HERO */}
                <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-end">

                    <div>

                        <p className="text-[10px] tracking-[0.5em] text-black/40 mb-5">
                            {today.toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).toUpperCase()}
                        </p>

                        <h1 className="text-[clamp(4rem,10vw,10rem)] leading-[0.78] tracking-[-0.08em] font-black">
                            YOUR
                            <br />
                            TIME<span className="text-black/20">.</span>
                        </h1>

                    </div>

                    {/* ORBIT */}
                    <div className="flex justify-center lg:justify-end">

                        <div className="relative w-64 h-64">

                            <div className="absolute inset-0 border border-black/20 rounded-full" />

                            <div className="absolute inset-7 border border-black/10 rounded-full" />

                            <div className="absolute inset-14 bg-[#111] text-white rounded-full flex flex-col justify-center items-center">

                                <span className="text-[9px] tracking-[0.4em] text-white/40">
                                    AVAILABLE
                                </span>

                                <span className="text-6xl font-black tracking-[-0.07em] mt-2">
                                    {loading ? "—" : availableDays}
                                </span>

                                <span className="text-[9px] tracking-[0.35em] text-white/50">
                                    DAYS
                                </span>

                            </div>

                            <div className="absolute top-1/2 -right-2 w-4 h-4 bg-[#111] rounded-full" />

                        </div>

                    </div>

                </section>

                {/* YEAR TIMELINE */}
                <section className="mt-20">

                    <div className="flex justify-between items-end mb-5">

                        <div>
                            <p className="text-[9px] tracking-[0.4em] text-black/40">
                                YOUR YEAR
                            </p>

                            <h2 className="text-2xl font-black mt-2">
                                TIME MAP / {year}
                            </h2>
                        </div>

                        <span className="text-[9px] tracking-widest text-black/40">
                            YOU ARE HERE →
                        </span>

                    </div>

                    <div className="relative h-20 border-t border-b border-black/15 flex items-center">

                        <div className="absolute left-[70%] top-0 bottom-0 border-l border-black" />

                        <div className="w-full grid grid-cols-12">

                            {months.map((month, index) => {

                                const history = leaveHistory.find(
                                    (item) => item.month === index + 1
                                );

                                return (
                                    <div
                                        key={month}
                                        className="relative h-20 flex items-center justify-center"
                                    >

                                        {history && (
                                            <div
                                                className="absolute bottom-2 w-0.75 bg-black"
                                                style={{
                                                    height: `${history.days * 9}px`,
                                                }}
                                            />
                                        )}

                                        <span
                                            className={`text-[9px] tracking-widest ${index === currentMonth
                                                ? "font-black"
                                                : "text-black/35"
                                                }`}
                                        >
                                            {month}
                                        </span>

                                    </div>
                                );
                            })}

                        </div>

                    </div>

                </section>

                {/* LOWER AREA */}
                <section className="mt-16 grid lg:grid-cols-[0.9fr_1.1fr] gap-10">

                    {/* TIME PULSE */}
                    <div>

                        <div className="flex justify-between items-end mb-5">

                            <div>
                                <p className="text-[9px] tracking-[0.4em] text-black/40">
                                    ACTIVITY
                                </p>

                                <h2 className="text-2xl font-black mt-2">
                                    TIME PULSE
                                </h2>
                            </div>

                            <Sparkles size={18} strokeWidth={1.5} />

                        </div>

                        <div className="h-52 border border-black/10 bg-[#E9E5DC] relative overflow-hidden">

                            <svg
                                viewBox="0 0 800 200"
                                className="absolute inset-0 w-full h-full"
                                preserveAspectRatio="none"
                            >

                                <path
                                    d="M0 130
                     C70 130 70 80 140 110
                     S210 150 280 100
                     S350 60 420 120
                     S500 150 560 90
                     S640 70 700 105
                     S760 130 800 75"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />

                            </svg>

                            <div className="absolute bottom-5 left-5 text-[9px] tracking-[0.3em] text-black/40">
                                JAN — SEP
                            </div>

                        </div>

                    </div>

                    {/* CALENDAR */}
                    <div>

                        <div className="flex justify-between items-end mb-5">

                            <div>
                                <p className="text-[9px] tracking-[0.4em] text-black/40">
                                    PLAN YOUR NEXT BREAK
                                </p>

                                <h2 className="text-2xl font-black mt-2">
                                    {months[currentMonth]} {year}
                                </h2>
                            </div>

                            <div className="flex gap-2">

                                <button
                                    onClick={previousMonth}
                                    className="w-9 h-9 border border-black/15 flex items-center justify-center hover:bg-black hover:text-white transition"
                                >
                                    <ChevronLeft size={15} />
                                </button>

                                <button
                                    onClick={nextMonth}
                                    className="w-9 h-9 border border-black/15 flex items-center justify-center hover:bg-black hover:text-white transition"
                                >
                                    <ChevronRight size={15} />
                                </button>

                            </div>

                        </div>

                        <div className="border-t border-black/15">

                            <div className="grid grid-cols-7 border-b border-black/10">

                                {weekDays.map((day) => (
                                    <div
                                        key={day}
                                        className="py-3 text-center text-[8px] tracking-widest text-black/35"
                                    >
                                        {day}
                                    </div>
                                ))}

                            </div>

                            <div className="grid grid-cols-7">

                                {calendarDays.map((day, index) => {

                                    const isToday = currentMonth === today.getMonth() && day === today.getDate();

                                    const isSelected =
                                        selectedDay === day;

                                    return (
                                        <button
                                            key={index}
                                            disabled={!day}
                                            onClick={() => setSelectedDay(day)}
                                            className={`
                        h-14 border-r border-b border-black/10
                        text-xs transition
                        relative
                        ${!day
                                                    ? "bg-transparent cursor-default"
                                                    : "hover:bg-black hover:text-white"
                                                }
                        ${isSelected
                                                    ? "bg-black text-white"
                                                    : ""
                                                }
                      `}
                                        >

                                            {day}

                                            {isToday && (
                                                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full" />
                                            )}

                                        </button>
                                    );

                                })}

                            </div>

                        </div>

                    </div>

                </section>

                {/* NEXT BREAK */}
                <section className="mt-16 border-t border-black/15 pt-8 flex flex-col md:flex-row justify-between gap-6">

                    <div>

                        <p className="text-[9px] tracking-[0.4em] text-black/40">
                            NEXT BREAK
                        </p>

                        <div className="flex items-center gap-5 mt-3">

                                <span className="text-4xl font-black">{nextBreak ? `${nextBreak.start_date}—${nextBreak.end_date}` : "—"}</span>

                            <span className="text-xs tracking-[0.3em]">{nextBreak?.leaveType?.name || "NO UPCOMING LEAVE"}</span>

                        </div>

                    </div>

                    <button
                        onClick={() => navigate("/leave-request")}
                        className="group flex items-center gap-3 bg-black text-white px-6 py-4 text-[9px] tracking-[0.3em] font-bold"
                    >
                        DESIGN YOUR BREAK

                        <ArrowRight
                            size={16}
                            className="group-hover:translate-x-2 transition-transform"
                        />
                    </button>

                    <button
                        onClick={() => navigate("/requests")}
                        className="text-[9px] tracking-[0.3em] font-bold hover:underline"
                    >
                        VIEW YOUR REQUESTS →
                    </button>
                </section>

                {error && <p className="mt-6 border-l-2 border-black pl-4 text-sm">{error}</p>}

            </main>

        </div>
    );
}

export default Dashboard;

