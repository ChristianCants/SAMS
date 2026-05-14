import { useState, useEffect } from "react";
import { Users, Clock, MapPin, ChevronRight, BookOpen, Plus, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/layout/PageTransition";
import ClassModal from "../components/ui/ClassModal";
import { supabase } from "../lib/supabase";

export default function TeacherClasses() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any | null>(null);
  
  const role = localStorage.getItem("sams_role") || "Teacher";
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    setupData();
  }, [role]);

  const setupData = async () => {
    setIsLoading(true);
    
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setCurrentUser(session.user);
    }

    await fetchClasses(session?.user?.id);
  };

  const fetchClasses = async (userId: string | undefined) => {
    let query = supabase
      .from("classes")
      .select(`
        *,
        teacher:profiles(full_name, email)
      `)
      .order("created_at", { ascending: false });

    // If Teacher, only show their classes
    if (role === "Teacher" && userId) {
      query = query.eq("teacher_id", userId);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      setClasses(data);
    } else {
      // Fallback Mock Data for Faculty Mariza O. Jortil
      setClasses([
        {
          id: "mock-1",
          name: "OM334 Project Management",
          subject: "Project Management",
          schedule_time: "B1 M/TH 9:00AM - 10:30AM",
          room: "Room 301",
          color_theme: "bg-[#10b981]",
          teacher: { full_name: "Mariza O. Jortil" }
        },
        {
          id: "mock-2",
          name: "OM334 Project Management",
          subject: "Project Management",
          schedule_time: "B4 T/F 9:00AM - 10:30AM",
          room: "Room 302",
          color_theme: "bg-[#3b82f6]",
          teacher: { full_name: "Mariza O. Jortil" }
        }
      ]);
    }
    setIsLoading(false);
  };

  const handleEdit = (e: React.MouseEvent, cls: any) => {
    e.stopPropagation();
    setEditingClass(cls);
    setIsModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this class?")) {
      await supabase.from("classes").delete().eq("id", id);
      fetchClasses(currentUser?.id);
    }
  };

  const openNewClassModal = () => {
    setEditingClass(null);
    setIsModalOpen(true);
  };

  return (
    <PageTransition className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{role === "Admin" ? "All Classes Management" : "My Classes"}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {role === "Admin" 
              ? "Create classes, assign teachers, and manage school schedules." 
              : "Manage your assigned classes, view student lists, and take attendance."}
          </p>
        </div>
        <button 
          onClick={openNewClassModal}
          className="px-4 py-2 bg-[#10b981] hover:bg-[#10b981]/90 text-white text-sm font-medium rounded-lg transition-all shadow-md shadow-[#10b981]/20 flex items-center gap-2"
        >
          <Plus size={16} />
          Create Class
        </button>
      </div>

      <ClassModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={role}
        currentUser={currentUser}
        editingClass={editingClass}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchClasses(currentUser?.id);
        }}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-gray-500">Loading classes...</div>
      ) : classes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <BookOpen size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800">No classes found</h3>
          <p className="text-gray-500 text-sm mt-1 mb-4">You don't have any classes assigned to you yet.</p>
          <button 
            onClick={openNewClassModal}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            Create Your First Class
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div key={cls.id} className="glass-card rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group border border-white/40 flex flex-col bg-white">
              
              {/* Top Color Bar & Title */}
              <div className="p-6 relative overflow-hidden flex-1">
                <div className={`absolute top-0 right-0 w-32 h-32 ${cls.color_theme || 'bg-[#3b82f6]'} opacity-10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110`}></div>
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700 backdrop-blur-md border border-gray-200 mb-3 shadow-sm">
                      <BookOpen size={12} />
                      {cls.subject || 'No Subject'}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800 tracking-tight">{cls.name || 'Unnamed Class'}</h3>
                    {role === "Admin" && cls.teacher && (
                      <p className="text-sm font-medium text-blue-600 mt-1">Teacher: {cls.teacher.full_name || cls.teacher.email}</p>
                    )}
                  </div>

                  {/* Edit/Delete Actions */}
                  <div className="flex gap-1">
                    <button 
                      onClick={(e) => handleEdit(e, cls)}
                      className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    {(role === "Admin" || (role === "Teacher" && cls.teacher_id === currentUser?.id)) && (
                      <button 
                        onClick={(e) => handleDelete(e, cls.id)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3 mt-6 relative z-10">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                      <Users size={14} className="text-gray-500" />
                    </div>
                    <span className="font-medium">Students Enrolled</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                      <Clock size={14} className="text-gray-500" />
                    </div>
                    <span>{cls.schedule_time || 'No Schedule'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                      <MapPin size={14} className="text-gray-500" />
                    </div>
                    <span>{cls.room || 'No Room Assigned'}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/50 backdrop-blur-md flex items-center gap-3">
                <button 
                  onClick={() => navigate('/attendance')}
                  className="flex-1 py-2.5 bg-white hover:bg-gray-50 text-gray-800 text-sm font-semibold rounded-xl transition-all shadow-sm border border-gray-200 hover:shadow-md"
                >
                  Take Attendance
                </button>
                <button 
                  onClick={() => navigate('/attendance-records')}
                  className={`w-11 h-11 flex items-center justify-center rounded-xl text-white transition-all shadow-sm hover:shadow-md hover:opacity-90 ${cls.color_theme || 'bg-[#3b82f6]'}`}
                  title="View Records"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
