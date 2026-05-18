import { Link } from 'react-router-dom'

export default function Footer({ className = '' }) {
  const year = new Date().getFullYear()

  return (
    <footer className={`animate-fade-in border-t border-slate-200 bg-white ${className}`}>
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="font-semibold text-slate-800">Made by SanaUllah</p>
            <p className="mt-1 text-sm text-slate-500">AI Clinic Management SaaS</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
            <Link to="/login" className="transition hover:text-primary-600">Login</Link>
            <Link to="/register" className="transition hover:text-primary-600">Register</Link>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              className="transition hover:text-primary-600"
              onClick={() =>
                window.alert(
                  'Privacy Policy: Patient data is stored securely and used only for clinic care. We do not sell personal health information.'
                )
              }
            >
              Privacy Policy
            </button>
            <button
              type="button"
              className="transition hover:text-primary-600"
              onClick={() =>
                window.alert(
                  'Terms of Use: AI suggestions are informational only. Always follow your licensed physician advice.'
                )
              }
            >
              Terms of Use
            </button>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">
          © {year} SanaUllah. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
