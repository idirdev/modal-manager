import React from 'react';
import { Modal } from './Modal';
import type { AlertDialogProps } from './types';

/**
 * Configuration for each alert variant (colors and icon).
 */
const VARIANT_CONFIG = {
  info: {
    iconBg: '#eff6ff',
    iconColor: '#3b82f6',
    buttonBg: '#3b82f6',
    buttonHoverBg: '#2563eb',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 16v-4m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  success: {
    iconBg: '#f0fdf4',
    iconColor: '#16a34a',
    buttonBg: '#16a34a',
    buttonHoverBg: '#15803d',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  warning: {
    iconBg: '#fffbeb',
    iconColor: '#d97706',
    buttonBg: '#d97706',
    buttonHoverBg: '#b45309',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  error: {
    iconBg: '#fef2f2',
    iconColor: '#dc2626',
    buttonBg: '#dc2626',
    buttonHoverBg: '#b91c1c',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
} as const;

/**
 * A simple alert dialog for displaying informational messages.
 *
 * Supports four variants: info, success, warning, and error.
 * Each variant has a distinct icon and color scheme.
 *
 * @example
 * ```tsx
 * <AlertDialog
 *   isOpen={showAlert}
 *   onClose={() => setShowAlert(false)}
 *   title="Success!"
 *   message="Your changes have been saved."
 *   variant="success"
 * />
 * ```
 */
export function AlertDialog({
  isOpen,
  onClose,
  title,
  message,
  okText = 'OK',
  variant = 'info',
}: AlertDialogProps) {
  const config = VARIANT_CONFIG[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      width="380px"
      closeOnBackdrop={true}
      closeOnEscape={true}
    >
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        {/* Icon */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: config.iconBg,
            color: config.iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
          }}
        >
          {config.icon}
        </div>

        {/* Title */}
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

        {/* Message */}
        <div
          style={{
            margin: '0 0 24px 0',
            fontSize: '14px',
            color: '#6b7280',
            lineHeight: 1.6,
          }}
        >
          {message}
        </div>

        {/* OK Button */}
        <button
          onClick={onClose}
          autoFocus
          style={{
            width: '100%',
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#ffffff',
            backgroundColor: config.buttonBg,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = config.buttonHoverBg;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = config.buttonBg;
          }}
        >
          {okText}
        </button>
      </div>
    </Modal>
  );
}
