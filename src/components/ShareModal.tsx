import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'

export interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  shareUrl: string | null
  connectedDevices: number
}

/**
 * Modal for sharing timer session across devices
 */
export function ShareModal({ isOpen, onClose, shareUrl, connectedDevices }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!shareUrl) return
    
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input')
      input.value = shareUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = async () => {
    if (!shareUrl || !navigator.share) return
    
    try {
      await navigator.share({
        title: 'HIIT Timer Session',
        text: 'Join my timer session!',
        url: shareUrl,
      })
    } catch {
      // User cancelled or share failed
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sync Across Devices">
      <div className="flex flex-col items-center gap-6">
        {/* QR Code placeholder */}
        <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center p-4">
          <div className="w-full h-full bg-surface rounded-lg flex items-center justify-center">
            <span className="text-text-secondary font-mono text-xs text-center px-2">
              {shareUrl ? (
                // Simple ASCII QR representation - in production use a real QR library
                <div className="grid grid-cols-8 gap-0.5">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 ${Math.random() > 0.5 ? 'bg-background' : 'bg-white'}`}
                    />
                  ))}
                </div>
              ) : (
                'No session active'
              )}
            </span>
          </div>
        </div>

        <p className="text-text-secondary text-center">
          Scan with your phone or share the link below
        </p>

        {/* URL display */}
        {shareUrl && (
          <div className="w-full p-3 bg-surface rounded-lg">
            <p className="font-mono text-sm text-text-primary truncate text-center">
              {shareUrl}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleCopy}>
            {copied ? '✓ Copied!' : 'Copy Link'}
          </Button>
          
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <Button variant="primary" onClick={handleShare}>
              Share
            </Button>
          )}
        </div>

        {/* Device count */}
        <p className="text-text-secondary text-sm">
          📱 {connectedDevices} {connectedDevices === 1 ? 'device' : 'devices'} connected
        </p>
      </div>
    </Modal>
  )
}
