import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import api from "../../services/api";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const response = await api.get("/notifications");
    setNotifications(response.data);
  };

  useEffect(() => { Promise.resolve().then(load).catch(() => {}); }, []);

  const unread = notifications.filter((notification) => !notification.read_at).length;
  const markAll = async () => {
    await api.post("/notifications/read-all");
    await load();
  };

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    await load();
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen((value) => !value)} className="relative p-2" aria-label="Notifications">
        <Bell size={19} />
        {unread > 0 && <span className="absolute -right-1 -top-1 min-w-5 h-5 px-1 rounded-full bg-black text-white text-[10px] flex items-center justify-center">{unread}</span>}
      </button>
      {open && <div className="absolute right-0 top-11 z-20 w-80 bg-[#F3F0E8] border border-black/15 shadow-lg p-4">
        <div className="flex justify-between items-center mb-3"><strong>Notifications</strong><button onClick={markAll} className="text-xs underline">Tout lire</button></div>
        {notifications.length === 0 ? <p className="text-sm text-black/50">Aucune notification.</p> : notifications.map((notification) => <button key={notification.id} onClick={() => markRead(notification.id)} className={`w-full text-left p-3 border-t border-black/10 text-sm ${notification.read_at ? "opacity-50" : "font-semibold"}`}><span className="flex gap-2"><Check size={15} />{notification.data?.message || "Nouvelle notification"}</span></button>)}
      </div>}
    </div>
  );
}
