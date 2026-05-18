import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Loader from '../../components/common/Loader'
import { analyticsApi } from '../../api'

export default function AdminAnalytics() {
  const [predictive, setPredictive] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analyticsApi.predictive().then(({ data }) => setPredictive(data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader fullScreen />

  return (
    <DashboardLayout title="Predictive Analytics">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Most Common Disease (This Month)</p>
          <p className="mt-2 text-2xl font-bold text-primary-600">{predictive?.topDisease || 'N/A'}</p>
          <p className="mt-1 text-sm text-slate-400">{predictive?.topDiseaseCount || 0} cases</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Forecast Next Week</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{predictive?.forecastAppointments || 0}</p>
          <p className="mt-1 text-sm text-slate-400">Expected appointments</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Top Performing Doctor</p>
          <p className="mt-2 text-2xl font-bold text-violet-600">{predictive?.topDoctor || 'N/A'}</p>
          <p className="mt-1 text-sm text-slate-400">{predictive?.topDoctorCount || 0} patients this month</p>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="mb-4 font-semibold">Patient Load Forecast</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={predictive?.forecastTrend || []}>
            <XAxis dataKey="week" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="patients" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  )
}
