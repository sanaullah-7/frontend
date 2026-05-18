import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Stethoscope,
  BarChart3,
  CreditCard,
  LogOut,
  Activity,
  UserCircle,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV = {
  admin: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
    { to: '/admin/receptionists', label: 'Receptionists', icon: Users },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/plans', label: 'Plans', icon: CreditCard },
  ],
  doctor: [
    { to: '/doctor', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/doctor/appointments', label: 'Appointments', icon: Calendar },
    { to: '/doctor/patients', label: 'Patients', icon: Users },
    { to: '/doctor/analytics', label: 'Analytics', icon: BarChart3 },
  ],
  receptionist: [
    { to: '/receptionist', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/receptionist/patients', label: 'Patients', icon: Users },
    { to: '/receptionist/appointments', label: 'Appointments', icon: Calendar },
    { to: '/receptionist/schedule', label: 'Schedule', icon: Activity },
  ],
  patient: [
    { to: '/patient', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/patient/appointments', label: 'Appointments', icon: Calendar },
    { to: '/patient/prescriptions', label: 'Prescriptions', icon: FileText },
    { to: '/patient/profile', label: 'Profile', icon: UserCircle },
  ],
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const links = NAV[user?.role] || []

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Stethoscope size={18} />
          </div>
          <div>
            <p className="font-bold text-slate-900">AI Clinic</p>
            <p className="text-xs capitalize text-slate-500">{user?.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to.split('/').length === 2}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="mb-3 rounded-lg bg-slate-50 px-3 py-2">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="truncate text-xs text-slate-500">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  )
}
