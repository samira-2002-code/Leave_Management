import { useEffect, useState } from "react";
import { ArrowLeft, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function LeaveBalances() {
    const navigate = useNavigate();

    const [balances, setBalances] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/hr/leave-balances")
            .then((data) => {
                setBalances(data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

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
                        HR / LEAVE BALANCES
                    </p>

                    <h1 className="text-6xl md:text-8xl font-black tracking-[-0.08em] mt-3">
                        BALANCES<span className="text-black/20">.</span>
                    </h1>
                </div>

                {loading ? (
                    <p className="text-sm text-black/40">
                        LOADING...
                    </p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

                        {balances.map((balance) => {

                            const total = Number(balance.total_days || 0);
                            const used = Number(balance.used_days || 0);
                            const remaining = total - used;

                            return (
                                <div
                                    key={balance.id}
                                    className="border border-black/10 p-6 bg-[#E9E5DC]"
                                >

                                    <div className="flex justify-between">

                                        <div>
                                            <p className="font-black">
                                                {balance.user?.name || "Unknown"}
                                            </p>

                                            <p className="text-[9px] tracking-widest text-black/40 mt-2">
                                                {balance.leaveType?.name || "Leave"}
                                            </p>
                                        </div>

                                        <Wallet
                                            size={20}
                                            strokeWidth={1.5}
                                        />

                                    </div>

                                    <div className="grid grid-cols-3 gap-2 mt-10">

                                        <div>
                                            <p className="text-2xl font-black">
                                                {total}
                                            </p>

                                            <p className="text-[8px] tracking-widest text-black/40">
                                                TOTAL
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-2xl font-black">
                                                {used}
                                            </p>

                                            <p className="text-[8px] tracking-widest text-black/40">
                                                USED
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-2xl font-black">
                                                {remaining}
                                            </p>

                                            <p className="text-[8px] tracking-widest text-black/40">
                                                LEFT
                                            </p>
                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </main>
        </div>
    );
}

export default LeaveBalances;