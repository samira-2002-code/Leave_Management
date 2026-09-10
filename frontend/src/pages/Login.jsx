import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...response.data.user, roles: response.data.roles || [] })
      );

      const roles = response.data.roles || [];
      navigate(roles.includes("hr") || roles.includes("admin") ? "/hr" : roles.includes("manager") ? "/manager" : "/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to enter the system."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F0E8] text-[#111] grid lg:grid-cols-2">

      {/* LEFT */}
      <section className="relative min-h-[45vh] lg:min-h-screen bg-[#111] text-white p-8 md:p-12 overflow-hidden flex flex-col justify-between">

        <div>

          <p className="text-[10px] tracking-[0.55em] text-white/40">
            TIME DNA
          </p>

          <h1 className="mt-16 text-[clamp(5rem,11vw,11rem)] leading-[0.75] tracking-[-0.09em] font-black">
            YOUR
            <br />
            TIME.
          </h1>

        </div>

        {/* DNA */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 opacity-80">

          <svg
            viewBox="0 0 800 250"
            className="w-full"
            preserveAspectRatio="none"
          >

            <path
              d="M0 125
                 C80 25 160 225 240 125
                 C320 25 400 225 480 125
                 C560 25 640 225 720 125
                 C760 75 780 175 800 125"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />

            <path
              d="M0 125
                 C80 225 160 25 240 125
                 C320 225 400 25 480 125
                 C560 225 640 25 720 125
                 C760 175 780 75 800 125"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.3"
            />

          </svg>

        </div>

        <div className="flex justify-between text-[9px] tracking-[0.3em] text-white/35">
          <span>YOUR SPACE</span>
          <span>{new Date().toLocaleDateString("en-GB", { year: "numeric", month: "2-digit" }).replace("/", " / ")}</span>
        </div>

      </section>

      {/* RIGHT */}
      <section className="min-h-screen flex items-center px-8 md:px-20 py-16">

        <div className="w-full max-w-md mx-auto">

          <div className="mb-14">

            <p className="text-[9px] tracking-[0.45em] text-black/35">
              ACCESS / 01
            </p>

            <h2 className="text-5xl md:text-6xl font-black tracking-[-0.06em] mt-5">
              WELCOME
              <br />
              BACK<span className="text-black/20">.</span>
            </h2>

            <p className="text-xs text-black/40 mt-5 leading-relaxed">
              Enter your space and continue
              <br />
              where you left your time.
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* EMAIL */}
            <div className="border-b border-black/20 pb-3">

              <label className="block text-[9px] tracking-[0.35em] text-black/40 mb-3">
                EMAIL
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="w-full bg-transparent outline-none text-lg placeholder:text-black/20"
              />

            </div>

            {/* PASSWORD */}
            <div className="border-b border-black/20 pb-3">

              <label className="block text-[9px] tracking-[0.35em] text-black/40 mb-3">
                PASSWORD
              </label>

              <div className="flex items-center">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent outline-none text-lg placeholder:text-black/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="text-black/30 hover:text-black"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* ERROR */}
            {error && (
              <div className="border-l-2 border-black pl-4 text-xs text-black/60">
                {error}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-between border-b-2 border-black pb-4 pt-5 hover:pl-3 transition-all disabled:opacity-40"
            >

              <span className="text-xs font-black tracking-[0.3em]">
                {loading
                  ? "ENTERING..."
                  : "ENTER THE SYSTEM"}
              </span>

              <ArrowRight
                size={22}
                className="group-hover:translate-x-2 transition-transform"
              />

            </button>

          </form>

          {/* REGISTER */}
          <div className="mt-14 pt-6 border-t border-black/10">

            <p className="text-[9px] tracking-[0.3em] text-black/35 mb-3">
              NEW HERE?
            </p>

            <button
              onClick={() => navigate("/register")}
              className="text-sm font-bold hover:underline"
            >
              CREATE YOUR TIME DNA →
            </button>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;