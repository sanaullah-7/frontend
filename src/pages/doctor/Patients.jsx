import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Loader from '../../components/common/Loader'
import PatientTimeline from '../../components/patient/PatientTimeline'
import SymptomChecker from '../../components/ai/SymptomChecker'
import { Input, Textarea } from '../../components/common/Input'
import { patientApi, diagnosisApi, prescriptionApi, aiApi } from '../../api'

export default function DoctorPatients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [riskFlags, setRiskFlags] = useState([])
  const [diagModal, setDiagModal] = useState(false)
  const [rxModal, setRxModal] = useState(false)
  const [diagForm, setDiagForm] = useState({ condition: '', notes: '', symptoms: '' })
  const [rxForm, setRxForm] = useState({ medicines: [{ name: '', dosage: '', duration: '' }], notes: '' })

  useEffect(() => {
    patientApi.getAll().then(({ data }) => setPatients(data.patients)).finally(() => setLoading(false))
  }, [])

  const openPatient = async (patient) => {
    setSelected(patient)
    const [tl, risks] = await Promise.all([
      patientApi.getTimeline(patient._id),
      aiApi.riskFlags(patient._id).catch(() => ({ data: { flags: [] } })),
    ])
    setTimeline(tl.data.timeline)
    setRiskFlags(risks.data.flags)
  }

  const addDiagnosis = async (e) => {
    e.preventDefault()
    try {
      await diagnosisApi.create({ ...diagForm, patientId: selected._id })
      toast.success('Diagnosis added')
      setDiagModal(false)
      openPatient(selected)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    }
  }

  const addPrescription = async (e) => {
    e.preventDefault()
    try {
      await prescriptionApi.create({ ...rxForm, patientId: selected._id })
      toast.success('Prescription created')
      setRxModal(false)
      openPatient(selected)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    }
  }

  if (loading) return <Loader fullScreen />

  return (
    <DashboardLayout title="Patients">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          {patients.map((p) => (
            <button
              key={p._id}
              onClick={() => openPatient(p)}
              className={`w-full rounded-xl border p-4 text-left transition ${selected?._id === p._id ? 'border-primary-500 bg-primary-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
            >
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-slate-500">{p.age}y · {p.gender} · {p.phone}</p>
            </button>
          ))}
        </div>

        {selected ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-semibold">{selected.name}</h3>
              <p className="text-sm text-slate-500">Blood: {selected.bloodGroup || 'N/A'} | Allergies: {selected.allergies || 'None'}</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => setDiagModal(true)}>Add Diagnosis</Button>
                <Button size="sm" variant="secondary" onClick={() => setRxModal(true)}>Write Prescription</Button>
              </div>
            </div>

            {riskFlags.length > 0 && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-800">Risk Flags</p>
                <ul className="mt-1 list-inside list-disc text-sm text-red-700">
                  {riskFlags.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}

            <SymptomChecker
              patientId={selected._id}
              defaultAge={selected.age}
              defaultGender={selected.gender}
              defaultHistory={selected.medicalHistory}
            />

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h4 className="mb-4 font-medium">Medical History Timeline</h4>
              <PatientTimeline items={timeline} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-300 p-12 text-slate-400">
            Select a patient to view details
          </div>
        )}
      </div>

      <Modal open={diagModal} onClose={() => setDiagModal(false)} title="Add Diagnosis">
        <form onSubmit={addDiagnosis} className="space-y-3">
          <Input label="Condition" value={diagForm.condition} onChange={(e) => setDiagForm({ ...diagForm, condition: e.target.value })} required />
          <Textarea label="Symptoms" value={diagForm.symptoms} onChange={(e) => setDiagForm({ ...diagForm, symptoms: e.target.value })} />
          <Textarea label="Notes" value={diagForm.notes} onChange={(e) => setDiagForm({ ...diagForm, notes: e.target.value })} />
          <Button type="submit" className="w-full">Save Diagnosis</Button>
        </form>
      </Modal>

      <Modal open={rxModal} onClose={() => setRxModal(false)} title="Write Prescription" wide>
        <form onSubmit={addPrescription} className="space-y-3">
          {rxForm.medicines.map((med, i) => (
            <div key={i} className="grid grid-cols-3 gap-2">
              <Input placeholder="Medicine" value={med.name} onChange={(e) => {
                const meds = [...rxForm.medicines]; meds[i].name = e.target.value; setRxForm({ ...rxForm, medicines: meds })
              }} required />
              <Input placeholder="Dosage" value={med.dosage} onChange={(e) => {
                const meds = [...rxForm.medicines]; meds[i].dosage = e.target.value; setRxForm({ ...rxForm, medicines: meds })
              }} required />
              <Input placeholder="Duration" value={med.duration} onChange={(e) => {
                const meds = [...rxForm.medicines]; meds[i].duration = e.target.value; setRxForm({ ...rxForm, medicines: meds })
              }} />
            </div>
          ))}
          <Button type="button" size="sm" variant="ghost" onClick={() => setRxForm({ ...rxForm, medicines: [...rxForm.medicines, { name: '', dosage: '', duration: '' }] })}>
            + Add Medicine
          </Button>
          <Textarea label="Notes" value={rxForm.notes} onChange={(e) => setRxForm({ ...rxForm, notes: e.target.value })} />
          <Button type="submit" className="w-full">Create Prescription</Button>
        </form>
      </Modal>
    </DashboardLayout>
  )
}

export { default as DoctorAnalytics } from './Dashboard'
