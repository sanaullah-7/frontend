import { Link } from 'react-router-dom'
import { Stethoscope, Shield, Brain, BarChart3, ArrowRight } from 'lucide-react'
import Button from '../components/common/Button'
import Footer from '../components/common/Footer'

const features = [
  { icon: Stethoscope, title: 'Digital Prescriptions', desc: 'Paperless Rx with instant PDF download' },
  { icon: Brain, title: 'AI Smart Diagnosis', desc: 'Symptom checker & prescription explanations' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Real-time clinic performance insights' },
  { icon: Shield, title: 'Role-Based Security', desc: 'Admin, Doctor, Receptionist & Patient portals' },
]

const plans = [
  { name: 'Free', price: '$0', features: ['50 patients', 'Appointments', 'Prescriptions', 'Basic analytics'] },
  { name: 'Pro', price: '$49/mo', features: ['Unlimited patients', 'AI diagnosis', 'Risk flagging', 'Predictive analytics'], highlight: true },
]

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <nav className="animate-fade-in mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white shadow-md">
            <Stethoscope size={18} />
          </div>
          <span className="text-xl font-bold text-slate-900">AI Clinic SaaS</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login"><Button variant="ghost">Login</Button></Link>
          <Link to="/register"><Button>Get Started</Button></Link>
        </div>
      </nav>

      <section className="animate-slide-up mx-auto max-w-6xl px-6 py-20 text-center">
        <span className="rounded-full bg-primary-50 px-4 py-1 text-sm font-medium text-primary-700">
          Smart Clinic Management System
        </span>
        <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
          AI-Powered Clinic Management
          <br />
          <span className="text-primary-600">Built for Real Clinics</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          Digitize prescriptions, appointments, patient records, and get intelligent AI assistance — all in one scalable SaaS platform.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/register"><Button size="lg">Start Free Trial <ArrowRight size={18} /></Button></Link>
          <Link to="/login"><Button size="lg" variant="secondary">Demo Login</Button></Link>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="card-hover animate-fade-in rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <Icon size={20} />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold">Subscription Plans</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card-hover animate-fade-in rounded-xl border p-8 transition ${
                plan.highlight ? 'border-primary-500 shadow-lg ring-2 ring-primary-100' : 'border-slate-200'
              }`}
            >
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="mt-2 text-3xl font-bold text-primary-600">{plan.price}</p>
              <ul className="mt-6 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Footer className="mt-auto" />
    </div>
  )
}
