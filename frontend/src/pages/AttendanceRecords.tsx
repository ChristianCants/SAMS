import { useState } from "react";
import { Search, Download, Edit2, Calendar } from "lucide-react";
import PageTransition from "../components/layout/PageTransition";
import { Card, CardContent } from "../components/ui/Card";

const recordsData = [
  { id: 1, name: "Ashley Fe G. Espinosa", stuId: "23-6503-956", date: "2026-05-14", status: "present", recordedBy: "Mariza O. Jortil" },
  { id: 2, name: "Cazandra Jean R. Aniban", stuId: "17-0373-610", date: "2026-05-14", status: "present", recordedBy: "Mariza O. Jortil" },
  { id: 3, name: "Christine Baejay E. Gran", stuId: "23-4555-758", date: "2026-05-14", status: "absent", recordedBy: "Mariza O. Jortil" },
  { id: 4, name: "Christine Jane N. Abendan", stuId: "22-0423-182", date: "2026-05-14", status: "late", recordedBy: "Mariza O. Jortil" },
  { id: 5, name: "Dorain P. Conejos", stuId: "23-4775-212", date: "2026-05-14", status: "present", recordedBy: "Mariza O. Jortil" },
];

export default function AttendanceRecords() {
  const [records, setRecords] = useState(recordsData);
  const [editingId, setEditingId] = useState<number | null>(null);

  const StatusBadge = ({ status }: { status: string }) => {
    switch(status) {
      case 'present': return <span className="bg-success/10 text-success px-2.5 py-1 rounded-md text-xs font-semibold">Present</span>;
      case 'absent': return <span className="bg-danger/10 text-danger px-2.5 py-1 rounded-md text-xs font-semibold">Absent</span>;
      case 'late': return <span className="bg-warning/10 text-warning px-2.5 py-1 rounded-md text-xs font-semibold">Late</span>;
      default: return null;
    }
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setRecords(records.map(r => r.id === id ? { ...r, status: newStatus } : r));
    setEditingId(null);
  };

  return (
    <PageTransition className="space-y-6">
      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center w-full sm:w-auto">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search student..." 
                className="pl-9 pr-4 py-2 bg-white/40 border border-white/40 rounded-lg text-sm focus:ring-2 focus:ring-[#10b981]/40 outline-none w-full sm:w-64 backdrop-blur-sm"
              />
            </div>
            
            <select className="px-3 py-2 bg-white/40 border border-white/40 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#10b981]/40 backdrop-blur-sm">
              <option>All Classes</option>
              <option>Grade 10 - Science</option>
            </select>

            <div className="flex items-center border border-white/40 rounded-lg bg-white/40 overflow-hidden backdrop-blur-sm">
              <div className="px-3 py-2 text-gray-500 border-r border-white/40"><Calendar size={16}/></div>
              <input type="date" className="px-3 py-2 bg-transparent text-sm outline-none" />
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-white/40 border border-white/40 hover:bg-white/60 text-gray-700 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto justify-center backdrop-blur-sm">
            <Download size={16} />
            Export CSV
          </button>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/20 text-gray-600 text-sm border-b border-white/30 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Student Name</th>
                <th className="px-6 py-4 font-medium">Student ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Recorded By</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{record.name}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{record.stuId}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{record.date}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{record.recordedBy}</td>
                  <td className="px-6 py-4">
                    {editingId === record.id ? (
                      <select 
                        autoFocus
                        className="text-sm border-gray-300 rounded focus:ring-primary focus:border-primary p-1"
                        value={record.status}
                        onChange={(e) => handleStatusChange(record.id, e.target.value)}
                        onBlur={() => setEditingId(null)}
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                      </select>
                    ) : (
                      <StatusBadge status={record.status} />
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setEditingId(record.id)}
                      className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors inline-flex"
                      title="Edit status"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-white/30 flex items-center justify-between text-sm text-gray-500 bg-white/20 backdrop-blur-sm">
          <span>Showing 1 to 5 of 5 entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-white disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 border border-gray-200 rounded bg-primary text-white">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-white disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </Card>
    </PageTransition>
  );
}
