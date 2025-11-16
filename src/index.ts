// Provider
export { ModalProvider, useModalContext } from './ModalProvider';

// Components
export { Modal } from './Modal';
export { ConfirmDialog } from './ConfirmDialog';
export { AlertDialog } from './AlertDialog';
export { Drawer } from './Drawer';

// Hooks
export { useModal } from './hooks/useModal';
export { useModalStack } from './hooks/useModalStack';

// Utilities
export { createFocusTrap, lockBodyScroll, createPortalContainer, getStackZIndex } from './utils';

// Types
export type {
  ModalConfig,
  DrawerPosition,
  DrawerSize,
  DrawerProps,
  ModalStackItem,
  ModalContextValue,
  ModalProps,
  ConfirmDialogProps,
  AlertDialogProps,
} from './types';

export type { UseModalReturn, UseModalOptions } from './hooks/useModal';
export type { UseModalStackReturn } from './hooks/useModalStack';
