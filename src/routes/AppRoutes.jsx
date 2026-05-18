import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

import Landing from '../pages/Landing'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

import AdminDashboard from '../pages/admin/Dashboard'
import { AdminDoctors, AdminReceptionists } from '../pages/admin/Users'
import AdminAnalytics from '../pages/admin/Analytics'
import AdminPlans from '../pages/admin/Plans'

import DoctorDashboard from '../pages/doctor/Dashboard'
import DoctorAppointments from '../pages/doctor/Appointments'
import DoctorPatients, { DoctorAnalytics } from '../pages/doctor/Patients'

import ReceptionistDashboard, {
  ReceptionistPatients,
  ReceptionistAppointments,
  ReceptionistSchedule,
} from '../pages/receptionist/Pages'

import PatientDashboard, {
  PatientAppointments,
  PatientPrescriptions,
  PatientProfile,
} from '../pages/patient/Pages'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/doctors" element={<ProtectedRoute roles={['admin']}><AdminDoctors /></ProtectedRoute>} />
      <Route path="/admin/receptionists" element={<ProtectedRoute roles={['admin']}><AdminReceptionists /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}><AdminAnalytics /></ProtectedRoute>} />
      <Route path="/admin/plans" element={<ProtectedRoute roles={['admin']}><AdminPlans /></ProtectedRoute>} />

      <Route path="/doctor" element={<ProtectedRoute roles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/doctor/appointments" element={<ProtectedRoute roles={['doctor']}><DoctorAppointments /></ProtectedRoute>} />
      <Route path="/doctor/patients" element={<ProtectedRoute roles={['doctor']}><DoctorPatients /></ProtectedRoute>} />
      <Route path="/doctor/analytics" element={<ProtectedRoute roles={['doctor']}><DoctorAnalytics /></ProtectedRoute>} />

      <Route path="/receptionist" element={<ProtectedRoute roles={['receptionist']}><ReceptionistDashboard /></ProtectedRoute>} />
      <Route path="/receptionist/patients" element={<ProtectedRoute roles={['receptionist']}><ReceptionistPatients /></ProtectedRoute>} />
      <Route path="/receptionist/appointments" element={<ProtectedRoute roles={['receptionist']}><ReceptionistAppointments /></ProtectedRoute>} />
      <Route path="/receptionist/schedule" element={<ProtectedRoute roles={['receptionist']}><ReceptionistSchedule /></ProtectedRoute>} />

      <Route path="/patient" element={<ProtectedRoute roles={['patient']}><PatientDashboard /></ProtectedRoute>} />
      <Route path="/patient/appointments" element={<ProtectedRoute roles={['patient']}><PatientAppointments /></ProtectedRoute>} />
      <Route path="/patient/prescriptions" element={<ProtectedRoute roles={['patient']}><PatientPrescriptions /></ProtectedRoute>} />
      <Route path="/patient/profile" element={<ProtectedRoute roles={['patient']}><PatientProfile /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
