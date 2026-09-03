import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  FileUp,
  Minus,
  Plus,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const leaveTypes = [
  {
    id: 1,
    name: "Congés payés",
    label: "REST",
    description: "Take time to recharge.",
    symbol: "○",
  },
  {
    id: 2,
    name: "Congé maladie",
    label: "HEALTH",
    description: "Time to recover.",
    symbol: "△",
  },
  {
    id: 3,
    name: "Autorisation d’absence",
    label: "PERSONAL",
    description: "A short absence from work.",
    symbol: "□",
  },
  {
    id: 4,
    name: "Congé exceptionnel",
    label: "OTHER",
    description: "For exceptional circumstances.",
    symbol: "◇",
  },
];

function LeaveRequest() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    leave_type_id: "",
    start_date: "",
    end_date: "",
    duration: 1,
    period: "full_day",
    reason: "",
    attachment: "",
    replacement_user_id: "",
    catch_up_date: "",
  });

  const [balances, setBalances] = useState([]);
  const [loadingBalances, setLoadingBalances] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------------------------------
  // LOAD LEAVE BALANCES
  // --------------------------------------------------

  useEffect(() => {
    const loadBalances = async () => {
      try {
        const response = await api.get("/leave-balances");

        setBalances(response.data.balances || []);
      } catch (err) {
        console.error("BALANCE ERROR:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load your leave balance."
        );
      } finally {
        setLoadingBalances(false);
      }
    };

    loadBalances();
  }, []);

  // --------------------------------------------------
  // SELECTED LEAVE TYPE
  // --------------------------------------------------

  const selectedType = useMemo(() => {
    return leaveTypes.find(
      (type) => String(type.id) === String(form.leave_type_id)
    );
  }, [form.leave_type_id]);

  const selectedBalance = useMemo(() => {
    if (!selectedType) return null;

    return balances.find(
      (balance) =>
        String(balance.id) === String(selectedType.id)
    );
  }, [balances, selectedType]);

  // --------------------------------------------------
  // CALCULATE DURATION
  // --------------------------------------------------

  useEffect(() => {
    if (!form.start_date || !form.end_date) {
      return;
    }

    const start = new Date(form.start_date);
    const end = new Date(form.end_date);

    if (end < start) {
      setForm((previous) => ({
        ...previous,
        duration: 1,
      }));

      return;
    }

    const difference =
      Math.floor(
        (end - start) / (1000 * 60 * 60 * 24)
      ) + 1;

    let duration = difference;

    if (form.period !== "full_day") {
      duration = difference - 0.5;
    }

    setForm((previous) => ({
      ...previous,
      duration: Math.max(duration, 0.5),
    }));
  }, [
    form.start_date,
    form.end_date,
    form.period,
  ]);

  // --------------------------------------------------
  // CHANGE
  // --------------------------------------------------

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  // --------------------------------------------------
  // DURATION +/- 
  // --------------------------------------------------

  const decreaseDuration = () => {
    setForm((previous) => ({
      ...previous,
      duration: Math.max(0.5, Number(previous.duration) - 0.5),
    }));
  };

  const increaseDuration = () => {
    setForm((previous) => ({
      ...previous,
      duration: Number(previous.duration) + 0.5,
    }));
  };

  // --------------------------------------------------
  // VALIDATION
  // --------------------------------------------------

  const nextStep = () => {
    setError("");

    if (step === 1) {
      if (!form.leave_type_id) {
        setError("Choose what you need first.");
        return;
      }
    }

    if (step === 2) {
      if (!form.start_date || !form.end_date) {
        setError("Choose your start and end dates.");
        return;
      }

      if (new Date(form.end_date) < new Date(form.start_date)) {
        setError("End date cannot be before start date.");
        return;
      }

      if (!form.duration || Number(form.duration) <= 0) {
        setError("Invalid leave duration.");
        return;
      }
    }

    setStep(step + 1);
  };

  const previousStep = () => {
    setError("");
    setSuccess("");
    setStep((previous) => previous - 1);
  };

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/leave-requests", {
        leave_type_id: Number(form.leave_type_id),
        start_date: form.start_date,
        end_date: form.end_date,
        duration: Number(form.duration),
        period: form.period,
        reason: form.reason || null,
        attachment: form.attachment || null,
        replacement_user_id:
          form.replacement_user_id
            ? Number(form.replacement_user_id)
            : null,
        catch_up_date: form.catch_up_date || null,
      });

      setSuccess(
        response.data.message ||
          "Leave request created successfully."
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("LEAVE REQUEST ERROR:", err);

      const errors = err.response?.data?.errors;

      if (errors) {
        const firstError = Object.values(errors)[0]?.[0];

        setError(
          firstError ||
            "Unable to create your leave request."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to create your leave request."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

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
              YOUR TIME / YOUR SPACE
            </p>
          </button>

          <div className="text-right">

            <p className="text-[9px] tracking-[0.3em] text-black/35">
              REQUEST
            </p>

            <p className="text-xs font-bold">
              0{step} / 03
            </p>

          </div>

        </div>

      </header>


      {/* MAIN */}

      <main className="max-w-[1500px] mx-auto min-h-[calc(100vh-90px)] grid lg:grid-cols-[0.65fr_1.35fr]">


        {/* LEFT */}

        <aside className="hidden lg:flex border-r border-black/10 p-12 flex-col justify-between">

          <div>

            <p className="text-[9px] tracking-[0.45em] text-black/35">
              TIME REQUEST
            </p>

            <h1 className="text-[clamp(5rem,8vw,8rem)] font-black tracking-[-0.09em] leading-[0.76] mt-12">
              DESIGN
              <br />
              YOUR
              <br />
              BREAK<span className="text-black/20">.</span>
            </h1>

          </div>


          {/* BALANCE */}

          <div>

            <p className="text-[9px] tracking-[0.35em] text-black/35 mb-5">
              YOUR AVAILABLE TIME
            </p>

            {loadingBalances ? (

              <p className="text-sm text-black/40">
                Loading...
              </p>

            ) : balances.length > 0 ? (

              <div className="space-y-3">

                {balances.map((balance) => (

                  <div
                    key={balance.id}
                    className="flex justify-between border-b border-black/10 pb-2"
                  >

                    <span className="text-xs">
                      {balance.leave_type}
                    </span>

                    <span className="text-xs font-black">
                      {balance.remaining_days} D
                    </span>

                  </div>

                ))}

              </div>

            ) : (

              <p className="text-xs text-black/40">
                No balance available.
              </p>

            )}

          </div>

        </aside>


        {/* CONTENT */}

        <section className="px-7 md:px-16 lg:px-24 py-12 flex items-center">

          <div className="w-full max-w-3xl mx-auto">


            {/* STEP 1 */}

            {step === 1 && (

              <div>

                <p className="text-[9px] tracking-[0.45em] text-black/35">
                  STEP 01 / 03
                </p>

                <h2 className="text-5xl md:text-7xl font-black tracking-[-0.07em] leading-[0.85] mt-5">
                  WHAT DO
                  <br />
                  YOU NEED<span className="text-black/20">?</span>
                </h2>

                <p className="text-xs text-black/40 mt-7">
                  Choose the type of time you need.
                </p>


                <div className="grid sm:grid-cols-2 gap-px bg-black/10 mt-12">

                  {leaveTypes.map((type) => (

                    <button
                      key={type.id}
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          leave_type_id: String(type.id),
                        })
                      }
                      className={`
                        text-left p-7 min-h-[170px]
                        transition-all
                        ${
                          String(form.leave_type_id) ===
                          String(type.id)
                            ? "bg-black text-white"
                            : "bg-[#F3F0E8] hover:bg-white"
                        }
                      `}
                    >

                      <div className="flex items-start justify-between">

                        <span className="text-4xl font-light">
                          {type.symbol}
                        </span>

                        {String(form.leave_type_id) ===
                          String(type.id) && (
                            <Check size={18} />
                          )}

                      </div>

                      <p className="text-[9px] tracking-[0.35em] mt-8 opacity-50">
                        {type.label}
                      </p>

                      <p className="text-xl font-black mt-2">
                        {type.name}
                      </p>

                      <p className="text-xs opacity-50 mt-2">
                        {type.description}
                      </p>

                    </button>

                  ))}

                </div>

              </div>

            )}


            {/* STEP 2 */}

            {step === 2 && (

              <div>

                <p className="text-[9px] tracking-[0.45em] text-black/35">
                  STEP 02 / 03
                </p>

                <h2 className="text-5xl md:text-7xl font-black tracking-[-0.07em] leading-[0.85] mt-5">
                  HOW MUCH
                  <br />
                  TIME<span className="text-black/20">?</span>
                </h2>


                <div className="mt-12 grid md:grid-cols-2 gap-10">


                  {/* START */}

                  <div>

                    <label className="block text-[9px] tracking-[0.35em] text-black/35 mb-4">
                      START DATE
                    </label>

                    <div className="flex items-center border-b-2 border-black pb-4">

                      <CalendarDays
                        size={18}
                        className="mr-4"
                      />

                      <input
                        type="date"
                        name="start_date"
                        value={form.start_date}
                        onChange={handleChange}
                        className="w-full bg-transparent outline-none text-lg"
                      />

                    </div>

                  </div>


                  {/* END */}

                  <div>

                    <label className="block text-[9px] tracking-[0.35em] text-black/35 mb-4">
                      END DATE
                    </label>

                    <div className="flex items-center border-b-2 border-black pb-4">

                      <CalendarDays
                        size={18}
                        className="mr-4"
                      />

                      <input
                        type="date"
                        name="end_date"
                        value={form.end_date}
                        onChange={handleChange}
                        className="w-full bg-transparent outline-none text-lg"
                      />

                    </div>

                  </div>

                </div>


                {/* PERIOD */}

                <div className="mt-12">

                  <p className="text-[9px] tracking-[0.35em] text-black/35 mb-5">
                    PERIOD
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {[
                      ["full_day", "FULL DAY"],
                      ["morning", "MORNING"],
                      ["afternoon", "AFTERNOON"],
                    ].map(([value, label]) => (

                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            period: value,
                          })
                        }
                        className={`
                          px-5 py-3 text-[9px]
                          tracking-[0.25em] font-bold
                          border
                          ${
                            form.period === value
                              ? "bg-black text-white border-black"
                              : "border-black/15 hover:border-black"
                          }
                        `}
                      >
                        {label}
                      </button>

                    ))}

                  </div>

                </div>


                {/* DURATION */}

                <div className="mt-12 flex items-center justify-between border-y border-black/10 py-7">

                  <div>

                    <p className="text-[9px] tracking-[0.35em] text-black/35">
                      TOTAL DURATION
                    </p>

                    <p className="text-5xl font-black tracking-[-0.06em] mt-2">
                      {form.duration}
                      <span className="text-xl ml-2 font-normal">
                        DAYS
                      </span>
                    </p>

                  </div>


                  <div className="flex items-center gap-3">

                    <button
                      type="button"
                      onClick={decreaseDuration}
                      className="w-10 h-10 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white"
                    >
                      <Minus size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={increaseDuration}
                      className="w-10 h-10 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white"
                    >
                      <Plus size={16} />
                    </button>

                  </div>

                </div>


                {/* BALANCE */}

                {selectedBalance && (

                  <div className="mt-7 flex justify-between text-xs">

                    <span className="text-black/40">
                      Available balance
                    </span>

                    <span className="font-bold">
                      {selectedBalance.remaining_days} days
                    </span>

                  </div>

                )}

              </div>

            )}


            {/* STEP 3 */}

            {step === 3 && (

              <div>

                <p className="text-[9px] tracking-[0.45em] text-black/35">
                  STEP 03 / 03
                </p>

                <h2 className="text-5xl md:text-7xl font-black tracking-[-0.07em] leading-[0.85] mt-5">
                  REVIEW
                  <br />
                  YOUR TIME<span className="text-black/20">.</span>
                </h2>


                {/* SUMMARY */}

                <div className="mt-12 border-y border-black/10 divide-y divide-black/10">

                  <div className="py-5 flex justify-between gap-6">

                    <span className="text-[9px] tracking-[0.3em] text-black/35">
                      TYPE
                    </span>

                    <span className="font-black text-sm">
                      {selectedType?.name}
                    </span>

                  </div>


                  <div className="py-5 flex justify-between gap-6">

                    <span className="text-[9px] tracking-[0.3em] text-black/35">
                      PERIOD
                    </span>

                    <span className="font-black text-sm">
                      {form.start_date}
                      {" → "}
                      {form.end_date}
                    </span>

                  </div>


                  <div className="py-5 flex justify-between gap-6">

                    <span className="text-[9px] tracking-[0.3em] text-black/35">
                      DURATION
                    </span>

                    <span className="font-black text-sm">
                      {form.duration} DAYS
                    </span>

                  </div>


                  <div className="py-5 flex justify-between gap-6">

                    <span className="text-[9px] tracking-[0.3em] text-black/35">
                      SESSION
                    </span>

                    <span className="font-black text-sm uppercase">
                      {form.period.replace("_", " ")}
                    </span>

                  </div>

                </div>


                {/* REASON */}

                <div className="mt-10">

                  <label className="block text-[9px] tracking-[0.35em] text-black/35 mb-4">
                    REASON / OPTIONAL
                  </label>

                  <textarea
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us anything we should know..."
                    className="w-full resize-none bg-transparent border-b-2 border-black outline-none text-lg placeholder:text-black/15"
                  />

                </div>


                {/* ATTACHMENT */}

                <div className="mt-8">

                  <label className="block text-[9px] tracking-[0.35em] text-black/35 mb-4">
                    ATTACHMENT / OPTIONAL
                  </label>

                  <label className="flex items-center gap-4 border border-dashed border-black/20 p-5 cursor-pointer hover:border-black">

                    <FileUp size={20} />

                    <div>

                      <p className="text-xs font-bold">
                        {form.attachment
                          ? "Attachment selected"
                          : "Add a document"}
                      </p>

                      <p className="text-[10px] text-black/35 mt-1">
                        PDF or image
                      </p>

                    </div>

                    <input
                      type="text"
                      name="attachment"
                      value={form.attachment}
                      onChange={handleChange}
                      placeholder="File name or reference"
                      className="ml-auto w-1/2 bg-transparent outline-none text-xs border-b border-black/10 pb-2"
                    />

                  </label>

                </div>


                {/* OPTIONAL TRAINER FIELDS */}

                <div className="mt-8 grid md:grid-cols-2 gap-6">

                  <div>

                    <label className="flex items-center gap-2 text-[9px] tracking-[0.3em] text-black/35 mb-3">
                      <UserRound size={13} />
                      REPLACEMENT ID
                    </label>

                    <input
                      type="number"
                      name="replacement_user_id"
                      value={form.replacement_user_id}
                      onChange={handleChange}
                      placeholder="Optional"
                      className="w-full bg-transparent border-b border-black/20 pb-3 outline-none"
                    />

                  </div>


                  <div>

                    <label className="block text-[9px] tracking-[0.3em] text-black/35 mb-3">
                      CATCH-UP DATE
                    </label>

                    <input
                      type="date"
                      name="catch_up_date"
                      value={form.catch_up_date}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-black/20 pb-3 outline-none"
                    />

                  </div>

                </div>


                {/* DNA */}

                <div className="mt-12 border-y border-black/10 py-8">

                  <p className="text-[9px] tracking-[0.35em] text-black/35 mb-5">
                    YOUR TIME DNA
                  </p>

                  <svg
                    viewBox="0 0 700 140"
                    className="w-full"
                  >

                    <path
                      d="M0 70
                      C70 10 140 130 210 70
                      C280 10 350 130 420 70
                      C490 10 560 130 630 70
                      C660 45 680 95 700 70"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />

                    <path
                      d="M0 70
                      C70 130 140 10 210 70
                      C280 130 350 10 420 70
                      C490 130 560 10 630 70
                      C660 95 680 45 700 70"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      opacity="0.2"
                    />

                  </svg>

                </div>

              </div>

            )}


            {/* ERROR */}

            {error && (

              <div className="mt-8 border-l-2 border-black pl-4 text-xs text-black/60">
                {error}
              </div>

            )}


            {/* SUCCESS */}

            {success && (

              <div className="mt-8 border-l-2 border-black pl-4 text-xs font-bold">
                {success}
                <br />
                Returning to your dashboard...
              </div>

            )}


            {/* NAVIGATION */}

            <div className="mt-12 flex items-center justify-between">

              {step > 1 ? (

                <button
                  type="button"
                  onClick={previousStep}
                  disabled={loading}
                  className="flex items-center gap-3 text-[9px] tracking-[0.3em] font-bold"
                >
                  <ArrowLeft size={16} />
                  BACK
                </button>

              ) : (

                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="text-[9px] tracking-[0.3em] font-bold"
                >
                  ← DASHBOARD
                </button>

              )}


              {step < 3 ? (

                <button
                  type="button"
                  onClick={nextStep}
                  className="group flex items-center gap-4 bg-black text-white px-7 py-4 text-[9px] tracking-[0.3em] font-bold"
                >

                  NEXT

                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition"
                  />

                </button>

              ) : (

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="group flex items-center gap-4 bg-black text-white px-7 py-4 text-[9px] tracking-[0.3em] font-bold disabled:opacity-40"
                >

                  {loading
                    ? "SENDING..."
                    : "SEND REQUEST"}

                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition"
                  />

                </button>

              )}

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default LeaveRequest;