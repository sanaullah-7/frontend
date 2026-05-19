import { useEffect, useState } from 'react'
import { Users, Stethoscope, Calendar, DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/common/StatCard'
import Loader from '../../components/common/Loader'
import { analyticsApi } from '../../api'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analyticsApi.admin()
      .then(({ data }) => setData(data?.data || data))
      .catch((err) => console.error('Failed to load analytics:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader fullScreen />

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Patients" value={data?.totalPatients || 0} icon={Users} color="primary" />
        <StatCard title="Total Doctors" value={data?.totalDoctors || 0} icon={Stethoscope} color="emerald" />
        <StatCard title="Monthly Appointments" value={data?.monthlyAppointments || 0} icon={Calendar} color="amber" />
        <StatCard title="Revenue (Simulated)" value={`$${data?.revenue || 0}`} icon={DollarSign} color="violet" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="mb-4 font-semibold">Monthly Appointments</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data?.appointmentTrend || []}>
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="mb-4 font-semibold">Top Diagnoses</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data?.topDiagnoses || []} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {(data?.topDiagnoses || []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  )
}
