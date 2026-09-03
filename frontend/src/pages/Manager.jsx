import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Search,
  Users,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Manager() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/leave-requests");

      setRequests(response.data.requests || []);
    } catch (err) {
      console.error("MANAGER REQUESTS ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load leave requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const pendingRequests = useMemo(
    () =>
      requests.filter(
        (request) => request.status === "pending"
      ),
    [requests]
  );

  const approvedRequests = useMemo(
    () =>
      requests.filter(
        (request) => request.status === "approved"
      ),
    [requests]
  );

  const rejectedRequests = useMemo(
    () =>
      requests.filter(
        (request) => request.status === "rejected"
      ),
    [requests]
  );

  const filteredRequests = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return requests;
    }

    return requests.filter((request) => {
      const employeeName =
        request.user?.name?.toLowerCase() || "";

      const leaveType =
        request.leave_type?.name?.toLowerCase() || "";

      return (
        employeeName.includes(value) ||
        leaveType.includes(value) ||
        request.status?.toLowerCase().includes(value)
      );
    });
  }, [requests, search]);

  const handleApprove = async (request) => {
    try {
      setProcessing(true);
      setError("");

      await api.patch(
        `/leave-requests/${request.id}/approve`
      );

      setSelectedRequest(null);

      await loadRequests();
    } catch (err) {
      console.error("APPROVE ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to approve this request."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (request) => {
    try {
      setProcessing(true);
      setError("");

      await api.patch(
        `/leave-requests/${request.id}/reject`
      );

      setSelectedRequest(null);

      await loadRequests();
    } catch (err) {
      console.error("REJECT ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to reject this request."
      );
    } finally {
      setProcessing(false);
    }
  };

  const getStatus = (status) => {
    if (status === "approved") {
      return {
        label: "APPROVED",
        icon: <Check size={13} />,
      };
    }

    if (status === "rejected") {
      return {
        label: "REJECTED",
        icon: <X size={13} />,
      };
    }

    return {
      label: "PENDING",
      icon: <Clock3 size={13} />,
    };
  };

  return (
    <div className="min-h-screen bg-[#F3F0E8] text-[#111]">

      {/* HEADER */}

      <header className="border-b border-black/10 px-6 md:px-10 py-6">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">

          <button
            onClick={() => navigate("/dashboard")}
            className="text-left"
          >
            <p className="text-sm font-black tracking-[0.45em]">
              TIME DNA
            </p>

            <p className="text-[9px] tracking-[0.35em] text-black/35 mt-1">
              MANAGER / TIME CONTROL
            </p>
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-[9px] tracking-[0.3em] font-bold hover:underline"
          >
            <ArrowLeft size={14} />
            DASHBOARD
          </button>

        </div>
      </header>


      {/* MAIN */}

      <main className="max-w-[1500px] mx-auto px-7 md:px-12 lg:px-20 py-16">

        {/* TITLE */}

        <section className="grid lg:grid-cols-[1fr_0.8fr] gap-12 items-end">

          <div>

            <p className="text-[9px] tracking-[0.45em] text-black/35">
              MANAGER SPACE
            </p>

            <h1 className="text-6xl md:text-8xl font-black tracking-[-0.09em] leading-[0.78] mt-6">
              TIME
              <br />
              CONTROL<span className="text-black/20">.</span>
            </h1>

            <p className="text-sm text-black/40 max-w-md mt-8 leading-relaxed">
              Manage your team's time.
              Review requests, approve breaks
              and keep the organization moving.
            </p>

          </div>


          {/* DNA VISUAL */}

          <div className="hidden lg:block">

            <p className="text-[9px] tracking-[0.35em] text-black/30 mb-5">
              TEAM TIME DNA
            </p>

            <svg
              viewBox="0 0 700 160"
              className="w-full"
            >

              <path
                d="
                  M0 80
                  C70 15 140 145 210 80
                  C280 15 350 145 420 80
                  C490 15 560 145 630 80
                  C660 55 680 105 700 80
                "
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />

              <path
                d="
                  M0 80
                  C70 145 140 15 210 80
                  C280 145 350 15 420 80
                  C490 145 560 15 630 80
                  C660 105 680 55 700 80
                "
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.18"
              />

            </svg>

          </div>

        </section>


        {/* STATS */}

        <section className="grid md:grid-cols-3 border-y border-black/10 mt-20">

          <div className="p-7 md:p-9 border-b md:border-b-0 md:border-r border-black/10">

            <div className="flex justify-between items-start">

              <p className="text-[9px] tracking-[0.3em] text-black/35">
                NEED ATTENTION
              </p>

              <Clock3 size={16} />

            </div>

            <p className="text-6xl font-black tracking-[-0.07em] mt-7">
              {pendingRequests.length}
            </p>

            <p className="text-xs text-black/40 mt-2">
              pending requests
            </p>

          </div>


          <div className="p-7 md:p-9 border-b md:border-b-0 md:border-r border-black/10">

            <div className="flex justify-between items-start">

              <p className="text-[9px] tracking-[0.3em] text-black/35">
                APPROVED
              </p>

              <Check size={16} />

            </div>

            <p className="text-6xl font-black tracking-[-0.07em] mt-7">
              {approvedRequests.length}
            </p>

            <p className="text-xs text-black/40 mt-2">
              approved requests
            </p>

          </div>


          <div className="p-7 md:p-9">

            <div className="flex justify-between items-start">

              <p className="text-[9px] tracking-[0.3em] text-black/35">
                TEAM REQUESTS
              </p>

              <Users size={16} />

            </div>

            <p className="text-6xl font-black tracking-[-0.07em] mt-7">
              {requests.length}
            </p>

            <p className="text-xs text-black/40 mt-2">
              total requests
            </p>

          </div>

        </section>


        {/* ERROR */}

        {error && (
          <div className="mt-10 border-l-2 border-black pl-4 text-xs text-black/60">
            {error}
          </div>
        )}


        {/* REQUEST AREA */}

        <section className="mt-20">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">

            <div>

              <p className="text-[9px] tracking-[0.45em] text-black/35">
                REQUEST RADAR
              </p>

              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.06em] mt-4">
                EMPLOYEE TIME
              </h2>

            </div>


            {/* SEARCH */}

            <div className="flex items-center border-b border-black/20 pb-3 w-full md:w-72">

              <Search
                size={16}
                className="mr-3 text-black/35"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search employee..."
                className="w-full bg-transparent outline-none text-sm placeholder:text-black/25"
              />

            </div>

          </div>


          {/* REQUEST LIST */}

          <div className="mt-12 border-t border-black/10">

            {loading ? (

              <div className="py-20 text-center">

                <p className="text-[9px] tracking-[0.35em] text-black/35">
                  READING TEAM TIME...
                </p>

              </div>

            ) : filteredRequests.length === 0 ? (

              <div className="py-20 border-b border-black/10">

                <p className="text-sm text-black/40">
                  No requests found.
                </p>

              </div>

            ) : (

              filteredRequests.map((request, index) => {

                const status = getStatus(
                  request.status
                );

                return (

                  <button
                    key={request.id}
                    type="button"
                    onClick={() =>
                      setSelectedRequest(request)
                    }
                    className="w-full text-left grid md:grid-cols-[70px_1fr_auto_auto] gap-6 items-center py-7 border-b border-black/10 hover:bg-white/50 transition px-2"
                  >

                    <span className="text-[10px] tracking-[0.2em] text-black/25">
                      {String(index + 1).padStart(2, "0")}
                    </span>


                    <div>

                      <p className="text-[9px] tracking-[0.3em] text-black/35">
                        {request.leave_type?.name ||
                          "LEAVE REQUEST"}
                      </p>

                      <p className="text-lg md:text-xl font-black mt-2">
                        {request.user?.name ||
                          "Employee"}
                      </p>

                      <p className="text-xs text-black/40 mt-1">
                        {request.start_date}
                        {" → "}
                        {request.end_date}
                        {" · "}
                        {request.duration} days
                      </p>

                    </div>


                    <div className="text-right hidden md:block">

                      <p className="text-[9px] tracking-[0.25em] text-black/30">
                        DEPARTMENT
                      </p>

                      <p className="text-xs font-bold mt-2">
                        {request.user?.department?.name ||
                          "—"}
                      </p>

                    </div>


                    <div className="flex items-center gap-2 text-[9px] tracking-[0.2em] font-bold">

                      {status.icon}

                      {status.label}

                    </div>

                  </button>

                );
              })

            )}

          </div>

        </section>


        {/* REJECTED */}

        <section className="mt-20">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-[9px] tracking-[0.45em] text-black/35">
                ARCHIVE
              </p>

              <h2 className="text-3xl font-black tracking-[-0.05em] mt-3">
                REJECTED TIME
              </h2>

            </div>

            <p className="text-4xl font-black">
              {rejectedRequests.length}
            </p>

          </div>

        </section>

      </main>


      {/* REQUEST DETAIL */}

      {selectedRequest && (

        <div className="fixed inset-0 z-50 bg-black/30 flex items-end md:items-center justify-center p-4">

          <div className="bg-[#F3F0E8] w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}

            <div className="border-b border-black/10 px-7 md:px-10 py-6 flex items-center justify-between">

              <div>

                <p className="text-[9px] tracking-[0.35em] text-black/35">
                  REQUEST DETAIL
                </p>

                <p className="text-xl font-black mt-2">
                  #{selectedRequest.id}
                </p>

              </div>


              <button
                onClick={() =>
                  setSelectedRequest(null)
                }
                className="w-9 h-9 border border-black/15 flex items-center justify-center hover:bg-black hover:text-white"
              >
                <X size={17} />
              </button>

            </div>


            {/* MODAL CONTENT */}

            <div className="px-7 md:px-10 py-10">

              <p className="text-[9px] tracking-[0.35em] text-black/35">
                EMPLOYEE
              </p>

              <h3 className="text-4xl md:text-5xl font-black tracking-[-0.06em] mt-3">
                {selectedRequest.user?.name ||
                  "Employee"}
              </h3>


              <div className="mt-10 border-y border-black/10 divide-y divide-black/10">

                <div className="py-5 flex justify-between gap-5">

                  <span className="text-[9px] tracking-[0.3em] text-black/35">
                    LEAVE TYPE
                  </span>

                  <span className="text-sm font-black text-right">
                    {selectedRequest.leave_type?.name ||
                      "—"}
                  </span>

                </div>


                <div className="py-5 flex justify-between gap-5">

                  <span className="text-[9px] tracking-[0.3em] text-black/35">
                    DATES
                  </span>

                  <span className="text-sm font-black">
                    {selectedRequest.start_date}
                    {" → "}
                    {selectedRequest.end_date}
                  </span>

                </div>


                <div className="py-5 flex justify-between gap-5">

                  <span className="text-[9px] tracking-[0.3em] text-black/35">
                    DURATION
                  </span>

                  <span className="text-sm font-black">
                    {selectedRequest.duration} DAYS
                  </span>

                </div>


                <div className="py-5 flex justify-between gap-5">

                  <span className="text-[9px] tracking-[0.3em] text-black/35">
                    PERIOD
                  </span>

                  <span className="text-sm font-black uppercase">
                    {selectedRequest.period?.replace(
                      "_",
                      " "
                    )}
                  </span>

                </div>


                <div className="py-5 flex justify-between gap-5">

                  <span className="text-[9px] tracking-[0.3em] text-black/35">
                    STATUS
                  </span>

                  <span className="text-[9px] tracking-[0.2em] font-bold">
                    {getStatus(
                      selectedRequest.status
                    ).label}
                  </span>

                </div>

              </div>


              {/* REASON */}

              {selectedRequest.reason && (

                <div className="mt-8">

                  <p className="text-[9px] tracking-[0.35em] text-black/35">
                    REASON
                  </p>

                  <p className="text-sm text-black/60 leading-relaxed mt-3">
                    {selectedRequest.reason}
                  </p>

                </div>

              )}


              {/* ACTIONS */}

              {selectedRequest.status === "pending" && (

                <div className="grid sm:grid-cols-2 gap-px bg-black/10 mt-10">

                  <button
                    type="button"
                    onClick={() =>
                      handleReject(selectedRequest)
                    }
                    disabled={processing}
                    className="bg-[#F3F0E8] py-5 flex items-center justify-center gap-3 text-[9px] tracking-[0.3em] font-bold hover:bg-white disabled:opacity-40"
                  >

                    <X size={16} />

                    {processing
                      ? "PROCESSING..."
                      : "REJECT"}

                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      handleApprove(selectedRequest)
                    }
                    disabled={processing}
                    className="bg-black text-white py-5 flex items-center justify-center gap-3 text-[9px] tracking-[0.3em] font-bold hover:bg-black/85 disabled:opacity-40"
                  >

                    <Check size={16} />

                    {processing
                      ? "PROCESSING..."
                      : "APPROVE"}

                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Manager;