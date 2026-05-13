import { useState } from "react";
import { Search, CheckCircle2, XCircle, Clock, Calendar as CalendarIcon, Users as UsersIcon } from "lucide-react";
import PageTransition from "../components/layout/PageTransition";
import { Card, CardContent } from "../components/ui/Card";

const studentsData = [
  { id: "STU-001", name: "Alexander Smith", status: "present" },
  { id: "STU-002", name: "Isabella Johnson", status: "present" },
  { id: "STU-003", name: "William Williams", status: "absent" },
  { id: "STU-004", name: "Sophia Brown", status: "late" },
  { id: "STU-005", name: "James Jones", status: "present" },
  { id: "STU-006", name: "Charlotte Garcia", status: null },
  { id: "STU-007", name: "Benjamin Martinez", status: null },
];

export default function TakeAttendance() {
  const [students, setStudents] = useState(studentsData);
  const [showToast, setShowToast] = useState(false);

  const updateStatus = (id: string, status: string) => {
    setStudents(students.map(s => s.id === id ? { ...s, status } : s));
  };

  const markAllPresent = () => {
    setStudents(students.map(s => ({ ...s, status: "present" })));
  };

  const handleSubmit = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <PageTransition className="max-w-6xl mx-auto space-y-6 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-success text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4 z-50">
          <CheckCircle2 size={20} />
          <span className="font-medium">Attendance successfully recorded!</span>
        </div>
      )}

      {/* Header Controls */}
      <Card>
        <CardContent className="pt-6 flex flex-wrap gap-4 items-end justify-between">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Class</label>
              <select className="block w-48 px-3 py-2 bg-white/40 border border-white/40 rounded-lg text-sm focus:ring-2 focus:ring-[#10b981]/40 outline-none backdrop-blur-sm">
                <option>Grade 10 - Science</option>
                <option>Grade 10 - Arts</option>
                <option>Grade 11 - Math</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Section</label>
              <select className="block w-40 px-3 py-2 bg-white/40 border border-white/40 rounded-lg text-sm focus:ring-2 focus:ring-[#10b981]/40 outline-none backdrop-blur-sm">
                <option>Section A</option>
                <option>Section B</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon size={16} className="text-gray-400" />
                </div>
                <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="block w-48 pl-10 px-3 py-2 bg-white/40 border border-white/40 rounded-lg text-sm focus:ring-2 focus:ring-[#10b981]/40 outline-none backdrop-blur-sm" />
              </div>
            </div>
          </div>
          
          <button 
            onClick={markAllPresent}
            className="px-4 py-2 bg-white/40 hover:bg-white/60 text-gray-700 text-sm font-medium rounded-lg transition-colors border border-white/50 flex items-center gap-2 backdrop-blur-sm"
          >
            <UsersIcon size={16} />
            Mark All Present
          </button>
        </CardContent>
      </Card>

      {/* Student List */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-white/30 flex justify-between items-center bg-white/20 backdrop-blur-sm">
          <h2 className="font-semibold text-gray-800">Student Roster (7)</h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search student..." 
              className="pl-9 pr-4 py-1.5 bg-white/40 border border-white/40 rounded-md text-sm focus:ring-2 focus:ring-[#10b981]/40 outline-none w-64 backdrop-blur-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/20 text-gray-600 text-sm border-b border-white/30 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Student Info</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => updateStatus(student.id, 'present')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                          student.status === 'present' 
                            ? 'bg-[#40c057] text-white shadow-md shadow-[#40c057]/20' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <CheckCircle2 size={16} /> Present
                      </button>
                      <button 
                        onClick={() => updateStatus(student.id, 'absent')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                          student.status === 'absent' 
                            ? 'bg-[#fa5252] text-white shadow-md shadow-[#fa5252]/20' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <XCircle size={16} /> Absent
                      </button>
                      <button 
                        onClick={() => updateStatus(student.id, 'late')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                          student.status === 'late' 
                            ? 'bg-[#fd7e14] text-white shadow-md shadow-[#fd7e14]/20' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Clock size={16} /> Late
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-white/20 border-t border-white/30 flex justify-end backdrop-blur-sm">
          <button 
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-[#10b981] hover:bg-[#10b981]/90 text-white font-medium rounded-lg shadow-lg shadow-[#10b981]/20 transition-all active:scale-[0.98]"
          >
            Submit Attendance
          </button>
        </div>
      </Card>
    </PageTransition>
  );
}
