export default function Loader({ fullScreen = false }) {
  const cls = fullScreen
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center py-12'

  return (
    <div className={cls}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
    </div>
  )
}
