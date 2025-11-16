# Modal Manager

[![npm version](https://img.shields.io/npm/v/@idirdev/modal-manager)](https://www.npmjs.com/package/@idirdev/modal-manager)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@idirdev/modal-manager)](https://bundlephobia.com/package/@idirdev/modal-manager)

React modal/dialog stack manager. Modals, confirm dialogs, alerts, and drawers with focus trapping, stacking, and animations.

## Features

- **Modal stacking** -- open modals on top of modals, managed as a stack
- **Focus trapping** -- keyboard focus stays within the active modal
- **Scroll locking** -- background content does not scroll when a modal is open
- **Escape to close** -- press Escape to dismiss the topmost modal
- **Click outside** -- click the backdrop to close
- **Drawers** -- slide-in panels from any edge (left, right, top, bottom)
- **Confirm dialogs** -- confirm/cancel with destructive variant
- **Alert dialogs** -- info, success, warning, error variants
- **Animations** -- smooth open/close transitions
- **Accessible** -- ARIA roles, labels, and focus management
- **TypeScript first** -- full type safety
- **Zero dependencies** -- only React as a peer dependency

## Installation

```bash
npm install @idirdev/modal-manager
```

## Quick Start

### Setup the Provider

```tsx
import { ModalProvider } from '@idirdev/modal-manager';

function App() {
  return (
    <ModalProvider>
      <MyApp />
    </ModalProvider>
  );
}
```

### Basic Modal

```tsx
import { Modal, useModal } from '@idirdev/modal-manager';

function MyComponent() {
  const modal = useModal();

  return (
    <>
      <button {...modal.triggerProps}>Open Modal</button>
      <Modal {...modal.modalProps} title="Hello World">
        <p>This is a basic modal dialog.</p>
      </Modal>
    </>
  );
}
```

### Confirm Dialog

```tsx
import { ConfirmDialog, useModal } from '@idirdev/modal-manager';

function DeleteButton() {
  const confirm = useModal();

  return (
    <>
      <button {...confirm.triggerProps}>Delete Item</button>
      <ConfirmDialog
        {...confirm.modalProps}
        title="Delete Item"
        message="Are you sure? This action cannot be undone."
        confirmText="Delete"
        destructive
        onConfirm={async () => {
          await deleteItem();
        }}
      />
    </>
  );
}
```

### Alert Dialog

```tsx
import { AlertDialog, useModal } from '@idirdev/modal-manager';

function SaveButton() {
  const alert = useModal();

  return (
    <>
      <button onClick={async () => { await save(); alert.open(); }}>Save</button>
      <AlertDialog
        {...alert.modalProps}
        title="Saved!"
        message="Your changes have been saved successfully."
        variant="success"
      />
    </>
  );
}
```

### Drawer

```tsx
import { Drawer, useModal } from '@idirdev/modal-manager';

function Sidebar() {
  const drawer = useModal();

  return (
    <>
      <button {...drawer.triggerProps}>Open Menu</button>
      <Drawer
        isOpen={drawer.isOpen}
        onClose={drawer.close}
        position="left"
        size="md"
        title="Navigation"
      >
        <nav>
          <a href="/home">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </Drawer>
    </>
  );
}
```

### Modal Stacking

```tsx
import { useModalStack, Modal, ConfirmDialog } from '@idirdev/modal-manager';

function StackDemo() {
  const stack = useModalStack();

  const openFirst = () => {
    stack.push('first', (
      <Modal isOpen onClose={() => stack.close('first')} title="First Modal">
        <p>This is the first modal.</p>
        <button onClick={openSecond}>Open Another</button>
      </Modal>
    ));
  };

  const openSecond = () => {
    stack.push('second', (
      <ConfirmDialog
        isOpen
        onClose={() => stack.close('second')}
        title="Confirm"
        message="Close everything?"
        onConfirm={() => stack.closeAll()}
      />
    ));
  };

  return <button onClick={openFirst}>Start</button>;
}
```

## API Reference

### Components

| Component | Description |
|-----------|-------------|
| `<ModalProvider>` | Context provider for the modal stack |
| `<Modal>` | Base modal with backdrop, focus trap, animations |
| `<ConfirmDialog>` | Confirm/cancel dialog with destructive variant |
| `<AlertDialog>` | Info/success/warning/error alert |
| `<Drawer>` | Slide-in panel from any edge |

### Hooks

| Hook | Description |
|------|-------------|
| `useModal()` | Manage a single modal's open/close state |
| `useModalStack()` | Push/pop/close modals in the provider stack |
| `useModalContext()` | Raw access to the ModalProvider context |

### Drawer Sizes

| Size | Horizontal | Vertical |
|------|-----------|----------|
| `sm` | 280px | 200px |
| `md` | 380px | 300px |
| `lg` | 520px | 400px |
| `xl` | 720px | 560px |
| `full` | 100vw | 100vh |

## License

MIT
