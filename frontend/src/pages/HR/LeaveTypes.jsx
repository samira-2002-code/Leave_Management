import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function LeaveTypes() {
    const navigate = useNavigate();

    const [leaveTypes, setLeaveTypes] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [defaultDays, setDefaultDays] = useState("");

    const loadLeaveTypes = () => {
        api.get("/hr/leave-types")
            .then((response) => setLeaveTypes(response.data))
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        loadLeaveTypes();
    }, []);

    const addLeaveType = async (e) => {
        e.preventDefault();

        if (!name) {
            return;
        }

        const response = await api.post("/hr/leave-types", {
                    name,
                    description,
                    default_days: defaultDays || 0,
                    requires_document: false,
                    is_half_day_allowed: true,
                });

        if (response.status === 201) {
            setName("");
            setDescription("");
            setDefaultDays("");
            loadLeaveTypes();
        }
    };

    const deleteLeaveType = async (id) => {
        const confirmed = window.confirm(
            "Delete this leave type?"
        );

        if (!confirmed) {
            return;
        }

        const response = await api.delete(`/hr/leave-types/${id}`);

        if (response.status === 200) {
            loadLeaveTypes();
        }
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
                        HR / CONFIGURATION
                    </p>

                    <h1 className="text-6xl md:text-8xl font-black tracking-[-0.08em] mt-3">
                        LEAVE TYPES<span className="text-black/20">.</span>
                    </h1>
                </div>


                {/* ADD */}
                <form
                    onSubmit={addLeaveType}
                    className="bg-[#E9E5DC] p-6 mb-12"
                >

                    <div className="grid md:grid-cols-3 gap-4">

                        <input
                            type="text"
                            placeholder="NAME"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-transparent border-b border-black/20 p-3 outline-none text-xs tracking-widest"
                        />

                        <input
                            type="text"
                            placeholder="DESCRIPTION"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            className="bg-transparent border-b border-black/20 p-3 outline-none text-xs tracking-widest"
                        />

                        <input
                            type="number"
                            placeholder="DEFAULT DAYS"
                            value={defaultDays}
                            onChange={(e) =>
                                setDefaultDays(e.target.value)
                            }
                            className="bg-transparent border-b border-black/20 p-3 outline-none text-xs tracking-widest"
                        />

                    </div>

                    <button
                        type="submit"
                        className="mt-6 bg-black text-white px-6 py-4 flex items-center gap-2 text-[9px] tracking-[0.3em] font-bold"
                    >
                        <Plus size={15} />
                        ADD LEAVE TYPE
                    </button>

                </form>


                {/* LIST */}
                <div className="border-t border-black/15">

                    {leaveTypes.map((type) => (
                        <div
                            key={type.id}
                            className="py-6 border-b border-black/10 flex justify-between items-center"
                        >

                            <div>
                                <p className="font-black">
                                    {type.name}
                                </p>

                                <p className="text-xs text-black/40 mt-1">
                                    {type.description || "No description"}
                                </p>
                            </div>

                            <div className="flex items-center gap-6">

                                <span className="text-[9px] tracking-widest text-black/40">
                                    {type.default_days} DAYS
                                </span>

                                <button
                                    onClick={() =>
                                        deleteLeaveType(type.id)
                                    }
                                    className="hover:text-black/50"
                                >
                                    <Trash2 size={17} />
                                </button>

                            </div>

                        </div>
                    ))}

                </div>

            </main>
        </div>
    );
}

export default LeaveTypes;