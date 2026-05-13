import { useState } from "react";
import { Search, Plus, Filter, Save, FileSpreadsheet, Upload } from "lucide-react";
import PageTransition from "../components/layout/PageTransition";
import { Card, CardContent } from "../components/ui/Card";
import DataImporter from "../components/ui/DataImporter";

const studentsData = [
  { id: "STU-001", name: "Alexander Smith", score: 85, status: "submitted" },
  { id: "STU-002", name: "Isabella Johnson", score: 92, status: "submitted" },
  { id: "STU-003", name: "William Williams", score: null, status: "pending" },
  { id: "STU-004", name: "Sophia Brown", score: 78, status: "submitted" },
  { id: "STU-005", name: "James Jones", score: null, status: "pending" },
];

export default function TeacherGrading() {
  const [students, setStudents] = useState(studentsData);
  const [showImporter, setShowImporter] = useState(false);

  const handleScoreChange = (id: string, newScore: string) => {
    const num = parseInt(newScore);
    if (isNaN(num) && newScore !== "") return;
    setStudents(students.map(s => s.id === id ? { ...s, score: newScore === "" ? null : num } : s));
  };

  return (
    <PageTransition className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Grading & Activities</h1>
          <p className="text-gray-500 mt-1">Manage assignments and input scores for your classes.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowImporter(true)}
            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <Upload size={16} />
            Import Scores
          </button>
          <button className="px-4 py-2 bg-[#10b981] hover:bg-[#10b981]/90 text-white text-sm font-medium rounded-lg transition-all shadow-md shadow-[#10b981]/20 flex items-center gap-2">
            <Plus size={16} />
            New Activity
          </button>
        </div>
      </div>

      {showImporter && (
        <DataImporter 
          tableName="student_scores"
          title="Import Student Scores"
          description="Upload a CSV/Excel file. Map columns like 'Student ID' and 'Score'. Any extra columns (like 'Teacher Feedback') will be dynamically saved in metadata!"
          fieldMapping={{
            "Student ID": "student_id",
            "Student Email": "student_id", 
            "Score": "score",
            "Grade": "score",
            "Status": "status",
            "Activity ID": "activity_id"
          }}
          onClose={() => setShowImporter(false)}
          onSuccess={() => {
            setShowImporter(false);
            // Would refetch data here
          }}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Activity List Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="hover:border-[#10b981] transition-colors cursor-pointer border-[#10b981] shadow-sm">
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900">Mid-term Project</h4>
              <p className="text-xs text-gray-500 mt-1">Grade 10 - Science</p>
              <div className="mt-3 flex items-center justify-between text-xs font-medium">
                <span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Active</span>
                <span className="text-gray-500">3/5 Graded</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:border-gray-300 transition-colors cursor-pointer opacity-70 hover:opacity-100">
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900">Lab Report 3</h4>
              <p className="text-xs text-gray-500 mt-1">Grade 10 - Science</p>
              <div className="mt-3 flex items-center justify-between text-xs font-medium">
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Completed</span>
                <span className="text-gray-500">5/5 Graded</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-gray-300 transition-colors cursor-pointer opacity-70 hover:opacity-100">
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900">Chapter 4 Quiz</h4>
              <p className="text-xs text-gray-500 mt-1">Grade 11 - Math</p>
              <div className="mt-3 flex items-center justify-between text-xs font-medium">
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Completed</span>
                <span className="text-gray-500">35/35 Graded</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grading Panel */}
        <Card className="lg:col-span-3 overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-gray-50">
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">Mid-term Project</h3>
              <p className="text-sm text-gray-500">Max Score: 100 points • Due: May 15, 2026</p>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search student..." 
                  className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#10b981]/40 outline-none w-full sm:w-48"
                />
              </div>
              <button className="p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors">
                <Filter size={18} />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1 bg-white">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Student Name</th>
                  <th className="px-6 py-4 font-medium">Submission Status</th>
                  <th className="px-6 py-4 font-medium w-32">Score</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{student.name}</div>
                      <div className="text-xs text-gray-500">{student.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold capitalize ${
                        student.status === 'submitted' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          value={student.score === null ? "" : student.score}
                          onChange={(e) => handleScoreChange(student.id, e.target.value)}
                          placeholder="-"
                          className="w-16 px-2 py-1.5 border border-gray-300 rounded text-center text-sm font-medium focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] outline-none"
                        />
                        <span className="text-gray-400 text-sm">/ 100</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {student.status === 'submitted' && (
                        <button className="text-sm font-medium text-blue-600 hover:underline flex items-center justify-end gap-1 w-full">
                          <FileSpreadsheet size={14} /> View Work
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
             <button className="px-5 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors text-sm shadow-sm">
               Save Draft
             </button>
             <button className="px-5 py-2 bg-[#10b981] hover:bg-[#10b981]/90 text-white font-medium rounded-lg shadow-md shadow-[#10b981]/20 transition-all active:scale-[0.98] text-sm flex items-center gap-2">
               <Save size={16} /> Publish Grades
             </button>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
