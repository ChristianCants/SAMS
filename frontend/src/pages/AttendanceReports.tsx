import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, FileText } from 'lucide-react';
import PageTransition from "../components/layout/PageTransition";
import { Card, CardContent } from "../components/ui/Card";
import AnimatedCounter from "../components/ui/AnimatedCounter";

const barData = [
  { name: 'OM334 B1', attendance: 90 },
  { name: 'OM334 B4', attendance: 95 },
];

const lineData = [
  { name: 'Week 1', attendance: 91 },
  { name: 'Week 2', attendance: 94 },
  { name: 'Week 3', attendance: 92 },
  { name: 'Week 4', attendance: 93 },
];

export default function AttendanceReports() {
  return (
    <PageTransition className="space-y-6">
      {/* Controls */}
      <Card>
        <CardContent className="pt-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex flex-wrap gap-4 items-center">
            <select className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20">
              <option>All Sections</option>
              <option>Section B1 M/TH</option>
              <option>Section B4 T/F</option>
            </select>
            <select className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20">
              <option>Monthly Report</option>
              <option>Weekly Report</option>
              <option>Daily Report</option>
            </select>
            <input type="month" className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20" defaultValue="2026-05" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow-md">
              <Download size={16} />
              CSV
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-all shadow-md shadow-primary/20 active:scale-[0.98]">
              <FileText size={16} />
              Export PDF
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="text-center group hover:border-primary/30 transition-all">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-500 mb-2">Overall Attendance</p>
            <h3 className="text-4xl font-bold text-[#3b5bdb]">
              <AnimatedCounter value={92.5} suffix="%" duration={1} />
            </h3>
          </CardContent>
        </Card>
        <Card className="text-center group hover:border-[#40c057]/30 transition-all">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-500 mb-2">Perfect Attendance (Students)</p>
            <h3 className="text-4xl font-bold text-[#40c057]">
              <AnimatedCounter value={15} duration={1} />
            </h3>
          </CardContent>
        </Card>
        <Card className="text-center group hover:border-[#fa5252]/30 transition-all">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-500 mb-2">Most Absent Section</p>
            <h3 className="text-2xl font-bold text-[#fa5252] mt-2">OM334 B1</h3>
            <p className="text-xs text-gray-400 mt-1">90% average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-6 text-gray-800">Class Comparison</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f4f6f9' }} />
                  <Bar dataKey="attendance" fill="#3b5bdb" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-6 text-gray-800">Attendance Trend</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="attendance" stroke="#40c057" strokeWidth={3} dot={{ r: 4, fill: '#40c057', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
