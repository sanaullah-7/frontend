import { AlertCircle } from 'lucide-react'
import Button from './Button'

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', isDangerous = false }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        <div className="flex items-start gap-3 border-b border-slate-200 p-4">
          <AlertCircle className={`h-5 w-5 flex-shrink-0 ${isDangerous ? 'text-red-600' : 'text-amber-600'}`} />
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        </div>

        <p className="p-4 text-slate-600">{message}</p>

        <div className="flex gap-3 border-t border-slate-200 bg-slate-50 p-4">
          <Button
            onClick={onCancel}
            className="flex-1 bg-slate-200 text-slate-900 hover:bg-slate-300"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={`flex-1 ${
              isDangerous
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
