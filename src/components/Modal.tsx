import { type ReactNode, useEffect, useCallback } from 'react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

/**
 * Modal dialog component
 */
export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative z-10 w-full max-w-md bg-surface-elevated rounded-2xl shadow-lg overflow-hidden">
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-text-secondary/10">
            <h2 className="font-body font-bold text-xl text-text-primary">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="w-8 h-8 rounded-lg flex items-center justify-center
                         text-text-secondary hover:text-text-primary hover:bg-surface
                         transition-colors"
            >
              ✕
            </button>
          </div>
        )}
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
