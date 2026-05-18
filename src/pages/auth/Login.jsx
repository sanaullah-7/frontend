import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Stethoscope } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import api from '../../api/axios'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    api.get('/health')
      .then(({ data }) => {
        if (data.mongodb?.connected) setApiStatus('connected')
        else setApiStatus('degraded')
      })
      .catch(() => setApiStatus('offline'))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name}!`)
      navigate(`/${user.role}`)
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const demoLogin = (role) => {
    const demos = {
      admin: { email: 'admin@clinic.com', password: 'admin123' },
      doctor: { email: 'doctor@clinic.com', password: 'doctor123' },
      receptionist: { email: 'reception@clinic.com', password: 'reception123' },
      patient: { email: 'patient@clinic.com', password: 'patient123' },
    }
    setForm(demos[role])
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-primary-600 p-12 text-white lg:flex lg:flex-col lg:justify-center">
        <Stethoscope size={48} />
        <h1 className="mt-6 text-4xl font-bold">AI Clinic SaaS</h1>
        <p className="mt-4 text-primary-100">
          Smart diagnosis, digital prescriptions, and complete clinic management in one platform.
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold">Sign In</h2>
          <p className={`mt-1 text-xs font-medium ${
            apiStatus === 'connected' ? 'text-emerald-600' :
            apiStatus === 'checking' ? 'text-slate-400' : 'text-red-600'
          }`}>
            {apiStatus === 'connected' && '● Backend & MongoDB connected'}
            {apiStatus === 'checking' && '● Checking connection...'}
            {apiStatus === 'degraded' && '● MongoDB not connected — run backend'}
            {apiStatus === 'offline' && '● Backend offline — run: cd backend && npm run dev'}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            No account? <Link to="/register" className="text-primary-600 hover:underline">Register</Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Button type="submit" className="w-full" loading={loading}>Login</Button>
          </form>

          <div className="mt-6">
            <p className="mb-2 text-xs font-medium uppercase text-slate-400">Demo Accounts</p>
            <div className="grid grid-cols-2 gap-2">
              {['admin', 'doctor', 'receptionist', 'patient'].map((role) => (
                <button
                  key={role}
                  onClick={() => demoLogin(role)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs capitalize hover:bg-slate-50"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
