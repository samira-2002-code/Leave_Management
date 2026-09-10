import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function LeaveRequests() {
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [rejecting, setRejecting] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");

    const loadRequests = async () => {
        try {
            const response = await api.get("/hr/leave-requests");
            setRequests(response.data);
        } catch {
            setError("Impossible de charger les demandes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        Promise.resolve().then(loadRequests);
    }, []);

    const approve = async (id) => {
        setProcessing(id);
        setError("");
        try {
            await api.patch(`/hr/leave-requests/${id}/approve`);
            setSuccess("Demande approuvée.");
            await loadRequests();
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Action impossible.");
        } finally {
            setProcessing(null);
        }
    };

    const reject = async () => {
        setProcessing(rejecting.id);
        try {
            await api.patch(`/hr/leave-requests/${rejecting.id}/reject`, { rejection_reason: rejectionReason });
            setSuccess("Demande refusée.");
            setRejecting(null);
            setRejectionReason("");
            await loadRequests();
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Motif obligatoire.");
        } finally {
            setProcessing(null);
        }
    };

    const statusClass = (status) => {
        if (status === "approved") {
            return "bg-black text-white";
        }

        if (status === "rejected") {
            return "bg-black/10";
        }

        return "border border-black/20";
    };

    return (
        <div className="min-h-screen bg-[#F3F0E8] text-[#111111]">

            <header className="px-6 md:px-10 py-6 border-b border-black/10">
                <div className="max-w-375 mx-auto flex justify-between items-center">

                    <div>
                        <div className="font-black tracking-[0.45em] text-sm">
                            TIME DNA
                        </div>

                        <div className="text-[9px] tracking-[0.35em] text-black/40 mt-1">
                            HUMAN RESOURCES
                        </div>
                    </div>

                    <button
                        onClick={() => navigate("/hr")}
                        className="flex items-center gap-2 text-[9px] tracking-[0.25em] font-bold"
                    >
                        <ArrowLeft size={15} />
                        DASHBOARD
                    </button>

                </div>
            </header>

            <main className="max-w-375 mx-auto px-6 md:px-10 py-10">

                <div className="mb-10">
                    <p className="text-[9px] tracking-[0.4em] text-black/40">
                        HR / LEAVE MANAGEMENT
                    </p>

                    <h1 className="text-6xl md:text-8xl font-black tracking-[-0.08em] mt-3">
                        REQUESTS<span className="text-black/20">.</span>
                    </h1>
                </div>

                {loading ? (
                    <p className="text-sm text-black/40">
                        LOADING...
                    </p>
                ) : (
                    <div className="border-t border-black/15">

                        {(error || success) && <p className="py-4 text-sm font-bold">{error || success}</p>}

                        {requests.map((request) => (
                            <div
                                key={request.id}
                                className="py-6 border-b border-black/10 grid md:grid-cols-[1fr_1fr_auto] gap-5 items-center"
                            >

                                <div>
                                    <p className="font-black">
                                        {request.user?.name || "Unknown"}
                                    </p>

                                    <p className="text-xs text-black/40 mt-1">
                                        {request.leaveType?.name || "Leave"}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">

                                    <Clock size={16} strokeWidth={1.5} />

                                    <div>
                                        <p className="text-sm font-bold">
                                            {request.start_date}
                                        </p>

                                        <p className="text-xs text-black/40">
                                            → {request.end_date}
                                        </p>
                                    </div>

                                </div>

                                <div className="flex items-center gap-3">
                                {request.status === "pending_hr" && (
                                    <>
                                    <button disabled={processing === request.id} onClick={() => approve(request.id)} className="p-2 bg-black text-white disabled:opacity-40" title="Approuver"><Check size={16} /></button>
                                    <button disabled={processing === request.id} onClick={() => setRejecting(request)} className="p-2 border border-black disabled:opacity-40" title="Refuser"><X size={16} /></button>
                                    </>
                                )}
                                <span
                                    className={`px-4 py-2 text-[8px] tracking-[0.25em] font-bold uppercase ${statusClass(
                                        request.status
                                    )}`}
                                >
                                    {request.status}
                                </span>
                                </div>

                            </div>
                        ))}

                        {requests.length === 0 && (
                            <p className="py-10 text-center text-black/40">
                                NO REQUESTS
                            </p>
                        )}

                    </div>
                )}

                {rejecting && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6">
                        <div className="bg-[#F3F0E8] p-6 w-full max-w-md">
                            <h2 className="text-xl font-black">Motif du refus</h2>
                            <textarea required value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} className="mt-5 w-full border border-black/20 bg-transparent p-3" rows="4" placeholder="Expliquez le motif..." />
                            <div className="mt-5 flex justify-end gap-3">
                                <button onClick={() => setRejecting(null)} className="px-4 py-3 text-xs font-bold">ANNULER</button>
                                <button disabled={!rejectionReason.trim() || processing === rejecting.id} onClick={reject} className="bg-black text-white px-4 py-3 text-xs font-bold disabled:opacity-40">CONFIRMER</button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}

export default LeaveRequests;