import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Camera, Loader2, CheckCircle, AlertCircle, User } from "lucide-react";
import { getSupabaseClient } from "./supabase";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  userId: string;
  initialProfile: { name: string; bio: string; interests: string; avatar_url: string };
  onProfileUpdate: (profile: { name: string; bio: string; interests: string; avatar_url: string }) => void;
}

export default function ProfileModal({ isOpen, onClose, isDarkMode, userId, initialProfile, onProfileUpdate }: ProfileModalProps) {
  const [name, setName] = useState(initialProfile.name);
  const [bio, setBio] = useState(initialProfile.bio);
  const [interests, setInterests] = useState(initialProfile.interests);
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatar_url);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialProfile.name);
      setBio(initialProfile.bio);
      setInterests(initialProfile.interests);
      setAvatarUrl(initialProfile.avatar_url);
      setError("");
      setSuccess("");
    }
  }, [isOpen, initialProfile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setLoading(true);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      setAvatarUrl(data.publicUrl);
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
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
      const { error } = await supabase.from("profiles").upsert({
        id: userId,
        name,
        bio,
        interests,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      onProfileUpdate({ name, bio, interests, avatar_url: avatarUrl });
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
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
            className={`w-full max-w-md rounded-2xl p-8 relative max-h-[90vh] overflow-y-auto ${
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

            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-slate-100" : "text-[#1F1F1F]"}`}>
              Your Profile
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

            <form onSubmit={handleSave} className="space-y-4">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3">
                <div className={`w-24 h-24 rounded-full overflow-hidden border-4 ${isDarkMode ? "border-slate-700" : "border-gray-200"}`}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? "bg-slate-800" : "bg-gray-100"}`}>
                      <User size={40} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full border transition-colors ${
                    isDarkMode
                      ? "border-slate-700 text-slate-300 hover:text-white"
                      : "border-gray-300 text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Camera size={16} />
                  {loading ? "Uploading..." : "Change Photo"}
                </button>
              </div>

              {/* Name */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#E6A700] transition-all ${
                    isDarkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "border-gray-300 text-[#1F1F1F]"
                  }`}
                  placeholder="Your name"
                />
              </div>

              {/* Bio */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#E6A700] transition-all resize-none ${
                    isDarkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "border-gray-300 text-[#1F1F1F]"
                  }`}
                  placeholder="Tell us a bit about yourself..."
                />
              </div>

              {/* Interests */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                  Interests
                </label>
                <input
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#E6A700] transition-all ${
                    isDarkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "border-gray-300 text-[#1F1F1F]"
                  }`}
                  placeholder="Science, Math, Physics..."
                />
                <p className={`text-xs mt-1 ${isDarkMode ? "text-slate-500" : "text-gray-400"}`}>
                  Separate with commas
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6D1B1B] text-white py-3 rounded-lg hover:bg-[#8B2323] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                Save Profile
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
