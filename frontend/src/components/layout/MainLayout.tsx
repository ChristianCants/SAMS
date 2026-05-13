import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Settings, Bell, User, Moon, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("sams_role") || "Admin"; // Default to Admin for fallback
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Check initial dark mode preference
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Scroll listener for dynamic navbar
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sams_role");
    navigate("/login");
  };

  const NavItem = ({ to, label, active }: { to: string, label: string, active?: boolean }) => {
    const isActive = active || location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`px-5 py-2 rounded-xl transition-all font-semibold text-[13px] tracking-wide ${
          isActive 
            ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' 
            : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] dark:bg-[#0b1120] font-sans transition-colors duration-300 flex flex-col items-center">
      
      {/* Fixed Glass Navbar Wrapper */}
      <div className="fixed top-0 left-0 w-full flex justify-center z-[100] transition-all duration-500 ease-in-out pointer-events-none">
        <header className={`pointer-events-auto glass-panel dark:bg-gray-900/80 dark:border-gray-800/80 flex items-center justify-between transition-all duration-500 ease-in-out ${
          isScrolled 
            ? "h-[60px] mt-4 px-8 w-fit gap-8 sm:gap-16 rounded-full shadow-xl shadow-gray-200/50 dark:shadow-black/40 backdrop-blur-2xl bg-white/80 border border-white/60" 
            : "w-[95%] max-w-[1600px] h-[76px] mt-6 px-8 rounded-[2rem] shadow-sm bg-white/50"
        }`}>
          
          {/* Logo */}
          <div className={`flex items-center cursor-pointer transition-all duration-300 ${isScrolled ? "gap-2" : "gap-3"}`} onClick={() => navigate('/dashboard')}>
            <div className={`rounded-full bg-black dark:bg-white flex items-center justify-center shadow-sm transition-all duration-300 ${isScrolled ? "w-7 h-7" : "w-9 h-9"}`}>
              <svg viewBox="0 0 24 24" fill="none" className={`text-white dark:text-black transition-all duration-300 ${isScrolled ? "w-4 h-4" : "w-5 h-5"}`} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className={`font-black tracking-tighter text-gray-900 dark:text-white transition-all duration-300 ${isScrolled ? "text-lg" : "text-xl"}`}>
              SAMS
            </span>
          </div>
          
          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {role === "Admin" && (
              <>
                <NavItem to="/dashboard" label="Dashboard" />
                <NavItem to="/classes" label="Classes" />
                <NavItem to="/attendance-records" label="Attendance" />
                <NavItem to="/reports" label="Reports" />
                <NavItem to="/users" label="Users" />
              </>
            )}

            {role === "Teacher" && (
              <>
                <NavItem to="/teacher-dashboard" label="Dashboard" />
                <NavItem to="/teacher-classes" label="Classes" />
                <NavItem to="/attendance" label="Take Attendance" />
                <NavItem to="/attendance-records" label="Records" />
                <NavItem to="/reports" label="Reports" />
                <NavItem to="/teacher-grading" label="Grading" />
              </>
            )}

            {role === "Student" && (
              <>
                <NavItem to="/students" label="Dashboard" />
                <NavItem to="/student-activities" label="Activities" />
                <NavItem to="/attendance-records" label="Attendance" />
              </>
            )}
          </nav>
          
          {/* Right Actions */}
          <div className="flex items-center gap-5">
            
            <button onClick={() => navigate('/settings')} className="hidden sm:flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
              <Settings size={isScrolled ? 18 : 20} strokeWidth={1.5} className="transition-all duration-300" />
              {!isScrolled && <span className="text-[13px] font-semibold transition-all duration-300">Settings</span>}
            </button>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <button onClick={toggleDarkMode} className="p-1.5 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Moon size={18} strokeWidth={1.5} />
              </button>

              <button className="relative p-1.5 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Bell size={18} strokeWidth={1.5} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
              </button>

              <button onClick={() => navigate('/profile')} className="p-1.5 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <User size={18} strokeWidth={1.5} />
              </button>

              <button onClick={handleLogout} className="p-1.5 rounded-full text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors">
                <LogOut size={18} strokeWidth={1.5} />
              </button>
            </div>

          </div>
        </header>
      </div>

      {/* Main Content Area - Added pt-[120px] to account for fixed header and prevent layout shift */}
      <main className="w-full max-w-[1600px] flex-1 flex flex-col min-w-0 pt-[120px] px-4 md:px-8 pb-12">
        <Outlet />
      </main>
    </div>
  );
}
