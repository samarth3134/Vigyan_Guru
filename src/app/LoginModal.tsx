import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, Loader2, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { getSupabaseClient } from "./supabase";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

type AuthView = "login" | "signup" | "forgot";

export default function LoginModal({ isOpen, onClose, isDarkMode }: LoginModalProps) {
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setError("");
      setSuccess("");
      setEmail("");
      setPassword("");
      setView("login");
      setTimeout(() => emailRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    try {
      if (view === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setSuccess("Account created! Check your email to confirm.");
      } else if (view === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setSuccess("Logged in successfully!");
        setTimeout(onClose, 800);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSuccess("Password reset email sent! Check your inbox.");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`w-full max-w-md rounded-2xl p-8 relative ${
              isDarkMode ? "bg-slate-900 border border-white/10" : "bg-white shadow-2xl"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 ${isDarkMode ? "text-slate-400 hover:text-white" : "text-gray-400 hover:text-gray-600"}`}
            >
              <X size={20} />
            </button>

            {view === "forgot" && (
              <button
                onClick={() => { setView("login"); setError(""); setSuccess(""); }}
                className={`flex items-center gap-1 text-sm mb-4 ${isDarkMode ? "text-slate-400 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}
              >
                <ArrowLeft size={16} /> Back to login
              </button>
            )}

            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-slate-100" : "text-[#1F1F1F]"}`}>
              {view === "login" ? "Welcome Back" : view === "signup" ? "Create Account" : "Reset Password"}
            </h2>

            {error && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                <CheckCircle size={16} />
                {success}
              </div>
            )}

            {view === "forgot" ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      ref={emailRef}
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#E6A700] transition-all ${
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-slate-100"
                          : "border-gray-300 text-[#1F1F1F]"
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#6D1B1B] text-white py-3 rounded-lg hover:bg-[#8B2323] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  Send Reset Link
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      ref={emailRef}
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#E6A700] transition-all ${
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-slate-100"
                          : "border-gray-300 text-[#1F1F1F]"
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#E6A700] transition-all ${
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-slate-100"
                          : "border-gray-300 text-[#1F1F1F]"
                      }`}
                      placeholder="At least 6 characters"
                    />
                  </div>
                </div>

                {view === "login" && (
                  <button
                    type="button"
                    onClick={() => { setView("forgot"); setError(""); setSuccess(""); }}
                    className="text-sm text-[#E6A700] hover:underline block ml-auto"
                  >
                    Forgot password?
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#6D1B1B] text-white py-3 rounded-lg hover:bg-[#8B2323] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  {view === "login" ? "Log In" : "Sign Up"}
                </button>
              </form>
            )}

            {view !== "forgot" && (
              <p className={`text-center mt-4 text-sm ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>
                {view === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setView(view === "login" ? "signup" : "login");
                    setError("");
                    setSuccess("");
                  }}
                  className="text-[#E6A700] font-semibold hover:underline"
                >
                  {view === "login" ? "Sign Up" : "Log In"}
                </button>
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
