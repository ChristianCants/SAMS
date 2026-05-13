import { useState } from "react";
import { X, UserPlus, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface AddUserModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddUserModal({ onClose, onSuccess }: AddUserModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Create user via Supabase Auth
      // Note: If email confirmation is off, this might modify the current session.
      // A more robust implementation would use a backend Edge Function.
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          }
        }
      });

      if (authError) throw authError;

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to create user.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200/50 flex items-center justify-between bg-white/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/10 flex items-center justify-center text-[#10b981] shadow-inner">
              <UserPlus size={20} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-gray-800 tracking-tight">Add New User</h3>
              <p className="text-xs text-gray-500 font-medium">Provision a new student or teacher</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 rounded-full transition-all"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Full Name</label>
            <input 
              type="text" 
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g., John Doe"
              className="w-full px-5 py-3.5 bg-white/60 border border-gray-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] outline-none transition-all text-sm font-medium text-gray-800 placeholder:text-gray-400 placeholder:font-normal shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., user@sams.edu"
              className="w-full px-5 py-3.5 bg-white/60 border border-gray-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] outline-none transition-all text-sm font-medium text-gray-800 placeholder:text-gray-400 placeholder:font-normal shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Temporary Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full px-5 py-3.5 bg-white/60 border border-gray-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] outline-none transition-all text-sm font-medium text-gray-800 placeholder:text-gray-400 placeholder:font-normal shadow-sm tracking-widest"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Role Assignment</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-5 py-3.5 bg-white/60 border border-gray-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] outline-none transition-all text-sm font-medium text-gray-800 shadow-sm appearance-none cursor-pointer"
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="pt-6 mt-4 flex items-center justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100/80 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#10b981]/30 hover:shadow-[#10b981]/50 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
