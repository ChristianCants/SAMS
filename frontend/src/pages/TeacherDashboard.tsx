import { Users, BookOpen, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import PageTransition from "../components/layout/PageTransition";
import AnimatedCounter from "../components/ui/AnimatedCounter";

const todayClasses = [
  { time: "08:00 AM", name: "Grade 10 - Science", status: "completed", attendance: 38, total: 40 },
  { time: "10:30 AM", name: "Grade 11 - Math", status: "in-progress", attendance: 35, total: 35 },
  { time: "01:00 PM", name: "Grade 12 - Physics", status: "upcoming", attendance: 0, total: 32 },
];

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "Overview", path: "/teacher-dashboard" },
    { label: "My Classes", path: "/classes" },
    { label: "Grading", path: "/teacher-grading" },
    { label: "Resources", path: "/settings" } // Mocking Resources to settings for now
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
    <PageTransition className="flex flex-col xl:flex-row gap-6 max-w-[1600px] mx-auto font-sans">
      
      {/* Main Content Area (75%) */}
      <div className="flex-1 space-y-6">
        
        {/* Header & Tabs */}
        <div>
          <h1 className="text-gray-500 text-sm font-medium mb-4">Welcome back, Sarah! Here is your daily overview.</h1>
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

        {/* GLearn Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard title="Total Students" value={107} icon={<Users size={20} className="text-[#10b981]" />} iconBg="bg-[#10b981]/10" />
          <StatCard title="Avg. Attendance" value={95.4} suffix="%" icon={<Clock size={20} className="text-[#10b981]" />} iconBg="bg-[#10b981]/10" />
          <StatCard title="Pending Grading" value={12} icon={<BookOpen size={20} className="text-yellow-500" />} iconBg="bg-yellow-50" />
        </div>

        {/* Today's Classes List */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="font-semibold text-gray-800 mb-6">Today's Classes</h3>
          <div className="space-y-4">
            {todayClasses.map((cls, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-white/40 bg-white/40 hover:bg-white/60 transition-colors">
                <div className="w-20 text-center font-bold text-gray-900 shrink-0">
                  {cls.time.split(' ')[0]}
                  <span className="text-xs text-gray-500 block font-medium">{cls.time.split(' ')[1]}</span>
                </div>
                <div className="w-1 h-12 bg-gray-200 rounded-full shrink-0 relative overflow-hidden">
                   <div className={`absolute top-0 bottom-0 left-0 right-0 ${
                     cls.status === 'completed' ? 'bg-[#10b981]' : cls.status === 'in-progress' ? 'bg-[#f59e0b]' : 'bg-transparent'
                   }`}></div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{cls.name}</h4>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {cls.status === 'upcoming' ? 'Yet to start' : `Attendance: ${cls.attendance}/${cls.total}`}
                  </p>
                </div>
                <div>
                  <button onClick={() => navigate('/attendance')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    cls.status === 'upcoming' 
                      ? 'bg-[#10b981] text-white hover:bg-[#059669] shadow-md shadow-[#10b981]/20' 
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}>
                    {cls.status === 'upcoming' ? 'Take Attendance' : 'View Details'}
                  </button>
                </div>
              </div>
            ))}
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

        {/* Quick Notices (GLearn style vertical timeline) */}
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-6">Recent Notices</h3>
          
          <div className="space-y-4 relative">
             <ScheduleItem 
               initial="F" 
               title="Faculty Meeting" 
               time="04:00 PM" 
               color="bg-[#10b981]" 
               borderColor="border-[#10b981]"
             />
             <ScheduleItem 
               initial="E" 
               title="Lab Equipment Arrived" 
               time="Yesterday" 
               color="bg-yellow-500" 
               borderColor="border-yellow-500"
             />
             <ScheduleItem 
               initial="G" 
               title="Mid-Term Grades Due" 
               time="Friday" 
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
