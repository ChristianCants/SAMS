import { FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import PageTransition from "../components/layout/PageTransition";
import { Card, CardContent } from "../components/ui/Card";
import AnimatedCounter from "../components/ui/AnimatedCounter";

const activities = [
  { id: 1, title: "Project Charter", subject: "Project Management", dueDate: "May 15, 2026", status: "graded", score: 92, maxScore: 100 },
  { id: 2, title: "Risk Management Quiz", subject: "Project Management", dueDate: "May 10, 2026", status: "graded", score: 88, maxScore: 100 },
  { id: 3, title: "Gantt Chart Draft", subject: "Project Management", dueDate: "May 18, 2026", status: "submitted", score: null, maxScore: 50 },
  { id: 4, title: "Agile Case Study", subject: "Project Management", dueDate: "May 20, 2026", status: "pending", score: null, maxScore: 100 },
  { id: 5, title: "Stakeholder Analysis", subject: "Project Management", dueDate: "May 12, 2026", status: "late", score: null, maxScore: 50 },
];

export default function StudentActivities() {
  const averageScore = 90;

  return (
    <PageTransition className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Activities & Scores</h1>
        <p className="text-gray-500 mt-1">Track your assignments, submissions, and grades across all subjects.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="hover:border-primary/30 transition-all group">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-500 mb-1">Average Score</p>
            <h3 className="text-3xl font-bold text-primary flex items-baseline gap-1">
              <AnimatedCounter value={averageScore} duration={1} />
              <span className="text-lg text-gray-400 font-medium">/ 100</span>
            </h3>
          </CardContent>
        </Card>
        
        <Card className="hover:border-success/30 transition-all group">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-500 mb-1">Completed</p>
            <h3 className="text-3xl font-bold text-success flex items-baseline gap-1">
              <AnimatedCounter value={3} duration={1} />
              <span className="text-lg text-gray-400 font-medium">/ 5</span>
            </h3>
          </CardContent>
        </Card>
        
        <Card className="hover:border-warning/30 transition-all group">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-500 mb-1">Pending</p>
            <h3 className="text-3xl font-bold text-warning">
              <AnimatedCounter value={1} duration={1} />
            </h3>
          </CardContent>
        </Card>
        
        <Card className="hover:border-danger/30 transition-all group">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-500 mb-1">Missing / Late</p>
            <h3 className="text-3xl font-bold text-danger">
              <AnimatedCounter value={1} duration={1} />
            </h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="p-5 border-b border-white/30 bg-white/20 backdrop-blur-sm flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Current & Past Assignments</h3>
            <div className="flex gap-2">
              <select className="text-sm border-white/40 rounded-md px-2 py-1 bg-white/40 outline-none backdrop-blur-sm">
                <option>All Subjects</option>
                <option>Project Management</option>
              </select>
            </div>
          </div>
          
          <div className="divide-y divide-white/20">
            {activities.map((activity) => (
              <div key={activity.id} className="p-5 hover:bg-white/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 p-2 rounded-lg shrink-0 ${
                    activity.status === 'graded' ? 'bg-success/10 text-success' :
                    activity.status === 'submitted' ? 'bg-primary/10 text-primary' :
                    activity.status === 'late' ? 'bg-danger/10 text-danger' :
                    'bg-warning/10 text-warning'
                  }`}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base">{activity.title}</h4>
                    <p className="text-sm text-gray-500 font-medium">{activity.subject} • Due {activity.dueDate}</p>
                    
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                        activity.status === 'graded' ? 'bg-success/10 text-success' :
                        activity.status === 'submitted' ? 'bg-primary/10 text-primary' :
                        activity.status === 'late' ? 'bg-danger/10 text-danger' :
                        'bg-warning/10 text-warning'
                      }`}>
                        {activity.status === 'graded' && <CheckCircle2 size={12} />}
                        {activity.status === 'submitted' && <CheckCircle2 size={12} />}
                        {activity.status === 'pending' && <Clock size={12} />}
                        {activity.status === 'late' && <AlertCircle size={12} />}
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center sm:justify-end gap-6 sm:w-32 border-t sm:border-t-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
                  {activity.status === 'graded' ? (
                    <div className="text-right w-full">
                      <div className="text-2xl font-bold text-gray-900">{activity.score}</div>
                      <div className="text-xs text-gray-500 font-medium">/ {activity.maxScore} pts</div>
                    </div>
                  ) : activity.status === 'pending' || activity.status === 'late' ? (
                    <button className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-all shadow-md shadow-primary/20">
                      Submit Work
                    </button>
                  ) : (
                    <div className="text-right w-full">
                      <div className="text-sm font-medium text-gray-500">Under Review</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Progress Chart or Recent Feedback */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Latest Feedback</h3>
              <div className="space-y-4">
                <div className="p-4 bg-[#10b981]/10 rounded-xl border border-[#10b981]/20">
                  <h4 className="text-sm font-semibold text-gray-900">Project Charter (Project Management)</h4>
                  <p className="text-sm text-gray-600 mt-2 italic">"Excellent work on the scope definition. The resource allocation was very clear. Keep it up!"</p>
                  <p className="text-xs font-medium text-primary mt-3">- Mariza O. Jortil</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Upcoming Deadlines</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-white/40 text-gray-700 shrink-0 border border-white/50 backdrop-blur-sm">
                    <span className="text-xs font-bold uppercase">May</span>
                    <span className="text-lg font-bold leading-none">20</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Agile Case Study</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Project Management • 11:59 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
