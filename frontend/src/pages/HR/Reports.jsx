import { useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Reports() {
  const navigate = useNavigate();
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const exportCsv = async () => {
    const response = await api.get(`/hr/reports/absences.csv?month=${month}&year=${year}`, { responseType: "blob" });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a"); link.href = url; link.download = `absences-${year}-${month}.csv`; link.click(); URL.revokeObjectURL(url);
  };
  return <main className="min-h-screen bg-[#F3F0E8] text-[#111111] px-6 md:px-10 py-8"><button onClick={() => navigate("/hr")} className="flex items-center gap-2 text-xs font-bold"><ArrowLeft size={15} /> DASHBOARD</button><header className="my-10"><p className="text-[9px] tracking-[0.4em] text-black/40">HR / PAIE</p><h1 className="text-6xl md:text-8xl font-black tracking-[-0.08em] mt-3">REPORTS<span className="text-black/20">.</span></h1></header><div className="max-w-xl border border-black/10 p-6 flex flex-col sm:flex-row gap-4 items-end"><label className="text-xs font-bold flex-1">MOIS<input type="number" min="1" max="12" value={month} onChange={(event) => setMonth(event.target.value)} className="mt-2 w-full border-b border-black/20 bg-transparent p-2" /></label><label className="text-xs font-bold flex-1">ANNEE<input type="number" value={year} onChange={(event) => setYear(event.target.value)} className="mt-2 w-full border-b border-black/20 bg-transparent p-2" /></label><button onClick={exportCsv} className="bg-black text-white px-5 py-3 text-xs font-bold flex gap-2"><Download size={15} /> EXPORT CSV</button></div></main>;
}
