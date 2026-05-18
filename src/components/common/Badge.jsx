export default function Badge({ status }) {
  const map = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
    admin: 'bg-violet-100 text-violet-800',
    doctor: 'bg-blue-100 text-blue-800',
    receptionist: 'bg-emerald-100 text-emerald-800',
    patient: 'bg-slate-100 text-slate-800',
    free: 'bg-slate-100 text-slate-700',
    pro: 'bg-primary-100 text-primary-800',
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${map[status] || 'bg-slate-100 text-slate-700'}`}
    >
      {status}
    </span>
  )
}
