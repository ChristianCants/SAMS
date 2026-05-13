import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Shield, Key, Camera } from "lucide-react";
import PageTransition from "../components/layout/PageTransition";
import { Card, CardContent } from "../components/ui/Card";
import { supabase } from "../lib/supabase";

export default function UserProfile() {
  const role = localStorage.getItem("sams_role") || "Teacher";
  
  const [profileData, setProfileData] = useState({
    firstName: "Loading...",
    lastName: "",
    email: "loading@sams.edu",
    phone: "+1 (555) 123-4567",
    address: "123 Education Blvd, Learning City",
    department: role === "Teacher" ? "Science Department" : "Grade 10 - Section A",
    idNumber: role === "Teacher" ? "TCH-2024-001" : "STU-2026-042"
  });

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          const names = profile.full_name ? profile.full_name.split(' ') : ["User", ""];
          setProfileData(prev => ({
            ...prev,
            firstName: names[0] || "User",
            lastName: names.slice(1).join(' ') || "",
            email: profile.email || user.email || ""
          }));
        }
      }
    }
    fetchUser();
  }, []);

  return (
    <PageTransition className="max-w-[1600px] mx-auto space-y-6 font-sans w-full">
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your personal information and security settings.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left Col: Profile Card */}
        <div className="xl:col-span-1 space-y-6">
          <Card className="overflow-hidden border border-white/40 shadow-lg shadow-gray-200/40">
            <div className="h-24 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] opacity-90"></div>
            <CardContent className="pt-0 relative px-6 pb-8 text-center flex flex-col items-center">
              <div className="relative -mt-12 mb-4 group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-3xl font-bold text-gray-400 overflow-hidden relative">
                    {profileData.firstName.charAt(0)}{profileData.lastName ? profileData.lastName.charAt(0) : ''}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={20} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800">{profileData.firstName} {profileData.lastName}</h3>
              <p className="text-sm font-medium text-[#3b82f6] mt-1">{role}</p>
              
              <div className="mt-4 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 w-full flex justify-between items-center text-sm">
                <span className="text-gray-500">ID Number:</span>
                <span className="font-semibold text-gray-700">{profileData.idNumber}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/40 shadow-sm">
            <CardContent className="p-4 space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#10b981]/10 text-[#10b981] transition-colors">
                <User size={18} />
                Personal Information
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <Shield size={18} />
                Security & Privacy
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Details Form */}
        <div className="xl:col-span-3 space-y-6">
          <Card className="border border-white/40 shadow-lg shadow-gray-200/40">
            <CardContent className="p-8">
              <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Personal Details</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">First Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/40 focus:border-[#3b82f6] outline-none transition-all" value={profileData.firstName} onChange={(e) => setProfileData({...profileData, firstName: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/40 focus:border-[#3b82f6] outline-none transition-all" value={profileData.lastName} onChange={(e) => setProfileData({...profileData, lastName: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" disabled className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed outline-none" value={profileData.email} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/40 focus:border-[#3b82f6] outline-none transition-all" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/40 focus:border-[#3b82f6] outline-none transition-all" value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                  <button type="button" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button type="button" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#3b82f6] hover:bg-[#3b82f6]/90 transition-all shadow-md shadow-[#3b82f6]/20">
                    Save Changes
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border border-white/40 shadow-lg shadow-gray-200/40">
            <CardContent className="p-8">
              <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Change Password</h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5 max-w-md">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Password</label>
                  <div className="relative">
                    <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/40 focus:border-[#3b82f6] outline-none transition-all" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">New Password</label>
                    <div className="relative">
                      <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/40 focus:border-[#3b82f6] outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Confirm Password</label>
                    <div className="relative">
                      <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/40 focus:border-[#3b82f6] outline-none transition-all" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="button" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-800 hover:bg-gray-900 transition-all shadow-md shadow-gray-800/20">
                    Update Password
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </PageTransition>
  );
}
