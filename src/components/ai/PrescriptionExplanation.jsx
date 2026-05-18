import { useState } from 'react'
import { Sparkles, Zap, Heart, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { aiApi } from '../../api'
import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'

export default function PrescriptionExplanation({ prescriptionId }) {
  const { hasAI } = useAuth()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState('en')

  const generate = async (useUrdu = false) => {
    if (!hasAI) {
      toast.error('Upgrade to Pro plan for AI features')
      return
    }
    setLang(useUrdu ? 'ur' : 'en')
    setLoading(true)
    setResult(null)
    try {
      const { data } = await aiApi.explainPrescription({ prescriptionId, urdu: useUrdu })
      setResult(data)
      toast.success('Explanation ready', { duration: 1500 })
    } catch (err) {
      toast.error(err.message || 'Failed to generate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-primary-100 bg-gradient-to-br from-primary-50/50 to-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary-600" size={20} />
          <div>
            <h4 className="font-semibold text-slate-900">AI Prescription Guide</h4>
            <p className="text-xs text-slate-500">Patient-friendly explanation</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant={lang === 'en' && result ? 'primary' : 'secondary'} onClick={() => generate(false)} loading={loading && lang === 'en'} disabled={!hasAI}>
            English
          </Button>
          <Button size="sm" variant={lang === 'ur' && result ? 'primary' : 'ghost'} onClick={() => generate(true)} loading={loading && lang === 'ur'} disabled={!hasAI}>
            Urdu
          </Button>
        </div>
      </div>

      {loading && (
        <div className="ai-shimmer flex items-center gap-2 rounded-lg p-4 text-sm text-primary-700">
          <Zap size={16} className="animate-pulse-soft" />
          Generating {lang === 'ur' ? 'Urdu' : 'English'} explanation...
        </div>
      )}

      {result && !loading && (
        <div className="animate-fade-in space-y-4 text-sm text-slate-700">
          <p className="rounded-lg bg-white p-3 leading-relaxed shadow-sm">{result.explanation}</p>
          {result.lifestyle?.length > 0 && (
            <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
              <p className="flex items-center gap-1 font-medium text-emerald-800"><Heart size={14} /> Lifestyle</p>
              <ul className="mt-2 space-y-1">
                {result.lifestyle.map((tip, i) => (
                  <li key={i} className="flex gap-2"><span>•</span>{tip}</li>
                ))}
              </ul>
            </div>
          )}
          {result.preventive?.length > 0 && (
            <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3">
              <p className="flex items-center gap-1 font-medium text-blue-800"><Shield size={14} /> Preventive</p>
              <ul className="mt-2 space-y-1">
                {result.preventive.map((tip, i) => (
                  <li key={i} className="flex gap-2"><span>•</span>{tip}</li>
                ))}
              </ul>
            </div>
          )}
          {result.fallback && (
            <p className="text-xs text-amber-600">Offline template used (add GEMINI_API_KEY for live AI)</p>
          )}
        </div>
      )}

      {!result && !loading && (
        <p className="text-center text-sm text-slate-400 py-4">Tap English or Urdu to generate a simple explanation</p>
      )}
    </div>
  )
}
