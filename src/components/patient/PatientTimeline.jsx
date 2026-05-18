import { Calendar, Stethoscope, FileText, Activity } from 'lucide-react'

const ICONS = { appointment: Calendar, diagnosis: Stethoscope, prescription: FileText, default: Activity }

export default function PatientTimeline({ items = [] }) {
  if (!items.length) {
    return (
      <p className="py-8 text-center text-sm text-slate-400">No history yet</p>
    )
  }

  return (
    <div className="relative space-y-0">
      <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-200" />
      {items.map((item, i) => {
        const Icon = ICONS[item.type] || ICONS.default
        return (
          <div key={i} className="relative flex gap-4 pb-6 pl-10">
            <div className="absolute left-2.5 flex h-3 w-3 rounded-full border-2 border-primary-500 bg-white" />
            <div className="flex-1 rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-primary-600" />
                  <span className="text-sm font-medium capitalize">{item.type}</span>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(item.date).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-700">{item.summary}</p>
              {item.details && (
                <p className="mt-1 text-xs text-slate-500">{item.details}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
