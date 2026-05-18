import { PLANS } from '../../utils/constants'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge from '../../components/common/Badge'

export default function AdminPlans() {
  return (
    <DashboardLayout title="Subscription Plans">
      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(PLANS).map(([key, plan]) => (
          <div key={key} className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">{plan.name} Plan</h3>
              <Badge status={key} />
            </div>
            <p className="mt-2 text-3xl font-bold text-primary-600">${plan.price}<span className="text-sm font-normal text-slate-400">/mo</span></p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>• Max patients: {plan.patients === Infinity ? 'Unlimited' : plan.patients}</li>
              <li>• AI features: {plan.ai ? 'Enabled' : 'Disabled'}</li>
              <li>• Digital prescriptions & PDF</li>
              <li>• Analytics dashboard</li>
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-slate-400">
        Plans are simulated for hackathon demo. Admin can assign plan via user management.
      </p>
    </DashboardLayout>
  )
}
