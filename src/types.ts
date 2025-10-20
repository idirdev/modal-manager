/**
 * Configuration options for a modal instance.
 */
export interface ModalConfig {
  /** Unique identifier for this modal */
  id: string;
  /** Whether clicking the backdrop closes the modal (default: true) */
  closeOnBackdrop?: boolean;
  /** Whether pressing Escape closes the modal (default: true) */
  closeOnEscape?: boolean;
  /** Whether to lock body scroll when modal is open (default: true) */
  lockScroll?: boolean;
  /** Whether to trap focus within the modal (default: true) */
  trapFocus?: boolean;
  /** Z-index base value (auto-incremented for stacked modals) */
  zIndex?: number;
  /** Animation duration in milliseconds (default: 200) */
  animationDuration?: number;
  /** Custom CSS class for the modal backdrop */
  backdropClassName?: string;
  /** Custom CSS class for the modal content container */
  contentClassName?: string;
  /** Callback when the modal is opened */
  onOpen?: () => void;
  /** Callback when the modal is closed */
  onClose?: () => void;
  /** Callback after the close animation completes */
  onAfterClose?: () => void;
}

/**
 * Position for the Drawer component.
 */
export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';

/**
 * Size presets for the Drawer component.
 */
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Props for the Drawer component.
 */
export interface DrawerProps {
  /** Whether the drawer is currently open */
  isOpen: boolean;
  /** Callback to close the drawer */
  onClose: () => void;
  /** Which edge the drawer slides in from */
  position?: DrawerPosition;
  /** Preset size of the drawer */
  size?: DrawerSize;
  /** Custom width/height override in pixels or CSS value */
  customSize?: string;
  /** Title displayed in the drawer header */
  title?: string;
  /** Whether clicking the backdrop closes the drawer */
  closeOnBackdrop?: boolean;
  /** Whether pressing Escape closes the drawer */
  closeOnEscape?: boolean;
  /** Whether to show the close button in the header */
  showCloseButton?: boolean;
  /** Children content */
  children: React.ReactNode;
  /** CSS class for the drawer panel */
  className?: string;
  /** Animation duration in ms */
  animationDuration?: number;
}

/**
 * An item in the modal stack managed by ModalProvider.
 */
export interface ModalStackItem {
  /** Unique ID of the modal */
  id: string;
  /** The React element to render */
  element: React.ReactNode;
  /** Configuration for this modal */
  config: ModalConfig;
}

/**
 * Context value provided by ModalProvider.
 */
export interface ModalContextValue {
  /** Push a new modal onto the stack */
  pushModal: (id: string, element: React.ReactNode, config?: Partial<ModalConfig>) => void;
  /** Pop the topmost modal from the stack */
  popModal: () => void;
  /** Close a specific modal by ID */
  closeModal: (id: string) => void;
  /** Close all modals */
  closeAll: () => void;
  /** The current modal stack */
  stack: ModalStackItem[];
  /** The ID of the topmost active modal, or null */
  activeModalId: string | null;
  /** Check if a specific modal is open */
  isOpen: (id: string) => boolean;
}

/**
 * Props for the base Modal component.
 */
export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Modal title (rendered in header) */
  title?: string;
  /** Modal content */
  children: React.ReactNode;
  /** Whether clicking backdrop closes the modal */
  closeOnBackdrop?: boolean;
  /** Whether pressing Escape closes the modal */
  closeOnEscape?: boolean;
  /** Whether to trap focus */
  trapFocus?: boolean;
  /** Whether to lock body scroll */
  lockScroll?: boolean;
  /** Modal width */
  width?: string;
  /** CSS class for the modal content */
  className?: string;
  /** Z-index for the modal */
  zIndex?: number;
  /** Animation duration in ms */
  animationDuration?: number;
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Footer content */
  footer?: React.ReactNode;
}

/**
 * Props for the ConfirmDialog component.
 */
export interface ConfirmDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback to close the dialog */
  onClose: () => void;
  /** Dialog title */
  title: string;
  /** Dialog message */
  message: string | React.ReactNode;
  /** Text for the confirm button */
  confirmText?: string;
  /** Text for the cancel button */
  cancelText?: string;
  /** Whether this is a destructive action (red confirm button) */
  destructive?: boolean;
  /** Callback when confirmed */
  onConfirm: () => void | Promise<void>;
  /** Callback when cancelled */
  onCancel?: () => void;
  /** Whether the confirm action is loading */
  isLoading?: boolean;
}

/**
 * Props for the AlertDialog component.
 */
export interface AlertDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback to close the dialog */
  onClose: () => void;
  /** Dialog title */
  title: string;
  /** Dialog message */
  message: string | React.ReactNode;
  /** Text for the OK button */
  okText?: string;
  /** Variant style */
  variant?: 'info' | 'success' | 'warning' | 'error';
}
