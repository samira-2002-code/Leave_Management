import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Check,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Requests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const response = await api.get("/leave-requests");

        setRequests(response.data.requests || []);
      } catch (err) {
        console.error("REQUESTS ERROR:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load your requests."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  const getStatus = (status) => {
    if (status === "approved") {
      return {
        label: "APPROVED",
        icon: <Check size={14} />,
      };
    }

    if (status === "rejected") {
      return {
        label: "REJECTED",
        icon: <X size={14} />,
      };
    }

    return {
      label: "PENDING",
      icon: <Clock size={14} />,
    };
  };

  return (
    <div className="min-h-screen bg-[#F3F0E8] text-[#111]">

      {/* HEADER */}

      <header className="border-b border-black/10 px-6 md:px-10 py-6">
        <div className="max-w-375 mx-auto flex justify-between items-center">

          <button
            onClick={() => navigate("/dashboard")}
            className="text-left"
          >
            <p className="text-sm font-black tracking-[0.45em]">
              TIME DNA
            </p>

            <p className="text-[9px] tracking-[0.35em] text-black/35 mt-1">
              YOUR TIME / YOUR SPACE
            </p>
          </button>

          <button
            onClick={() => navigate("/leave-request")}
            className="flex items-center gap-3 bg-black text-white px-5 py-3 text-[9px] tracking-[0.25em] font-bold"
          >
            NEW REQUEST
            <ArrowRight size={15} />
          </button>

        </div>
      </header>


      {/* MAIN */}

      <main className="max-w-375 mx-auto px-7 md:px-12 lg:px-20 py-16">

        <div className="max-w-5xl">

          <p className="text-[9px] tracking-[0.45em] text-black/35">
            TIME HISTORY
          </p>

          <h1 className="text-6xl md:text-8xl font-black tracking-[-0.08em] leading-[0.8] mt-6">
            YOUR
            <br />
            REQUESTS<span className="text-black/20">.</span>
          </h1>

        </div>


        {/* LOADING */}

        {loading && (
          <div className="mt-20 text-xs tracking-[0.2em] text-black/40">
            LOADING YOUR TIME...
          </div>
        )}


        {/* ERROR */}

        {error && (
          <div className="mt-12 border-l-2 border-black pl-4 text-xs">
            {error}
          </div>
        )}


        {/* EMPTY */}

        {!loading &&
          !error &&
          requests.length === 0 && (
            <div className="mt-20 border-y border-black/10 py-16">

              <p className="text-sm text-black/40">
                You haven't requested any time off yet.
              </p>

              <button
                onClick={() =>
                  navigate("/leave-request")
                }
                className="mt-6 font-black text-sm underline"
              >
                DESIGN YOUR FIRST BREAK →
              </button>

            </div>
          )}


        {/* REQUESTS */}

        {!loading &&
          !error &&
          requests.length > 0 && (

            <div className="mt-16 border-t border-black/10">

              {requests.map((request, index) => {

                const status = getStatus(
                  request.status
                );

                return (
                  <div
                    key={request.id}
                    className="grid md:grid-cols-[70px_1fr_auto] gap-6 items-center py-8 border-b border-black/10"
                  >

                    <div className="text-[10px] tracking-[0.2em] text-black/30">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </div>


                    <div>

                      <p className="text-[9px] tracking-[0.3em] text-black/35">
                        {request.leaveType?.name ||
                          "LEAVE REQUEST"}
                      </p>

                      <p className="text-xl md:text-2xl font-black mt-2">
                        {request.start_date}
                        {" → "}
                        {request.end_date}
                      </p>

                      <p className="text-xs text-black/40 mt-2">
                        {request.duration} days
                      </p>

                      {request.reason && (
                        <p className="text-xs text-black/50 mt-3 max-w-xl">
                          {request.reason}
                        </p>
                      )}

                    </div>


                    <div className="flex items-center gap-2 text-[9px] tracking-[0.25em] font-bold">

                      {status.icon}

                      {status.label}

                    </div>

                  </div>
                );
              })}

            </div>
          )}

      </main>


      {/* BACK */}

      <div className="max-w-375 mx-auto px-7 md:px-12 lg:px-20 pb-12">

        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-3 text-[9px] tracking-[0.3em] font-bold"
        >
          <ArrowLeft size={15} />
          BACK TO DASHBOARD
        </button>

      </div>

    </div>
  );
}

export default Requests;