import Sidebar from './Sidebar'

export default function DashboardLayout({ children, title }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {title && (
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-8 py-4 backdrop-blur">
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          </header>
        )}
        <div className="animate-fade-in p-8">{children}</div>
      </main>
    </div>
  )
}
