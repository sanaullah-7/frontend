import { useEffect, useState } from 'react'
import { Calendar, FileText, Users } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/common/StatCard'
import Loader from '../../components/common/Loader'
import { analyticsApi } from '../../api'

export default function DoctorDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analyticsApi.doctor().then(({ data }) => setData(data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader fullScreen />

  return (
    <DashboardLayout title="Doctor Dashboard">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Today's Appointments" value={data?.todayAppointments || 0} icon={Calendar} />
        <StatCard title="Monthly Patients" value={data?.monthlyPatients || 0} icon={Users} color="emerald" />
        <StatCard title="Prescriptions Written" value={data?.prescriptionCount || 0} icon={FileText} color="amber" />
      </div>
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="mb-4 font-semibold">Monthly Stats</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data?.monthlyStats || []}>
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Bar dataKey="appointments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  )
}
