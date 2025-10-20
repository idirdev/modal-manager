/**
 * Selector for all focusable elements within a container.
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ');

/**
 * Returns all focusable elements within the given container.
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
  return Array.from(elements).filter(
    (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
  );
}

/**
 * Creates a focus trap within the given container element.
 * Returns a cleanup function to remove the trap.
 *
 * When Tab is pressed on the last focusable element, focus wraps to the first.
 * When Shift+Tab is pressed on the first focusable element, focus wraps to the last.
 *
 * @param container - The DOM element to trap focus within
 * @returns A cleanup function that removes the focus trap
 */
export function createFocusTrap(container: HTMLElement): () => void {
  // Store the element that had focus before the trap was created
  const previouslyFocusedElement = document.activeElement as HTMLElement | null;

  // Focus the first focusable element in the container
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  } else {
    // If no focusable elements, make the container itself focusable
    container.setAttribute('tabindex', '-1');
    container.focus();
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;

    const currentFocusable = getFocusableElements(container);
    if (currentFocusable.length === 0) return;

    const firstElement = currentFocusable[0];
    const lastElement = currentFocusable[currentFocusable.length - 1];

    if (event.shiftKey) {
      // Shift+Tab: wrap from first to last
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: wrap from last to first
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);

    // Restore focus to the previously focused element
    if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
      previouslyFocusedElement.focus();
    }
  };
}

/**
 * Locks the body scroll to prevent background scrolling when a modal is open.
 * Returns a cleanup function to restore the original scroll behavior.
 */
export function lockBodyScroll(): () => void {
  const scrollY = window.scrollY;
  const originalStyle = {
    overflow: document.body.style.overflow,
    position: document.body.style.position,
    top: document.body.style.top,
    left: document.body.style.left,
    right: document.body.style.right,
    width: document.body.style.width,
  };

  // Calculate scrollbar width to prevent layout shift
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = `calc(100% - ${scrollbarWidth}px)`;

  return () => {
    document.body.style.overflow = originalStyle.overflow;
    document.body.style.position = originalStyle.position;
    document.body.style.top = originalStyle.top;
    document.body.style.left = originalStyle.left;
    document.body.style.right = originalStyle.right;
    document.body.style.width = originalStyle.width;

    // Restore scroll position
    window.scrollTo(0, scrollY);
  };
}

/**
 * Creates a portal container element and appends it to document.body.
 * Returns the element and a cleanup function.
 *
 * @param id - A unique ID for the portal container
 * @returns The portal element and a cleanup function
 */
export function createPortalContainer(id: string): {
  element: HTMLDivElement;
  cleanup: () => void;
} {
  let element = document.getElementById(id) as HTMLDivElement | null;

  if (!element) {
    element = document.createElement('div');
    element.id = id;
    element.setAttribute('data-modal-portal', 'true');
    document.body.appendChild(element);
  }

  return {
    element,
    cleanup: () => {
      if (element && element.parentNode && element.childNodes.length === 0) {
        element.parentNode.removeChild(element);
      }
    },
  };
}

/**
 * Generates an incremental z-index based on the current stack depth.
 */
const BASE_Z_INDEX = 9000;

export function getStackZIndex(stackDepth: number): number {
  return BASE_Z_INDEX + stackDepth * 10;
}

/**
 * Returns the size in pixels/CSS for a drawer based on the size preset.
 */
export function getDrawerSize(
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full',
  position: 'left' | 'right' | 'top' | 'bottom'
): string {
  const isHorizontal = position === 'left' || position === 'right';

  const sizes: Record<string, string> = isHorizontal
    ? { sm: '280px', md: '380px', lg: '520px', xl: '720px', full: '100vw' }
    : { sm: '200px', md: '300px', lg: '400px', xl: '560px', full: '100vh' };

  return sizes[size] || sizes.md;
}
