import { Book, Clock, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import PageTransition from "../components/layout/PageTransition";
import AnimatedCounter from "../components/ui/AnimatedCounter";
import { supabase } from "../lib/supabase";

const recentAttendance = [
  { date: "May 10, 2026", status: "Present", timeIn: "07:45 AM" },
  { date: "May 09, 2026", status: "Present", timeIn: "07:50 AM" },
  { date: "May 08, 2026", status: "Late", timeIn: "08:15 AM" },
  { date: "May 07, 2026", status: "Absent", timeIn: "--" },
];

export default function StudentSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        if (profile?.full_name) {
          // Extract first name
          const firstName = profile.full_name.split(' ')[0];
          setUserName(firstName);
        }
      }
    }
    fetchUser();
  }, []);

  const tabs = [
    { label: "Overview", path: "/students" },
    { label: "Activities", path: "/student-activities" },
    { label: "History", path: "/attendance-records" }
  ];

  // Dynamic Date Logic
  const today = new Date();
  const monthName = today.toLocaleDateString('en-US', { month: 'long' });
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateNum = today.getDate();
  const year = today.getFullYear();
  
  // Calendar Grid Logic
  const daysInMonth = new Date(year, today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, today.getMonth(), 1).getDay();
  const calendarDays = [];
  
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <PageTransition className="flex flex-col xl:flex-row gap-6 max-w-[1600px] mx-auto font-sans w-full">
      
      {/* Main Content Area (75%) */}
      <div className="flex-1 space-y-6 min-w-0">
        
        {/* Header & Tabs */}
        <div>
          <h1 className="text-gray-500 text-sm font-medium mb-4">Welcome back, {userName}! Here is your attendance summary.</h1>
          <div className="flex items-center gap-6 border-b border-gray-200">
            {tabs.map((tab, idx) => {
              const isActive = location.pathname === tab.path;
              return (
                <button 
                  key={idx}
                  onClick={() => navigate(tab.path)}
                  className={`pb-3 px-1 text-sm font-semibold transition-all ${
                    isActive 
                      ? 'text-[#10b981] border-b-2 border-[#10b981]' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* GLearn Stat Cards Grid (2x2 for student) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Total School Days" value={180} icon={<Book size={20} className="text-gray-500" />} iconBg="bg-gray-100" />
          <StatCard title="Days Present" value={162} icon={<CheckCircle size={20} className="text-[#10b981]" />} iconBg="bg-[#10b981]/10" />
          <StatCard title="Days Absent" value={12} icon={<AlertTriangle size={20} className="text-red-400" />} iconBg="bg-red-50" />
          <StatCard title="Days Late" value={6} icon={<Clock size={20} className="text-yellow-500" />} iconBg="bg-yellow-50" />
        </div>

        {/* Progress & Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Overall Attendance Progress */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center items-center text-center">
            <h3 className="font-semibold text-gray-800 mb-6 self-start">Overall Attendance</h3>
            
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" fill="transparent" stroke="#f3f4f6" strokeWidth="12" />
                <circle cx="80" cy="80" r="70" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray={440} strokeDashoffset={440 - (440 * 90) / 100} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-gray-800">90%</span>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Excellent</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mt-6 max-w-xs">You are currently above the required 85% attendance threshold. Keep it up!</p>
          </div>

          {/* Recent History List */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-semibold text-gray-800 mb-6">Recent History</h3>
            <div className="space-y-4">
              {recentAttendance.map((record, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-white/40 bg-white/40 hover:bg-white/60 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{record.date}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Time in: {record.timeIn}</p>
                  </div>
                  <div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      record.status === 'Present' ? 'bg-[#10b981]/10 text-[#10b981]' : 
                      record.status === 'Late' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-600'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/attendance-records')} className="w-full mt-4 py-2 text-sm font-semibold text-[#10b981] hover:bg-[#10b981]/5 rounded-lg transition-colors">
              View Full History
            </button>
          </div>
        </div>

      </div>


      {/* Right Sidebar Area (25%) */}
      <div className="w-full xl:w-[340px] shrink-0 space-y-6">
        
        {/* Calendar Widget */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800 text-lg">{monthName}, {dateNum} <span className="font-normal text-gray-500 text-base">{dayName}</span></h3>
            <div className="flex items-center gap-1">
              <button className="p-1 hover:bg-gray-100 rounded-md text-gray-400 transition-colors"><ChevronLeft size={18} /></button>
              <button className="p-1 hover:bg-gray-100 rounded-md text-gray-400 transition-colors"><ChevronRight size={18} /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-4 text-center text-sm font-medium text-gray-700">
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`}></div>;
              
              const isToday = day === dateNum;
              
              if (isToday) {
                return (
                  <div key={day} className="flex flex-col items-center justify-center relative">
                    <div className="bg-[#10b981] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto shadow-sm shadow-[#10b981]/40 ring-4 ring-[#10b981]/20 z-10">{day}</div>
                  </div>
                );
              }
              
              return <div key={day} className="flex items-center justify-center h-8 hover:bg-white/40 rounded-full cursor-pointer">{day}</div>;
            })}
          </div>
        </div>

        {/* My Schedule (GLearn style vertical timeline) */}
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-6">My Schedule</h3>
          
          <div className="space-y-4 relative">
             <ScheduleItem 
               initial="S" 
               title="Science Lecture" 
               time="08:00 AM - 09:30 AM" 
               color="bg-teal-600" 
               borderColor="border-teal-600"
             />
             <ScheduleItem 
               initial="M" 
               title="Mathematics" 
               time="10:00 AM - 11:30 AM" 
               color="bg-yellow-500" 
               borderColor="border-yellow-500"
             />
             <ScheduleItem 
               initial="H" 
               title="History Seminar" 
               time="01:00 PM - 02:30 PM" 
               color="bg-red-500" 
               borderColor="border-red-500"
             />
          </div>
        </div>

      </div>
    </PageTransition>
  );
}

// Sub-components

function StatCard({ title, value, suffix = "", icon, iconBg }: { title: string, value: number, suffix?: string, icon: React.ReactNode, iconBg: string }) {
  return (
    <div className="glass-card p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        <div className="w-8 h-3 rounded-full bg-[#10b981] opacity-90"></div>
      </div>
      
      <div>
        <h4 className="text-3xl font-bold text-gray-800 tracking-tight flex items-baseline">
          <AnimatedCounter value={value} duration={1} />
          {suffix && <span className="text-xl ml-1">{suffix}</span>}
        </h4>
        <p className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-wide">{title}</p>
      </div>
    </div>
  );
}

function ScheduleItem({ initial, title, time, color, borderColor }: { initial: string, title: string, time: string, color: string, borderColor: string }) {
  return (
    <div className={`pl-4 py-2 border-l-[3px] ${borderColor} rounded-r-lg hover:bg-white/40 transition-colors flex items-center gap-4`}>
      <div className={`w-10 h-10 rounded-full ${color} text-white flex items-center justify-center font-bold shrink-0 shadow-sm`}>
        {initial}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
        <p className="text-[11px] text-gray-500 font-medium mt-0.5">{time}</p>
      </div>
    </div>
  );
}
