import { useEffect, useState } from 'react'
import { Calendar, FileText, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/common/StatCard'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import PrescriptionExplanation from '../../components/ai/PrescriptionExplanation'
import { Input, Select } from '../../components/common/Input'
import { useAuth } from '../../context/AuthContext'
import { appointmentApi, prescriptionApi, userApi } from '../../api'

export default function PatientDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ appointments: 0, prescriptions: 0 })

  useEffect(() => {
    Promise.all([appointmentApi.getAll(), prescriptionApi.getAll()])
      .then(([a, p]) =>
        setStats({
          appointments: a.data?.data?.length || 0,
          prescriptions: p.data?.data?.length || 0,
        })
      )
      .catch(() => {})
  }, [])

  return (
    <DashboardLayout title={`Welcome, ${user?.name}`}>
      <div className="animate-slide-up grid gap-4 sm:grid-cols-2">
        <StatCard title="My Appointments" value={stats.appointments} icon={Calendar} />
        <StatCard title="My Prescriptions" value={stats.prescriptions} icon={FileText} color="emerald" />
      </div>
    </DashboardLayout>
  )
}

export function PatientAppointments() {
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ doctorId: '', date: '', reason: '' })

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [a, d] = await Promise.all([appointmentApi.getAll(), userApi.getDoctors()])
      setAppointments(a.data?.data || [])
      setDoctors(d.data?.data || [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const book = async (e) => {
    e.preventDefault()
    if (!form.doctorId || !form.date || !form.reason) {
      toast.error('Please fill all fields')
      return
    }
    setSubmitting(true)
    try {
      await appointmentApi.create(form)
      toast.success('Appointment requested successfully')
      setModal(false)
      setForm({ doctorId: '', date: '', reason: '' })
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book appointment')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loader fullScreen />

  return (
    <DashboardLayout title="My Appointments">
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setModal(true)} disabled={!doctors.length}>
          <Plus size={16} /> Book Appointment
        </Button>
      </div>

      <div className="space-y-3">
        {appointments.map((a) => (
          <div key={a._id} className="card-hover flex justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div>
              <p className="font-medium">Dr. {a.doctor?.name}</p>
              <p className="text-sm text-slate-500">{new Date(a.date).toLocaleString()} — {a.reason}</p>
            </div>
            <Badge status={a.status} />
          </div>
        ))}
        {!appointments.length && (
          <EmptyState
            icon={Calendar}
            title="No appointments yet"
            description="Book with any available doctor."
            action={doctors.length ? <Button onClick={() => setModal(true)}>Book Now</Button> : null}
          />
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Book Appointment">
        <form onSubmit={book} className="space-y-3">
          <Select label="Doctor" value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })} required>
            <option value="">— Select doctor —</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                Dr. {d.name} {d.specialization ? `(${d.specialization})` : ''}
              </option>
            ))}
          </Select>
          <Input label="Date & Time" type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          <Input label="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required />
          <Button type="submit" className="w-full" loading={submitting}>Submit Request</Button>
        </form>
      </Modal>
    </DashboardLayout>
  )
}

export function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    prescriptionApi
      .getAll()
      .then(({ data }) => setPrescriptions(data?.data || []))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load prescriptions'))
      .finally(() => setLoading(false))
  }, [])

  const downloadPdf = async (id, patientName) => {
    try {
      const { data } = await prescriptionApi.downloadPdf(id)
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.download = `prescription-${patientName}.pdf`
      link.click()
      toast.success('PDF downloaded')
    } catch {
      toast.error('Download failed')
    }
  }

  if (loading) return <Loader fullScreen />

  return (
    <DashboardLayout title="My Prescriptions">
      <div className="space-y-4">
        {prescriptions.map((rx) => (
          <div key={rx._id} className="card-hover animate-fade-in rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">Dr. {rx.doctor?.name}</p>
                <p className="text-sm text-slate-500">{new Date(rx.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setExpanded(expanded === rx._id ? null : rx._id)}>
                  {expanded === rx._id ? 'Hide AI' : 'AI Explain'}
                </Button>
                <Button size="sm" onClick={() => downloadPdf(rx._id, rx.patient?.name || 'patient')}>Download PDF</Button>
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-sm">
              {rx.medicines?.map((m, i) => (
                <li key={i}>• {m.name} — {m.dosage} ({m.duration})</li>
              ))}
            </ul>
            {rx.notes && <p className="mt-2 text-sm text-slate-500">{rx.notes}</p>}
            {expanded === rx._id && (
              <div className="mt-4"><PrescriptionExplanation prescriptionId={rx._id} /></div>
            )}
          </div>
        ))}
        {!prescriptions.length && (
          <EmptyState icon={FileText} title="No prescriptions yet" description="Your doctor will add prescriptions after visits." />
        )}
      </div>
    </DashboardLayout>
  )
}

export function PatientProfile() {
  const { user } = useAuth()
  return (
    <DashboardLayout title="My Profile">
      <div className="card-hover max-w-lg animate-fade-in rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div><p className="text-sm text-slate-500">Name</p><p className="font-medium">{user?.name}</p></div>
        <div><p className="text-sm text-slate-500">Email</p><p className="font-medium">{user?.email}</p></div>
        <div><p className="text-sm text-slate-500">Phone</p><p className="font-medium">{user?.phone || '—'}</p></div>
        <div><p className="text-sm text-slate-500">Plan</p><Badge status={user?.plan || 'free'} /></div>
      </div>
    </DashboardLayout>
  )
}
