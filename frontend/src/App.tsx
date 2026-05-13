import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import TakeAttendance from "./pages/TakeAttendance";
import AttendanceRecords from "./pages/AttendanceRecords";
import AttendanceReports from "./pages/AttendanceReports";
import StudentSummary from "./pages/StudentSummary";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherGrading from "./pages/TeacherGrading";
import StudentActivities from "./pages/StudentActivities";
import UsersManagement from "./pages/UsersManagement";
import TeacherClasses from "./pages/TeacherClasses";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        <Route element={<MainLayout />}>
          {/* Admin Routes */}
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/classes" element={<TeacherClasses />} />
          <Route path="/reports" element={<AttendanceReports />} />
          <Route path="/users" element={<UsersManagement />} />
          
          {/* Shared / Teacher Routes */}
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher-classes" element={<TeacherClasses />} />
          <Route path="/attendance" element={<TakeAttendance />} />
          <Route path="/attendance-records" element={<AttendanceRecords />} />
          <Route path="/teacher-grading" element={<TeacherGrading />} />
          
          {/* Student Routes */}
          <Route path="/students" element={<StudentSummary />} />
          <Route path="/student-activities" element={<StudentActivities />} />

          {/* Shared Routes */}
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/settings" element={<div className="p-6 bg-white rounded-xl shadow-sm border border-border">Settings Page</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
