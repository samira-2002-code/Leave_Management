import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

 
    name: "",
    department_id: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const nextStep = () => {
    setError("");
    setSuccess("");

    // STEP 1
    if (step === 1) {
      if (!form.name.trim()) {
        setError("Please enter your full name.");
        return;
      }
    }

    // STEP 2
    if (step === 2) {
      if (!form.department_id) {
        setError("Please choose your department.");
        return;
      }
    }

    // STEP 3
    if (step === 3) {
      if (!form.email.trim()) {
        setError("Please enter your email.");
        return;
      }

      if (!form.password) {
        setError("Please enter your password.");
        return;
      }

      if (form.password.length < 8) {
        setError("Password must contain at least 8 characters.");
        return;
      }

      if (!form.password_confirmation) {
        setError("Please confirm your password.");
        return;
      }

      if (form.password !== form.password_confirmation) {
        setError("Passwords do not match.");
        return;
      }
    }

    setStep(step + 1);
  };

  const previousStep = () => {
    setError("");
    setSuccess("");
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name: form.name,
        department_id: Number(form.department_id),
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });

      setSuccess(
        response.data.message || "Account created successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("REGISTER ERROR:", err);

      const errors = err.response?.data?.errors;

      if (errors) {
        const firstError = Object.values(errors)[0]?.[0];

        setError(
          firstError || "Unable to create your account."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to create your account."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F0E8] text-[#111]">

      {/* HEADER */}
      <header className="px-6 md:px-10 py-6 border-b border-black/10">
        <div className="max-w-[1500px] mx-auto flex justify-between items-center">

          <div>
            <p className="text-sm font-black tracking-[0.45em]">
              TIME DNA
            </p>

            <p className="text-[9px] tracking-[0.35em] text-black/35 mt-1">
              CREATE YOUR TIME
            </p>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="text-[9px] tracking-[0.3em] font-bold hover:underline"
          >
            ALREADY A MEMBER →
          </button>

        </div>
      </header>


      {/* MAIN */}
      <main className="max-w-[1500px] mx-auto min-h-[calc(100vh-89px)] grid lg:grid-cols-[0.8fr_1.2fr]">

        {/* LEFT SIDE */}
        <section className="hidden lg:flex relative border-r border-black/10 p-12 flex-col justify-between overflow-hidden">

          <div>

            <p className="text-[9px] tracking-[0.45em] text-black/35">
              REGISTRATION
            </p>

            <h1 className="text-[clamp(5rem,9vw,9rem)] font-black tracking-[-0.09em] leading-[0.76] mt-12">
              CREATE
              <br />
              YOUR
              <br />
              DNA<span className="text-black/20">.</span>
            </h1>

          </div>


          {/* DNA */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">

            <svg
              viewBox="0 0 800 260"
              className="w-full"
              preserveAspectRatio="none"
            >

              <path
                d="M0 130
                C80 20 160 240 240 130
                C320 20 400 240 480 130
                C560 20 640 240 720 130
                C760 75 780 185 800 130"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />

              <path
                d="M0 130
                C80 240 160 20 240 130
                C320 240 400 20 480 130
                C560 240 640 20 720 130
                C760 185 780 75 800 130"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.2"
              />

            </svg>

          </div>


          <div className="flex justify-between text-[9px] tracking-[0.3em] text-black/30">
            <span>YOUR SPACE</span>
            <span>01—04</span>
          </div>

        </section>


        {/* RIGHT SIDE */}
        <section className="flex items-center px-7 md:px-16 lg:px-24 py-12">

          <div className="w-full max-w-xl mx-auto">


            {/* PROGRESS */}
            <div className="flex items-center gap-3 mb-14">

              {[1, 2, 3, 4].map((number) => (

                <div
                  key={number}
                  className="flex items-center gap-3"
                >

                  <div
                    className={`
                      w-8 h-8 rounded-full
                      flex items-center justify-center
                      text-[9px] font-bold
                      transition
                      ${
                        number <= step
                          ? "bg-black text-white"
                          : "border border-black/15 text-black/30"
                      }
                    `}
                  >

                    {number < step ? (
                      <Check size={13} />
                    ) : (
                      `0${number}`
                    )}

                  </div>


                  {number !== 4 && (
                    <div
                      className={`w-8 md:w-14 h-px ${
                        number < step
                          ? "bg-black"
                          : "bg-black/10"
                      }`}
                    />
                  )}

                </div>

              ))}

            </div>


            {/* STEP 1 */}
            {step === 1 && (

              <div>

                <p className="text-[9px] tracking-[0.45em] text-black/35">
                  STEP 01 / 04
                </p>

                <h2 className="text-5xl md:text-7xl font-black tracking-[-0.07em] leading-[0.85] mt-5">
                  WHO
                  <br />
                  ARE YOU<span className="text-black/20">?</span>
                </h2>

                <p className="text-xs text-black/40 mt-7">
                  Start with the person behind the time.
                </p>


                <div className="mt-14 border-b-2 border-black pb-4">

                  <label className="block text-[9px] tracking-[0.35em] text-black/35 mb-3">
                    FULL NAME
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    autoFocus
                    className="w-full bg-transparent outline-none text-2xl placeholder:text-black/15"
                  />

                </div>

              </div>

            )}


            {/* STEP 2 */}
            {step === 2 && (

              <div>

                <p className="text-[9px] tracking-[0.45em] text-black/35">
                  STEP 02 / 04
                </p>

                <h2 className="text-5xl md:text-7xl font-black tracking-[-0.07em] leading-[0.85] mt-5">
                  WHERE
                  <br />
                  DO YOU
                  <br />
                  WORK<span className="text-black/20">?</span>
                </h2>

                <p className="text-xs text-black/40 mt-7">
                  Your department helps us understand your space.
                </p>


                <div className="mt-14">

                  <label className="block text-[9px] tracking-[0.35em] text-black/35 mb-4">
                    DEPARTMENT
                  </label>

                  <select
                    name="department_id"
                    value={form.department_id}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b-2 border-black pb-4 outline-none text-xl appearance-none cursor-pointer"
                  >

                    <option value="">
                      Select department
                    </option>

                    <option value="1">
                      Ressources Humaines
                    </option>

                    <option value="2">
                      Informatique
                    </option>

                    <option value="3">
                      Pédagogie
                    </option>

                    <option value="4">
                      Administration
                    </option>

                  </select>

                </div>

              </div>

            )}


            {/* STEP 3 */}
            {step === 3 && (

              <div>

                <p className="text-[9px] tracking-[0.45em] text-black/35">
                  STEP 03 / 04
                </p>

                <h2 className="text-5xl md:text-7xl font-black tracking-[-0.07em] leading-[0.85] mt-5">
                  YOUR
                  <br />
                  ACCESS<span className="text-black/20">.</span>
                </h2>


                <div className="mt-12 space-y-8">


                  {/* EMAIL */}
                  <div className="border-b border-black/20 pb-3">

                    <label className="block text-[9px] tracking-[0.35em] text-black/35 mb-3">
                      EMAIL
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full bg-transparent outline-none text-lg placeholder:text-black/15"
                    />

                  </div>


                  {/* PASSWORD */}
                  <div className="border-b border-black/20 pb-3">

                    <label className="block text-[9px] tracking-[0.35em] text-black/35 mb-3">
                      PASSWORD
                    </label>

                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Minimum 8 characters"
                      className="w-full bg-transparent outline-none text-lg placeholder:text-black/15"
                    />

                  </div>


                  {/* CONFIRM */}
                  <div className="border-b border-black/20 pb-3">

                    <label className="block text-[9px] tracking-[0.35em] text-black/35 mb-3">
                      CONFIRM PASSWORD
                    </label>

                    <input
                      type="password"
                      name="password_confirmation"
                      value={form.password_confirmation}
                      onChange={handleChange}
                      placeholder="Repeat your password"
                      className="w-full bg-transparent outline-none text-lg placeholder:text-black/15"
                    />

                  </div>

                </div>

              </div>

            )}


            {/* STEP 4 */}
            {step === 4 && (

              <div>

                <p className="text-[9px] tracking-[0.45em] text-black/35">
                  STEP 04 / 04
                </p>

                <h2 className="text-5xl md:text-7xl font-black tracking-[-0.07em] leading-[0.85] mt-5">
                  YOUR DNA
                  <br />
                  IS READY<span className="text-black/20">.</span>
                </h2>


                {/* DNA VISUAL */}
                <div className="mt-12 border-y border-black/10 py-10">

                  <svg
                    viewBox="0 0 600 180"
                    className="w-full"
                  >

                    <path
                      d="M0 90
                      C60 10 120 170 180 90
                      C240 10 300 170 360 90
                      C420 10 480 170 540 90
                      C570 50 585 130 600 90"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />

                    <path
                      d="M0 90
                      C60 170 120 10 180 90
                      C240 170 300 10 360 90
                      C420 170 480 10 540 90
                      C570 130 585 50 600 90"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      opacity="0.25"
                    />

                  </svg>

                </div>


                {/* USER PREVIEW */}
                <div className="mt-8">

                  <p className="text-[9px] tracking-[0.3em] text-black/35">
                    WELCOME
                  </p>

                  <p className="text-3xl font-black mt-2">
                    {form.name}
                  </p>

                  <p className="text-xs text-black/40 mt-2">
                    {form.email}
                  </p>

                  <p className="text-xs text-black/40 mt-1">
                    {form.department_id === "1" &&
                      "Ressources Humaines"}

                    {form.department_id === "2" &&
                      "Informatique"}

                    {form.department_id === "3" &&
                      "Pédagogie"}

                    {form.department_id === "4" &&
                      "Administration"}
                  </p>

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
                Redirecting to login...
              </div>

            )}


            {/* NAVIGATION */}
            <div className="mt-12 flex items-center justify-between">


              {/* BACK */}
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
                  onClick={() => navigate("/login")}
                  className="text-[9px] tracking-[0.3em] font-bold"
                >
                  ← LOGIN
                </button>

              )}


              {/* NEXT / CREATE */}
              {step < 4 ? (

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
                    ? "CREATING..."
                    : "CREATE MY DNA"}

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

export default Register;