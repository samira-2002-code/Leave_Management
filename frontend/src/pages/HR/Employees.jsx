import { useEffect, useState } from "react";
import { ArrowLeft, Search, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Employees() {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/hr/employees")
            .then((data) => {
                setEmployees(data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    const filteredEmployees = employees.filter((employee) =>
        employee.name?.toLowerCase().includes(search.toLowerCase()) ||
        employee.email?.toLowerCase().includes(search.toLowerCase())
    );

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
                        HR / PEOPLE
                    </p>

                    <h1 className="text-6xl md:text-8xl font-black tracking-[-0.08em] mt-3">
                        EMPLOYEES<span className="text-black/20">.</span>
                    </h1>
                </div>

                <div className="flex items-center gap-3 border-b border-black/20 pb-4 mb-8 max-w-xl">
                    <Search size={18} strokeWidth={1.5} />

                    <input
                        type="text"
                        placeholder="SEARCH EMPLOYEE..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent outline-none text-xs tracking-widest w-full"
                    />
                </div>

                {loading ? (
                    <p className="text-sm text-black/40">
                        LOADING...
                    </p>
                ) : (
                    <div className="border-t border-black/15">

                        {filteredEmployees.map((employee) => (
                            <div
                                key={employee.id}
                                className="py-6 border-b border-black/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >

                                <div className="flex items-center gap-4">

                                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                                        <Users size={18} />
                                    </div>

                                    <div>
                                        <p className="font-black">
                                            {employee.name}
                                        </p>

                                        <p className="text-xs text-black/40 mt-1">
                                            {employee.email}
                                        </p>
                                    </div>

                                </div>

                                <div className="text-left md:text-right">

                                    <p className="text-[9px] tracking-widest text-black/40">
                                        DEPARTMENT
                                    </p>

                                    <p className="text-sm font-bold mt-1">
                                        {employee.department?.name || "—"}
                                    </p>

                                </div>

                            </div>
                        ))}

                        {filteredEmployees.length === 0 && (
                            <p className="py-10 text-center text-sm text-black/40">
                                NO EMPLOYEES FOUND
                            </p>
                        )}

                    </div>
                )}

            </main>
        </div>
    );
}

export default Employees;