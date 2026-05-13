import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle, Loader2, User, UserPlus, CheckCircle2 } from "lucide-react";
import PageTransition from "../components/layout/PageTransition";
import { supabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("Student"); // Default to Student, only for signup

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        // --- SIGN UP FLOW ---
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
        
        setSuccessMsg("Account created successfully! Please sign in.");
        setIsSignUp(false); // Flip back to login mode
      } else {
        // --- SIGN IN FLOW ---
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;

        const user = authData.user;
        if (!user) throw new Error("No user returned from authentication.");

        // Fetch User Role from Profiles Table
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) throw new Error("Could not find user profile or role.");

        const userRole = profileData.role;
        localStorage.setItem("sams_role", userRole);

        // Redirect based on Role
        if (userRole === "Admin") navigate("/dashboard");
        else if (userRole === "Teacher") navigate("/teacher-dashboard");
        else navigate("/students");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen relative flex items-center justify-center p-6 sm:p-12 font-sans overflow-hidden bg-black">
      
      {/* Video Background Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10 backdrop-blur-sm"></div>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/login-bg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Main Container - Floating Layout */}
      <div className="max-w-[1200px] w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 relative z-10">
        
        {/* Left Side: Floating Rounded Image (Desktop Only) */}
        <div className="hidden lg:block lg:w-[50%] relative">
          <div className="w-full aspect-square relative rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group">
            <img 
              src="/CIT.jpg" 
              alt="CIT Campus" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1930]/80 via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Right Side: Modern Floating Form */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center max-w-md mx-auto lg:mx-0">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#4f46e5] flex items-center justify-center shadow-lg shadow-[#4f46e5]/40">
                <span className="text-white font-bold text-lg leading-none">S</span>
              </div>
              <span className="text-white/80 font-bold tracking-widest text-sm">SAMS PORTAL</span>
            </div>
            
            <h1 className="text-white text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight leading-[1.1] drop-shadow-lg">
              {isSignUp ? "Create Your Account" : "Sign In to Your Workspace"}
            </h1>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Powered by CIT University</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-200 text-sm">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 rounded-2xl flex items-start gap-3 text-emerald-200 text-sm">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <p>{successMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isSignUp && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <div className="relative">
                  <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full pl-12 pr-6 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md focus:bg-white/10 focus:border-[#4f46e5]/50 focus:ring-1 focus:ring-[#4f46e5]/50 outline-none transition-all text-sm text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("Student")}
                    className={`py-3.5 rounded-full border text-sm font-semibold transition-all ${role === "Student" ? "bg-[#4f46e5] border-[#4f46e5] text-white shadow-lg shadow-[#4f46e5]/30" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("Teacher")}
                    className={`py-3.5 rounded-full border text-sm font-semibold transition-all ${role === "Teacher" ? "bg-[#4f46e5] border-[#4f46e5] text-white shadow-lg shadow-[#4f46e5]/30" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}
                  >
                    Teacher
                  </button>
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="relative">
              <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isSignUp ? "maria@sams.edu" : "admin@sams.edu"}
                className="w-full pl-12 pr-6 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md focus:bg-white/10 focus:border-[#4f46e5]/50 focus:ring-1 focus:ring-[#4f46e5]/50 outline-none transition-all text-sm text-white placeholder:text-gray-400"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-6 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md focus:bg-white/10 focus:border-[#4f46e5]/50 focus:ring-1 focus:ring-[#4f46e5]/50 outline-none transition-all text-sm text-white placeholder:text-gray-400 tracking-widest"
              />
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between pt-2 px-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded border border-white/30 bg-white/5 group-hover:border-white/60 transition-colors flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-white opacity-0 group-hover:opacity-50" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Remember Me</span>
                </label>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center py-4 mt-8 rounded-full bg-white text-[#0a1930] text-sm font-bold hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none"
            >
              <span className="flex items-center gap-2">
                {isLoading ? <Loader2 size={18} className="animate-spin text-[#0a1930]" /> : (isSignUp ? <UserPlus size={18} /> : null)}
                {isLoading ? (isSignUp ? "Creating Account..." : "Signing In...") : (isSignUp ? "Sign In" : "Sign In")}
              </span>
            </button>
            
          </form>

          {/* Footer Elements */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-gray-400 font-medium">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button 
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-white font-bold hover:text-[#4f46e5] transition-colors"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
            
            <p className="text-[10px] text-gray-500 font-medium max-w-xs mx-auto leading-relaxed">
              BY SIGNING IN, YOU AGREE TO SAMS'S <a href="#" className="underline hover:text-white transition-colors">TERMS AND CONDITIONS</a> AND <a href="#" className="underline hover:text-white transition-colors">PRIVACY POLICY</a>.
            </p>
          </div>

        </div>

      </div>
    </PageTransition>
  );
}
