import { useState, useEffect } from "react";
import { X, Edit2, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface EditUserModalProps {
  user: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditUserModal({ user, onClose, onSuccess }: EditUserModalProps) {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("Student");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setRole(user.role || "Student");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          role: role,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to update user.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden animate-in zoom-in-95 duration-300">
        
        <div className="px-8 py-6 border-b border-gray-200/50 flex items-center justify-between bg-white/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center text-blue-500 shadow-inner">
              <Edit2 size={20} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-gray-800 tracking-tight">Edit User</h3>
              <p className="text-xs text-gray-500 font-medium">Update profile details</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 rounded-full transition-all"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

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
              className="w-full px-5 py-3.5 bg-white/60 border border-gray-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium text-gray-800 placeholder:text-gray-400 placeholder:font-normal shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Email (Read Only)</label>
            <input 
              type="email" 
              disabled
              value={user?.email || ""}
              className="w-full px-5 py-3.5 bg-gray-100 border border-gray-200/80 rounded-xl text-sm font-medium text-gray-500 shadow-sm opacity-70 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Role Assignment</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-5 py-3.5 bg-white/60 border border-gray-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium text-gray-800 shadow-sm appearance-none cursor-pointer"
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
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
