import { Users, Building2, Calendar as CalendarIcon, ChevronLeft, ChevronRight, UserPlus, FileText, ArrowUpRight, Settings } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/layout/PageTransition";
import { supabase } from "../lib/supabase";

const weeklyOverview = [
  { name: 'Mon', value: 18, recurring: 2 },
  { name: 'Tue', value: 19, recurring: 1 },
  { name: 'Wed', value: 20, recurring: 0 },
  { name: 'Thu', value: 17, recurring: 3 },
  { name: 'Fri', value: 19, recurring: 1 },
];

const attendanceSummaryData = [
  { name: 'Present', value: 18, color: '#f59e0b' },
  { name: 'Absent', value: 1, color: '#3b82f6' },
  { name: 'Late', value: 1, color: '#ef4444' },
];

const classAttendanceData = [
  { class: 'OM334 Project Management B1', present: 18, absent: 1, late: 1, percent: 90, color: "text-[#10b981]", earnings: "Mariza O. Jortil" },
  { class: 'OM334 Project Management B4', present: 19, absent: 1, late: 0, percent: 95, color: "text-[#3b82f6]", earnings: "Mariza O. Jortil" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalStudents: "...",
    totalTeachers: "...",
    totalClasses: "..."
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const { count: studentCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'Student');
          
        const { count: teacherCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'Teacher');
          
        const { count: classCount } = await supabase
          .from('classes')
          .select('*', { count: 'exact', head: true });

        setStats({
          totalStudents: studentCount?.toString() || "0",
          totalTeachers: teacherCount?.toString() || "0",
          totalClasses: classCount?.toString() || "0",
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Fallback to mock data if no connection or tables don't exist yet
        setStats({ totalStudents: "1,525", totalTeachers: "12", totalClasses: "8" });
      }
    }
    fetchStats();
  }, []);

  // Dynamic Date Logic
  const today = new Date();
  const monthName = today.toLocaleDateString('en-US', { month: 'long' });
  const year = today.getFullYear();
  const dateNum = today.getDate();
  
  // Calendar Grid Logic
  const daysInMonth = new Date(year, today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, today.getMonth(), 1).getDay();
  const calendarDays = [];
  
  for (let i = 0; i < firstDayOfMonth; i++) { calendarDays.push(null); }
  for (let i = 1; i <= daysInMonth; i++) { calendarDays.push(i); }

  return (
    <PageTransition className="flex flex-col gap-6 max-w-[1600px] mx-auto font-sans bg-[#f4f7fb]">
      
      {/* Top Row: 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={<Users size={18} className="text-[#6366f1]" />} 
          iconBg="bg-[#6366f1]/10" 
        />
        <StatCard 
          title="Today's Attendance" 
          value="92%" 
          icon={<CalendarIcon size={18} className="text-[#8b5cf6]" />} 
          iconBg="bg-[#8b5cf6]/10" 
        />
        <StatCard 
          title="Total Teachers" 
          value={stats.totalTeachers} 
          icon={<ArrowUpRight size={18} className="text-[#10b981]" />} 
          iconBg="bg-[#10b981]/10" 
          isTrend={true}
        />
        <StatCard 
          title="Total Classes" 
          value={stats.totalClasses} 
          icon={<ArrowUpRight size={18} className="text-[#ef4444]" />} 
          iconBg="bg-[#ef4444]/10" 
          isTrend={true}
        />
      </div>

      {/* Middle Row: Chart (2 cols) & Pie (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Col 1-2: Attendance Overview (Bar Chart like reference image) */}
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 lg:col-span-2 flex flex-col relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <BarChart2Icon className="text-gray-400 w-5 h-5" />
              <h3 className="font-bold text-gray-900">Attendance Overview</h3>
            </div>
            <div className="flex items-center gap-4 text-sm font-semibold text-gray-500">
              <button className="text-gray-900 px-3 py-1 bg-gray-50 rounded-lg">Monthly</button>
              <button className="hover:text-gray-900 transition-colors">Quarterly</button>
              <button className="hover:text-gray-900 transition-colors">Yearly</button>
            </div>
          </div>
          
          <div className="flex items-center gap-6 mb-4 text-xs font-semibold text-gray-500">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#e0e7ff]"></span>Present</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#6366f1]"></span>Absent/Late</div>
          </div>

          <div className="flex-1 w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyOverview} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(val) => `${val}K`} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="recurring" stackId="a" fill="#e0e7ff" radius={[0, 0, 4, 4]} barSize={32} />
                <Bar dataKey="value" stackId="a" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Col 3: Today's Attendance Summary */}
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <TrophyIcon className="text-gray-400 w-5 h-5" />
              <h3 className="font-bold text-gray-900">Today's Summary</h3>
            </div>
            <button className="text-xs font-semibold text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">See All</button>
          </div>

          <div className="flex items-center justify-center relative h-48 w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceSummaryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                >
                  {attendanceSummaryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-semibold text-gray-500">Total Students</span>
              <span className="text-xl font-bold text-gray-900 leading-none mt-1">128</span>
            </div>
          </div>

          <div className="space-y-4 w-full">
            {attendanceSummaryData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm w-full">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="font-semibold text-gray-600">{item.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 font-medium">{item.value}</span>
                  <span className="font-bold text-gray-900 w-8 text-right">{Math.round((item.value / 20) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Row: List (1 col) & Table (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Col 1: Recent Activities */}
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <HistoryIcon className="text-gray-400 w-5 h-5" />
              <h3 className="font-bold text-gray-900">Recent Activity</h3>
            </div>
            <button className="text-xs font-semibold text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">See All</button>
          </div>
          
          <div className="flex-1 space-y-5">
            <ActivityItem 
              icon={<UserPlus size={16} className="text-[#3b82f6]" />} 
              iconBg="bg-[#3b82f6]/10"
              title="Attendance for OM334 Project Management"
              subtitle="Mariza O. Jortil • 10:30 AM"
              badge="New Record"
              badgeColor="text-[#3b82f6] bg-[#3b82f6]/10"
            />
            <ActivityItem 
              icon={<Building2 size={16} className="text-[#ef4444]" />} 
              iconBg="bg-[#ef4444]/10"
              title="Low Attendance Alert"
              subtitle="OM334 B4 • 09:15 AM"
              badge="Low Count"
              badgeColor="text-[#ef4444] bg-[#ef4444]/10"
            />
            <ActivityItem 
              icon={<FileText size={16} className="text-[#8b5cf6]" />} 
              iconBg="bg-[#8b5cf6]/10"
              title="Monthly Report Generated"
              subtitle="System • 8:00 AM"
              badge="Report"
              badgeColor="text-[#8b5cf6] bg-[#8b5cf6]/10"
            />
            <ActivityItem 
              icon={<Users size={16} className="text-gray-600" />} 
              iconBg="bg-gray-100"
              title="System Update"
              subtitle="Version 1.2.1 • Yesterday"
              badge="System"
              badgeColor="text-gray-600 bg-gray-100"
            />
          </div>
        </div>

        {/* Col 2-3: Class Attendance Table */}
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 lg:col-span-2 flex flex-col relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BoxIcon className="text-gray-400 w-5 h-5" />
              <h3 className="font-bold text-gray-900">Class Attendance</h3>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 text-xs font-semibold text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                <SortIcon className="w-3 h-3" /> Sort
              </button>
              <button className="flex items-center gap-2 text-xs font-semibold text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                <FilterIcon className="w-3 h-3" /> Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400 font-semibold border-b border-gray-100">
                <tr>
                  <th className="pb-4 font-medium flex items-center gap-1">Class <UpDownIcon /></th>
                  <th className="pb-4 font-medium">Present <UpDownIcon className="inline" /></th>
                  <th className="pb-4 font-medium">Absent <UpDownIcon className="inline" /></th>
                  <th className="pb-4 font-medium">Late <UpDownIcon className="inline" /></th>
                  <th className="pb-4 font-medium text-right">Attendance % <UpDownIcon className="inline ml-1" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {classAttendanceData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 text-gray-900 font-bold flex items-center gap-3">
                      <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[10px]">🏢</div>
                      {row.class}
                    </td>
                    <td className="py-4 text-gray-500 font-medium">{row.present}</td>
                    <td className="py-4 text-gray-500 font-medium">{row.absent}</td>
                    <td className="py-4 text-gray-500 font-medium">{row.late}</td>
                    <td className="py-4 text-right">
                      <span className={`font-bold ${row.percent >= 90 ? 'text-[#10b981]' : row.percent >= 85 ? 'text-[#3b82f6]' : 'text-[#f59e0b]'}`}>
                        {row.percent}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Row 4: Calendar & Quick Actions (to preserve old functionality) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar */}
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col relative">
          <h3 className="font-bold text-gray-900 mb-6">Calendar</h3>
          
          <div className="flex items-center justify-between mb-6">
            <button className="p-1 hover:bg-gray-100 rounded-md text-gray-400 transition-colors"><ChevronLeft size={18} /></button>
            <span className="font-bold text-gray-900 text-sm">{monthName} {year}</span>
            <button className="p-1 hover:bg-gray-100 rounded-md text-gray-400 transition-colors"><ChevronRight size={18} /></button>
          </div>

          <div className="grid grid-cols-7 text-center mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-[11px] font-bold text-gray-400 mb-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-2 text-center text-sm font-bold text-gray-700 mb-6">
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`}></div>;
              const isToday = day === dateNum;
              if (isToday) {
                return (
                  <div key={day} className="flex flex-col items-center justify-center relative">
                    <div className="bg-[#6366f1] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto shadow-sm">{day}</div>
                  </div>
                );
              }
              return <div key={day} className="flex items-center justify-center h-8 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">{day}</div>;
            })}
          </div>

          <div className="border-t border-gray-100 pt-6 mt-auto">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Today's Schedule</h4>
            <div className="space-y-4">
               <div className="flex items-start gap-3">
                 <div className="w-1.5 h-10 bg-[#10b981] rounded-full"></div>
                 <div>
                   <h4 className="text-sm font-bold text-gray-900 leading-tight">Grade 10 - Section A</h4>
                   <p className="text-xs text-gray-500 font-medium mt-1">09:00 AM - 10:00 AM</p>
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <div className="w-1.5 h-10 bg-[#f59e0b] rounded-full"></div>
                 <div>
                   <h4 className="text-sm font-bold text-gray-900 leading-tight">Grade 11 - Section B</h4>
                   <p className="text-xs text-gray-500 font-medium mt-1">11:00 AM - 12:30 PM</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Quick Actions (Bento Box Layout) */}
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 lg:col-span-2 flex flex-col relative">
          <h3 className="font-bold text-gray-900 mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 flex-1 min-h-[200px]">
            {/* Action 1: Large primary action */}
            <button 
              onClick={() => navigate('/users')}
              className="col-span-2 row-span-2 flex flex-col items-start justify-end p-6 rounded-3xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-white relative overflow-hidden group"
            >
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md mb-auto shadow-inner">
                <UserPlus size={24} className="text-white" />
              </div>
              <h4 className="text-xl font-bold mt-4">Add Teacher</h4>
              <p className="text-white/80 text-sm font-medium mt-1">Register a new faculty member</p>
            </button>

            {/* Action 2: Wide action */}
            <button 
              onClick={() => navigate('/attendance-records')}
              className="col-span-2 row-span-1 flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#10b981] hover:bg-[#10b981]/5 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-full bg-[#10b981]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <CalendarIcon size={20} className="text-[#10b981]" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-gray-900">Record Entry</h4>
                <p className="text-xs text-gray-500 font-medium">Log today's attendance</p>
              </div>
            </button>

            {/* Action 3: Small square */}
            <button 
              onClick={() => navigate('/reports')}
              className="col-span-1 row-span-1 flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 group"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 group-hover:shadow-md transition-shadow">
                <FileText size={18} className="text-gray-700" />
              </div>
              <span className="text-xs font-bold text-gray-800">New Report</span>
            </button>

            {/* Action 4: Small square */}
            <button 
              onClick={() => navigate('/settings')}
              className="col-span-1 row-span-1 flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 group"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 group-hover:shadow-md transition-shadow">
                <Settings size={18} className="text-gray-700" />
              </div>
              <span className="text-xs font-bold text-gray-800">Settings</span>
            </button>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}

// Sub-components

function StatCard({ title, value, icon, iconBg, isTrend = false }: { title: string, value: string, icon: React.ReactNode, iconBg: string, isTrend?: boolean }) {
  return (
    <div className="bg-white p-5 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100 group">
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
            {icon}
          </div>
          <p className="text-xs font-semibold text-gray-500">{title}</p>
        </div>
        <h4 className="text-[1.75rem] font-bold text-gray-900 mt-1">{value}</h4>
      </div>
      {isTrend && (
        <div className="self-end pb-2">
          {icon}
        </div>
      )}
    </div>
  );
}

function ActivityItem({ icon, iconBg, title, subtitle, badge, badgeColor }: any) {
  return (
    <div className="flex items-center justify-between p-3 border border-gray-50 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500 font-medium mt-0.5">{subtitle}</p>
        </div>
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${badgeColor}`}>
        {badge}
      </span>
    </div>
  );
}

// QuickActionBtn is now inline in the bento layout above, so we can remove it.

// Icons for exact match to reference
const BarChart2Icon = ({className}:any) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>;
const TrophyIcon = ({className}:any) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
const HistoryIcon = ({className}:any) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>;
const BoxIcon = ({className}:any) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const SortIcon = ({className}:any) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4"/></svg>;
const FilterIcon = ({className}:any) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const UpDownIcon = ({className}:any) => <svg className={`w-3 h-3 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m7 15 5 5 5-5M7 9l5-5 5 5"/></svg>;
