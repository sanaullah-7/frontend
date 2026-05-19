/**
 * AI Diagnosis Service
 * Integrates with Gemini API for smart diagnosis suggestions
 */

import api from '../api/axios'

export const aiDiagnosisService = {
  /**
   * Get AI diagnosis suggestion based on symptoms
   */
  getDiagnosis: async (symptoms, patientAge, gender) => {
    try {
      const response = await api.post('/ai/diagnose', {
        symptoms,
        patientAge,
        gender,
      })
      return response.data.data
    } catch (error) {
      console.error('AI diagnosis error:', error)
      throw error
    }
  },

  /**
   * Get prescription explanation
   */
  explainPrescription: async (medicines) => {
    try {
      const response = await api.post('/ai/explain-prescription', {
        medicines,
      })
      return response.data.data
    } catch (error) {
      console.error('Prescription explanation error:', error)
      throw error
    }
  },

  /**
   * Generate health recommendations
   */
  getRecommendations: async (diagnosis, symptoms) => {
    try {
      const response = await api.post('/ai/recommendations', {
        diagnosis,
        symptoms,
      })
      return response.data.data
    } catch (error) {
      console.error('Recommendations error:', error)
      throw error
    }
  },
}

export default aiDiagnosisService
