import api from './axios'

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
}

export const patientApi = {
  getAll: (params) => api.get('/patients', { params }),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  getTimeline: (id) => api.get(`/patients/${id}/timeline`),
}

export const appointmentApi = {
  getAll: (params) => api.get('/appointments', { params }),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  cancel: (id) => api.patch(`/appointments/${id}/cancel`),
  getDoctorSchedule: (doctorId, date) =>
    api.get(`/appointments/doctor/${doctorId}/schedule`, { params: { date } }),
}

export const prescriptionApi = {
  getAll: (params) => api.get('/prescriptions', { params }),
  create: (data) => api.post('/prescriptions', data),
  getById: (id) => api.get(`/prescriptions/${id}`),
  downloadPdf: (id) =>
    api.get(`/prescriptions/${id}/pdf`, { responseType: 'blob' }),
}

export const diagnosisApi = {
  create: (data) => api.post('/diagnoses', data),
  getByPatient: (patientId) => api.get(`/diagnoses/patient/${patientId}`),
}

export const aiApi = {
  symptomCheck: (data) => api.post('/ai/symptom-check', data),
  explainPrescription: (data) => api.post('/ai/explain-prescription', data),
  riskFlags: (patientId) => api.get(`/ai/risk-flags/${patientId}`),
}

export const analyticsApi = {
  admin: () => api.get('/analytics/admin'),
  doctor: () => api.get('/analytics/doctor'),
  predictive: () => api.get('/analytics/predictive'),
}

export const userApi = {
  getDoctors: () => api.get('/users/doctors'),
}

export const adminApi = {
  getUsers: (role) => api.get('/admin/users', { params: { role } }),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getPlans: () => api.get('/admin/plans'),
  updatePlan: (id, data) => api.put(`/admin/plans/${id}`, data),
}
