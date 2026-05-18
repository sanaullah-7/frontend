import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Users, Calendar, UserPlus, Stethoscope } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/common/StatCard'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Badge from '../../components/common/Badge'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { Input, Select, Textarea } from '../../components/common/Input'
import { patientApi, appointmentApi, userApi } from '../../api'

export default function ReceptionistDashboard() {
  const [stats, setStats] = useState({ patients: 0, todayAppts: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      patientApi.getAll(),
      appointmentApi.getAll({ date: new Date().toISOString().split('T')[0] }),
    ])
      .then(([p, a]) => {
        setStats({
          patients: p.data.patients?.length || 0,
          todayAppts: a.data.appointments?.length || 0,
        })
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader fullScreen />

  return (
    <DashboardLayout title="Receptionist Dashboard">
      <div className="animate-slide-up grid gap-4 sm:grid-cols-2">
        <StatCard title="Total Patients" value={stats.patients} icon={Users} />
        <StatCard title="Today's Appointments" value={stats.todayAppts} icon={Calendar} color="emerald" />
      </div>
    </DashboardLayout>
  )
}

export function ReceptionistPatients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', age: '', gender: 'male',
    bloodGroup: '', allergies: '', medicalHistory: '',
  })

  const fetch = useCallback(() => {
    setLoading(true)
    patientApi
      .getAll()
      .then(({ data }) => setPatients(data.patients || []))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const openCreate = () => {
    setEditId(null)
    setForm({ name: '', email: '', phone: '', age: '', gender: 'male', bloodGroup: '', allergies: '', medicalHistory: '' })
    setModal(true)
  }

  const openEdit = (p) => {
    setEditId(p._id)
    setForm({
      name: p.name, email: p.email || '', phone: p.phone || '', age: p.age || '',
      gender: p.gender || 'male', bloodGroup: p.bloodGroup || '',
      allergies: p.allergies || '', medicalHistory: p.medicalHistory || '',
    })
    setModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editId) {
        await patientApi.update(editId, form)
        toast.success('Patient updated')
      } else {
        await patientApi.create(form)
        toast.success('Patient registered')
      }
      setModal(false)
      fetch()
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (loading) return <Loader fullScreen />

  return (
    <DashboardLayout title="Patient Management">
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate}><UserPlus size={16} /> Register Patient</Button>
      </div>
      {patients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No patients registered"
          description="Register your first patient to book appointments."
          action={<Button onClick={openCreate}>Register Patient</Button>}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Phone</th>
                <th className="px-4 py-3 text-left font-medium">Age</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p._id} className="border-b border-slate-100 transition hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-slate-600">{p.phone}</td>
                  <td className="px-4 py-3">{p.age || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="secondary" onClick={() => openEdit(p)}>Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Edit Patient' : 'Register Patient'} wide>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
          <Select label="Gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
          <Input label="Blood Group" value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} />
          <Textarea label="Allergies" className="col-span-2" value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} />
          <Textarea label="Medical History" className="col-span-2" value={form.medicalHistory} onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })} />
          <Button type="submit" className="col-span-2">{editId ? 'Update' : 'Register'}</Button>
        </form>
      </Modal>
    </DashboardLayout>
  )
}

export function ReceptionistAppointments() {
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ patientId: '', doctorId: '', date: '', reason: '' })

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [apptRes, docRes, patRes] = await Promise.all([
        appointmentApi.getAll(),
        userApi.getDoctors(),
        patientApi.getAll(),
      ])
      setAppointments(apptRes.data.appointments || [])
      setDoctors(docRes.data.doctors || [])
      setPatients(patRes.data.patients || [])
    } catch (err) {
      toast.error(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const openBookModal = () => {
    setForm({ patientId: '', doctorId: '', date: '', reason: '' })
    setModal(true)
  }

  const book = async (e) => {
    e.preventDefault()
    if (!form.patientId || !form.doctorId) {
      toast.error('Please select both patient and doctor')
      return
    }
    setSubmitting(true)
    try {
      await appointmentApi.create(form)
      toast.success('Appointment booked successfully')
      setModal(false)
      fetchAll()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const cancel = async (id) => {
    try {
      await appointmentApi.cancel(id)
      toast.success('Appointment cancelled')
      fetchAll()
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (loading) return <Loader fullScreen />

  return (
    <DashboardLayout title="Appointments">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-4 text-sm text-slate-600">
          <span className="flex items-center gap-1"><Users size={16} /> {patients.length} patients</span>
          <span className="flex items-center gap-1"><Stethoscope size={16} /> {doctors.length} doctors</span>
        </div>
        <Button onClick={openBookModal}><Calendar size={16} /> Book Appointment</Button>
      </div>

      {patients.length === 0 && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          No patients yet. <Link to="/receptionist/patients" className="font-medium underline">Register a patient</Link> first.
        </div>
      )}

      {doctors.length === 0 && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          No doctors found. Ask admin to add doctors from the Admin panel.
        </div>
      )}

      <div className="space-y-3">
        {appointments.map((a) => (
          <div
            key={a._id}
            className="card-hover flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div>
              <p className="font-medium text-slate-900">{a.patient?.name || 'Unknown patient'}</p>
              <p className="text-sm text-slate-500">
                Dr. {a.doctor?.name || 'Unknown'} {a.doctor?.specialization ? `(${a.doctor.specialization})` : ''}
              </p>
              <p className="text-sm text-slate-500">
                {new Date(a.date).toLocaleString()} — {a.reason}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge status={a.status} />
              {a.status !== 'cancelled' && a.status !== 'completed' && (
                <Button size="sm" variant="danger" onClick={() => cancel(a._id)}>Cancel</Button>
              )}
            </div>
          </div>
        ))}
        {appointments.length === 0 && (
          <EmptyState
            icon={Calendar}
            title="No appointments yet"
            description="Book an appointment by selecting a registered patient and doctor."
            action={
              patients.length > 0 && doctors.length > 0 ? (
                <Button onClick={openBookModal}>Book Appointment</Button>
              ) : null
            }
          />
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Book Appointment" wide>
        <form onSubmit={book} className="space-y-4">
          <Select
            label={`Patient (${patients.length} registered)`}
            value={form.patientId}
            onChange={(e) => setForm({ ...form, patientId: e.target.value })}
            required
          >
            <option value="">— Select patient —</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} {p.phone ? `• ${p.phone}` : ''} {p.age ? `• ${p.age}y` : ''}
              </option>
            ))}
          </Select>

          <Select
            label={`Doctor (${doctors.length} available)`}
            value={form.doctorId}
            onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
            required
          >
            <option value="">— Select doctor —</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                Dr. {d.name} {d.specialization ? `— ${d.specialization}` : ''}
              </option>
            ))}
          </Select>

          <Input
            label="Date & Time"
            type="datetime-local"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <Input
            label="Reason for visit"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            placeholder="e.g. fever, follow-up, routine checkup"
            required
          />

          {patients.length === 0 && (
            <p className="text-sm text-amber-600">
              <Link to="/receptionist/patients" className="underline">Register a patient</Link> before booking.
            </p>
          )}

          <Button type="submit" className="w-full" loading={submitting} disabled={!patients.length || !doctors.length}>
            Confirm Booking
          </Button>
        </form>
      </Modal>
    </DashboardLayout>
  )
}

export function ReceptionistSchedule() {
  const [schedule, setSchedule] = useState([])
  const [doctors, setDoctors] = useState([])
  const [doctorId, setDoctorId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    userApi
      .getDoctors()
      .then(({ data }) => {
        const list = data.doctors || []
        setDoctors(list)
        if (list.length) setDoctorId(list[0]._id)
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!doctorId) return
    appointmentApi
      .getDoctorSchedule(doctorId, date)
      .then(({ data }) => setSchedule(data.schedule || []))
      .catch((err) => toast.error(err.message))
  }, [doctorId, date])

  if (loading) return <Loader fullScreen />

  return (
    <DashboardLayout title="Doctor Schedule">
      <div className="mb-4 flex flex-wrap gap-3">
        <Select label="Doctor" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className="min-w-[200px]">
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>Dr. {d.name}</option>
          ))}
        </Select>
        <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="space-y-2">
        {schedule.map((s) => (
          <div key={s._id} className="card-hover flex justify-between rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <span className="text-sm">
              {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {' — '}
              <strong>{s.patient?.name}</strong>
            </span>
            <Badge status={s.status} />
          </div>
        ))}
        {!schedule.length && (
          <EmptyState icon={Calendar} title="No appointments this day" description="Try another date or doctor." />
        )}
      </div>
    </DashboardLayout>
  )
}
