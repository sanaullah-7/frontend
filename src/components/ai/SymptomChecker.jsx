import { useState } from 'react'
import { Sparkles, AlertTriangle, Zap, Activity } from 'lucide-react'
import toast from 'react-hot-toast'
import { aiApi } from '../../api'
import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'
import { Input, Select, Textarea } from '../common/Input'

const QUICK_SYMPTOMS = ['Fever & cough', 'Headache', 'Chest pain', 'Skin rash', 'Stomach pain']

export default function SymptomChecker({ patientId, defaultAge, defaultGender, defaultHistory }) {
  const { hasAI } = useAuth()
  const [form, setForm] = useState({
    symptoms: '',
    age: defaultAge || '',
    gender: defaultGender || 'male',
    history: defaultHistory || '',
    patientId: patientId || '',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const applyQuick = (text) => setForm((f) => ({ ...f, symptoms: text }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!hasAI) {
      toast.error('Upgrade to Pro plan for AI features')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const { data } = await aiApi.symptomCheck(form)
      setResult(data)
      toast.success(data.fallback ? 'Offline analysis ready' : 'AI analysis complete', { duration: 2000 })
    } catch (err) {
      toast.error(err.message || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const riskColor = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-200',
    low: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  }

  return (
    <div className="card-hover rounded-xl border border-slate-200 bg-gradient-to-br from-white to-primary-50/30 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Smart Symptom Checker</h3>
            <p className="text-xs text-slate-500">AI-assisted differential diagnosis</p>
          </div>
        </div>
        {!hasAI && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Pro only</span>
        )}
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {QUICK_SYMPTOMS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => applyQuick(s)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
          >
            {s}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          label="Symptoms"
          value={form.symptoms}
          onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
          placeholder="e.g. fever, cough, headache for 3 days"
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required />
          <Select label="Gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
        </div>
        <Textarea label="Medical History" value={form.history} onChange={(e) => setForm({ ...form, history: e.target.value })} placeholder="Past conditions, allergies..." />
        <Button type="submit" loading={loading} disabled={!hasAI} className="w-full">
          <Zap size={16} /> {loading ? 'Analyzing...' : 'Analyze Symptoms'}
        </Button>
      </form>

      {loading && (
        <div className="mt-4 space-y-2 rounded-lg p-4 ai-shimmer">
          <div className="flex items-center gap-2 text-sm text-primary-700">
            <Activity size={16} className="animate-pulse-soft" />
            AI is analyzing symptoms...
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="animate-fade-in mt-4 space-y-3">
          {result.fallback && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
              <AlertTriangle size={16} />
              <span className="text-xs">AI offline — rule-based analysis shown</span>
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs font-medium uppercase text-slate-500">Conditions</p>
              <ul className="mt-1 space-y-1 text-sm">
                {result.conditions?.map((c, i) => (
                  <li key={i} className="flex items-center gap-1">
                    <span className="h-1 w-1 rounded-full bg-primary-500" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`rounded-lg border p-3 ${riskColor[result.riskLevel] || riskColor.low}`}>
              <p className="text-xs font-medium uppercase opacity-80">Risk Level</p>
              <p className="mt-1 text-lg font-bold capitalize">{result.riskLevel}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs font-medium uppercase text-slate-500">Suggested Tests</p>
              <p className="mt-1 text-sm">{result.suggestedTests?.join(', ')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
