import React from 'react'
import toast from 'react-hot-toast'
import Button from './Button'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo)
    toast.error('Something went wrong. Please refresh the page.')
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-red-50 p-4">
          <div className="w-full max-w-md rounded-lg border border-red-200 bg-white p-8 shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Oops! Something went wrong</h1>
            <p className="mb-6 text-gray-600">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details className="mb-6 rounded bg-gray-100 p-4">
                <summary className="cursor-pointer font-mono text-sm font-semibold text-gray-700">
                  Error Details
                </summary>
                <p className="mt-2 font-mono text-xs text-gray-600">
                  {this.state.error?.toString()}
                </p>
              </details>
            )}
            <div className="flex gap-3">
              <Button
                onClick={this.resetError}
                className="flex-1 bg-primary-600 text-white hover:bg-primary-700"
              >
                Try Again
              </Button>
              <Button
                onClick={() => (window.location.href = '/')}
                className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
