import { useState, useEffect } from "react";
import { Search, Filter, Plus, Edit2, Trash2, Mail, BookOpen, Upload, Download } from "lucide-react";
import PageTransition from "../components/layout/PageTransition";
import { Card, CardContent } from "../components/ui/Card";
import DataImporter from "../components/ui/DataImporter";
import AddUserModal from "../components/ui/AddUserModal";
import { supabase } from "../lib/supabase";

export default function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [showImporter, setShowImporter] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (!error && data) {
      setUsers(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <PageTransition className="space-y-6 w-full max-w-full">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Users Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage teacher and student profiles.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowImporter(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Upload size={16} />
            Import CSV/Excel
          </button>
          <button 
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#10b981] hover:bg-[#10b981]/90 text-white text-sm font-medium rounded-lg transition-all shadow-md shadow-[#10b981]/20"
          >
            <Plus size={16} />
            Add User
          </button>
        </div>
      </div>

      {showImporter && (
        <DataImporter 
          tableName="profiles"
          title="Import Users"
          description="Upload an Excel or CSV file. Fields like Name and Role will be mapped, and new custom fields will go into metadata."
          fieldMapping={{
            "Name": "full_name",
            "Full Name": "full_name",
            "Email": "email",
            "Role": "role"
          }}
          onClose={() => setShowImporter(false)}
          onSuccess={() => {
            setShowImporter(false);
            fetchUsers();
          }}
        />
      )}

      {showAddUserModal && (
        <AddUserModal 
          onClose={() => setShowAddUserModal(false)}
          onSuccess={() => {
            setShowAddUserModal(false);
            fetchUsers();
          }}
        />
      )}

      <Card>
        <CardContent className="pt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center w-full sm:w-auto">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="pl-9 pr-4 py-2 bg-white/40 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#10b981]/40 outline-none w-full sm:w-64 backdrop-blur-sm"
              />
            </div>
            
            <select className="px-3 py-2 bg-white/40 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#10b981]/40 backdrop-blur-sm">
              <option value="">All Roles</option>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-white/40 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto justify-center backdrop-blur-sm">
            <Filter size={16} />
            Filters
          </button>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium">User Profile</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-500">Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-500">No users found. Try importing some!</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'Teacher' ? 'bg-blue-100 text-blue-700' : 
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {user.full_name ? user.full_name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.full_name || "Unnamed User"}</p>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">{user.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        {user.email || "No email"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                        user.role === 'Admin' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                        user.role === 'Teacher' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                        'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}>
                        {user.role || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit User">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Remove User">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500 bg-gray-50">
          <span>Showing 1 to {users.length} entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-white disabled:opacity-50 text-gray-600" disabled>Prev</button>
            <button className="px-3 py-1 border border-[#10b981] rounded bg-[#10b981] text-white">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-white disabled:opacity-50 text-gray-600" disabled>Next</button>
          </div>
        </div>
      </Card>
    </PageTransition>
  );
}
