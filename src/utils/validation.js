/**
 * Form Validation Utilities
 * Client-side validation before API submission
 */

export const validators = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value) return 'Email is required'
    if (!emailRegex.test(value)) return 'Please enter a valid email'
    return null
  },

  password: (value, minLength = 6) => {
    if (!value) return 'Password is required'
    if (value.length < minLength) return `Password must be at least ${minLength} characters`
    return null
  },

  passwordStrength: (value) => {
    if (!value) return 'Password is required'
    const hasUpperCase = /[A-Z]/.test(value)
    const hasLowerCase = /[a-z]/.test(value)
    const hasNumbers = /\d/.test(value)
    const isLongEnough = value.length >= 8

    if (!isLongEnough) return 'Password must be at least 8 characters'
    if (!hasUpperCase) return 'Password must contain an uppercase letter'
    if (!hasLowerCase) return 'Password must contain a lowercase letter'
    if (!hasNumbers) return 'Password must contain a number'
    return null
  },

  name: (value) => {
    if (!value) return 'Name is required'
    if (value.trim().length < 2) return 'Name must be at least 2 characters'
    if (value.length > 100) return 'Name must be less than 100 characters'
    return null
  },

  phone: (value) => {
    if (!value) return 'Phone number is required'
    const phoneRegex = /^[0-9\-\+\(\)\s]{7,}$/
    if (!phoneRegex.test(value)) return 'Please enter a valid phone number'
    return null
  },

  age: (value) => {
    if (!value) return null // Age is optional
    const age = parseInt(value)
    if (isNaN(age)) return 'Age must be a number'
    if (age < 0 || age > 150) return 'Age must be between 0 and 150'
    return null
  },

  confirmPassword: (password, confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password'
    if (password !== confirmPassword) return 'Passwords do not match'
    return null
  },

  url: (value) => {
    if (!value) return null
    try {
      new URL(value)
      return null
    } catch {
      return 'Please enter a valid URL'
    }
  },

  required: (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`
    }
    return null
  },
}

/**
 * Validate multiple fields at once
 */
export const validateForm = (data, rules) => {
  const errors = {}

  Object.entries(rules).forEach(([field, rule]) => {
    if (typeof rule === 'function') {
      const error = rule(data[field])
      if (error) errors[field] = error
    }
  })

  return errors
}

/**
 * Check if form has any errors
 */
export const hasErrors = (errors) => {
  return Object.values(errors).some((error) => error !== null && error !== undefined && error !== '')
}

/**
 * Generic validation for common patterns
 */
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[0-9\-\+\(\)\s]{7,}$/,
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  alphanumeric: /^[a-zA-Z0-9 ]*$/,
  noSpecialChars: /^[a-zA-Z0-9\s\.\,\-\_]*$/,
}
