import { useState, useEffect } from "react";
import { X, BookOpen, Clock, MapPin, User, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role: string;
  currentUser: any;
  editingClass?: any | null; // Pass a class object if editing
}

const colorThemes = [
  "bg-[#3b82f6]", "bg-[#10b981]", "bg-[#8b5cf6]", "bg-[#f59e0b]", "bg-[#ef4444]", "bg-[#06b6d4]", "bg-[#8b5cf6]"
];

export default function ClassModal({ isOpen, onClose, onSuccess, role, currentUser, editingClass }: ClassModalProps) {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    room: "",
    schedule_time: "",
    color_theme: "bg-[#3b82f6]",
    teacher_id: ""
  });

  useEffect(() => {
    if (isOpen) {
      if (editingClass) {
        setFormData({
          name: editingClass.name || "",
          subject: editingClass.subject || "",
          room: editingClass.room || "",
          schedule_time: editingClass.schedule_time || "",
          color_theme: editingClass.color_theme || "bg-[#3b82f6]",
          teacher_id: editingClass.teacher_id || ""
        });
      } else {
        // Defaults for new class
        setFormData({
          name: "",
          subject: "",
          room: "",
          schedule_time: "",
          color_theme: colorThemes[Math.floor(Math.random() * colorThemes.length)],
          teacher_id: role === "Teacher" && currentUser ? currentUser.id : ""
        });
      }

      if (role === "Admin") {
        fetchTeachers();
      }
    }
  }, [isOpen, editingClass, role, currentUser]);

  const fetchTeachers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("role", "Teacher")
      .order("full_name");
      
    if (!error && data) {
      setTeachers(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Ensure Teacher is assigned if role is teacher
    const submitData = {
      ...formData,
      teacher_id: role === "Teacher" ? currentUser?.id : formData.teacher_id
    };

    try {
      if (editingClass?.id) {
        // Update
        const { error } = await supabase
          .from("classes")
          .update(submitData)
          .eq("id", editingClass.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from("classes")
          .insert([submitData]);
        if (error) throw error;
      }
      onSuccess();
    } catch (err) {
      console.error("Failed to save class", err);
      alert("Failed to save class. Check console.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{editingClass ? "Edit Class" : "Create New Class"}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{editingClass ? "Modify class details and teacher assignments." : "Set up a new class structure."}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Class Name</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Grade 10 - Section A" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <BookOpen size={14} className="text-gray-400" /> Subject
              </label>
              <input 
                required
                type="text" 
                placeholder="e.g. Advanced Science" 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Clock size={14} className="text-gray-400" /> Time Schedule
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. 09:00 AM - 10:30 AM" 
                  value={formData.schedule_time}
                  onChange={(e) => setFormData({...formData, schedule_time: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin size={14} className="text-gray-400" /> Room
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Room 101 or Lab 2" 
                  value={formData.room}
                  onChange={(e) => setFormData({...formData, room: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] outline-none transition-colors"
                />
              </div>
            </div>

            {role === "Admin" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <User size={14} className="text-[#3b82f6]" /> Assign Teacher
                </label>
                <select 
                  required
                  value={formData.teacher_id}
                  onChange={(e) => setFormData({...formData, teacher_id: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] outline-none transition-colors"
                >
                  <option value="" disabled>Select a teacher...</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.full_name || t.email}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Color Theme</label>
              <div className="flex gap-3">
                {colorThemes.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({...formData, color_theme: color})}
                    className={`w-8 h-8 rounded-full ${color} ${formData.color_theme === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110 shadow-md' : 'opacity-70 hover:opacity-100 hover:scale-105'} transition-all`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button 
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSaving || (role === "Admin" && !formData.teacher_id)}
              className="px-6 py-2 bg-[#10b981] hover:bg-[#10b981]/90 text-white text-sm font-semibold rounded-lg shadow-md shadow-[#10b981]/20 transition-all flex items-center gap-2 disabled:opacity-60 disabled:shadow-none"
            >
              {isSaving && <Loader2 size={16} className="animate-spin" />}
              {editingClass ? "Save Changes" : "Create Class"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
