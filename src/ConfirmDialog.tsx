import React, { useState, useCallback } from 'react';
import { Modal } from './Modal';
import type { ConfirmDialogProps } from './types';

/**
 * A confirmation dialog built on top of the Modal component.
 *
 * Presents a title, message, and confirm/cancel buttons. Supports
 * a "destructive" variant with a red confirm button for dangerous actions
 * like deleting data.
 *
 * The confirm handler can be async -- the dialog shows a loading state
 * while the promise is pending.
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   isOpen={showConfirm}
 *   onClose={() => setShowConfirm(false)}
 *   title="Delete Account"
 *   message="This action cannot be undone. All your data will be permanently deleted."
 *   confirmText="Delete"
 *   destructive
 *   onConfirm={async () => {
 *     await deleteAccount();
 *   }}
 * />
 * ```
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
  isLoading: externalLoading,
}: ConfirmDialogProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = externalLoading !== undefined ? externalLoading : internalLoading;

  const handleCancel = useCallback(() => {
    if (isLoading) return;
    if (onCancel) {
      onCancel();
    }
    onClose();
  }, [isLoading, onCancel, onClose]);

  const handleConfirm = useCallback(async () => {
    if (isLoading) return;

    setInternalLoading(true);
    try {
      const result = onConfirm();
      if (result instanceof Promise) {
        await result;
      }
      onClose();
    } catch (err) {
      console.error('[ConfirmDialog] Confirm action failed:', err);
    } finally {
      setInternalLoading(false);
    }
  }, [isLoading, onConfirm, onClose]);

  // Color configuration
  const confirmBg = destructive ? '#dc2626' : '#3b82f6';
  const confirmHoverBg = destructive ? '#b91c1c' : '#2563eb';
  const confirmDisabledBg = destructive ? '#fca5a5' : '#93c5fd';

  // Icon based on destructive variant
  const icon = destructive ? (
    <div
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: '#fef2f2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          stroke="#dc2626"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  ) : (
    <div
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: '#eff6ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      closeOnEscape={!isLoading}
      closeOnBackdrop={!isLoading}
      showCloseButton={false}
      width="400px"
    >
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        {icon}

        <h3
          style={{
            margin: '0 0 8px 0',
            fontSize: '18px',
            fontWeight: 600,
            color: '#111827',
          }}
        >
          {title}
        </h3>

        <div
          style={{
            margin: '0 0 24px 0',
            fontSize: '14px',
            color: '#6b7280',
            lineHeight: 1.5,
          }}
        >
          {message}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={handleCancel}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            {cancelText}
          </button>

          <button
            onClick={handleConfirm}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: isLoading ? confirmDisabledBg : confirmBg,
              border: 'none',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = confirmHoverBg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isLoading ? confirmDisabledBg : confirmBg;
            }}
          >
            {isLoading && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{ animation: 'modal-spin 1s linear infinite' }}
              >
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="18.85"
                  strokeDashoffset="6"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              </svg>
            )}
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>

        <style>{`
          @keyframes modal-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </Modal>
  );
}
