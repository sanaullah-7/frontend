import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import { appointmentApi } from '../../api'

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = () => {
    appointmentApi.getAll().then(({ data }) => setAppointments(data.appointments)).finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const updateStatus = async (id, status) => {
    try {
      await appointmentApi.update(id, { status })
      toast.success('Status updated')
      fetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    }
  }

  if (loading) return <Loader fullScreen />

  return (
    <DashboardLayout title="My Appointments">
      <div className="space-y-3">
        {appointments.map((a) => (
          <div key={a._id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
            <div>
              <p className="font-medium">{a.patient?.name || a.patientName}</p>
              <p className="text-sm text-slate-500">
                {new Date(a.date).toLocaleString()} — {a.reason}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge status={a.status} />
              {a.status === 'pending' && (
                <Button size="sm" onClick={() => updateStatus(a._id, 'confirmed')}>Confirm</Button>
              )}
              {a.status === 'confirmed' && (
                <Button size="sm" onClick={() => updateStatus(a._id, 'completed')}>Complete</Button>
              )}
            </div>
          </div>
        ))}
        {!appointments.length && <p className="text-center text-slate-400 py-8">No appointments</p>}
      </div>
    </DashboardLayout>
  )
}
