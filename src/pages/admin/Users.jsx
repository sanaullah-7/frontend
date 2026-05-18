import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Badge from '../../components/common/Badge'
import { Input } from '../../components/common/Input'
import Loader from '../../components/common/Loader'
import { adminApi } from '../../api'

export default function ManageUsers({ role, title }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', specialization: '' })

  const fetchUsers = () => {
    adminApi.getUsers(role).then(({ data }) => setUsers(data.users)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [role])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await adminApi.createUser({ ...form, role })
      toast.success(`${title.slice(0, -1)} created`)
      setModal(false)
      setForm({ name: '', email: '', password: '', phone: '', specialization: '' })
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return
    try {
      await adminApi.deleteUser(id)
      toast.success('Deleted')
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    }
  }

  if (loading) return <Loader fullScreen />

  return (
    <DashboardLayout title={title}>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setModal(true)}>Add {title.slice(0, -1)}</Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Phone</th>
              {role === 'doctor' && <th className="px-4 py-3 text-left font-medium">Specialization</th>}
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-slate-100">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3 text-slate-500">{u.email}</td>
                <td className="px-4 py-3">{u.phone || '—'}</td>
                {role === 'doctor' && <td className="px-4 py-3">{u.specialization || '—'}</td>}
                <td className="px-4 py-3"><Badge status={u.isActive ? 'confirmed' : 'cancelled'} /></td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="danger" onClick={() => handleDelete(u._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={`Add ${title.slice(0, -1)}`}>
        <form onSubmit={handleCreate} className="space-y-3">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          {role === 'doctor' && (
            <Input label="Specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
          )}
          <Button type="submit" className="w-full">Create</Button>
        </form>
      </Modal>
    </DashboardLayout>
  )
}

export function AdminDoctors() {
  return <ManageUsers role="doctor" title="Doctors" />
}

export function AdminReceptionists() {
  return <ManageUsers role="receptionist" title="Receptionists" />
}
