# ram-react-modal

A flexible, context-based React modal component built with TypeScript and React Hooks, featuring a unique, scale-up animation originating from the triggering element.

## Features

- **Context-Based Management:** Easily open and close modals from any component using the `useModalContext` hook.
- **Animated Entry:** Smooth scale-up animation originating from the button that triggered the modal (if provided).
- **Customizable Sizes:** Supports `sm`, `md` (default), `full`, `responsive`, and the unreleased `md-f-h` size.
- **Customizable Appearance:** Configure the background color for both the header (`headerColor`) and the body (`bodyColor`) using string class names (e.g., 'bg-red-500').
- **Prop-Driven Content:** Pass JSX content directly to the `openModal` function.

## Prerequisites

This package requires the following peer dependencies to be installed in your project:

- React 18 or later
- React DOM 18 or later

## Installation

Install the modal package:

```bash
# Using npm
npm install ram-react-modal

# Using yarn
yarn add ram-react-modal
```

## Setup

To use the modal system, you must wrap your application or a section of your application in the `ModalProvider`. This component manages the state and rendering of the modal globally.

```tsx
import React from 'react';
import { ModalProvider } from 'ram-react-modal';

const App = () => (
  <ModalProvider>
    {/* Your application components */}
    <MainContent />
  </ModalProvider>
);
```

## Usage

The primary way to interact with the modal is through the `useModalContext` hook.

### 1. Get Control Functions

In any component nested under `ModalProvider`:

```tsx
import { useModalContext } from 'ram-react-modal';
import React, { useRef } from 'react';

const MyComponent = () => {
  const { openModal, closeModal } = useModalContext();
  const triggerRef = useRef(null);
  // Implementation details here...
```

### 2. Opening the Modal

Call `openModal` with the configuration object.

| Prop              | Type                                                      | Description                                                                                                                                                                                | Required |
| :---------------- | :-------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| `content`         | `React.ReactElement`                                      | The JSX content to render inside the modal body.                                                                                                                                           | Yes      |
| `title`           | `string`                                                  | The title displayed in the modal header.                                                                                                                                                   | Yes      |
| `size`            | `'sm' \| 'md' \| 'full' \| 'responsive' \| 'md-f-h'`      | Defines the size of the modal. Defaults to `'md'`.                                                                                                                                         | No       |
| `headerColor`     | `string`                                                  | CSS class name for the header background (e.g., `'bg-red-500'`). Defaults to `'bg-blue-500 text-white'`.                                                                                   | No       |
| `bodyColor`       | `string`                                                  | CSS class name for the modal body background (e.g., `'bg-white'`). Defaults to `'bg-gray-800 text-white'`.                                                                                 | No       |
| `triggerRef`      | `React.RefObject<HTMLElement>`                            | A ref pointing to the element that triggered the modal. Used for the animation origin.                                                                                                     | No       |
| `onClose`         | `() => void`                                              | Optional callback function executed when the modal is closed by the user (via the close button or `closeModal`).                                                                           | No       |
| `onBeforeClosing` | `{ noticeType: 'notify' \| 'warn'; textContent: string }` | If provided, the standard close action is intercepted, and a small confirmation modal is displayed with the given `textContent` and `noticeType`. If confirmed, the original modal closes. | No       |

**Example:**

```tsx
import ModalBodyContentExample from './component/ModalBodyContentExample';
const handleOpen = () => {
  openModal({
    title: 'Confirm Action',
    size: 'sm',
    triggerRef: triggerRef, // Optional: for animation origin
    content: <ModalBodyContentExample />, // Modal Body Content
    onBeforeClosing: {
      noticeType: 'warn',
      textContent: 'Are you sure you want to discard unsaved changes?',
    },
    onClose: () => {
      console.log('Modal closed, cleanup performed.');
    },
  });
};

return (
  <button
    onClick={handleOpen}
    ref={triggerRef}
  >
    Open Modal
  </button>
);
```

### 3. Closing the Modal

Use the `closeModal` function provided by `useModalContext` to programmatically close the modal.
If called without an ID, it closes the topmost modal. If called with an ID, it attempts to close that specific modal in the stack.

```tsx
// Inside the children/content:
<button onClick={closeModal}>Close Top Modal</button>;

// To close a specific modal if you have its ID:
closeModal('my-modal-id-123');
```

## Confirmation Modal (onBeforeClosing)

To prevent accidental dismissal of a modal, you can utilize the `onBeforeClosing` prop. If this prop is set, attempting to close the modal (either via the close button or `closeModal`) will first trigger a confirmation modal.

This is useful for forms where unsaved changes might be lost.

| Prop Field    | Type                 | Description                                                                                                     |
| :------------ | :------------------- | :-------------------------------------------------------------------------------------------------------------- |
| `noticeType`  | `'notify' \| 'warn'` | Determines the styling (header color) of the confirmation modal. `'warn'` is red, `'notify'` (default) is blue. |
| `textContent` | `string`             | The main body text displayed in the confirmation modal.                                                         |

**Example: Requiring confirmation to close**

```tsx
openModal({
  title: 'Unsaved Changes',
  content: <p>This form has unsaved data.</p>,
  onBeforeClosing: {
    noticeType: 'warn',
    textContent: 'Are you sure you want to discard your changes?',
  },
  onClose: () => {
    console.log('Original modal successfully closed after confirmation.');
  },
});
```

## Available Sizes

The `Modal` component supports four size options via the `size` prop:

| Size           | Description                                                                                                                                                           |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `'sm'`         | Small size: `max-width: 50dvw; max-height: 30dvh;`                                                                                                                    |
| `'md'`         | Medium size (Default): `max-width: 70dvw; max-height: 50dvh;`                                                                                                         |
| `'md-f-h'`     | Medium width, fixed height: `max-width: 70dvw; max-height: 95dvh;`                                                                                                    |
| `'full'`       | Full screen: `min-w-full max-w-full min-h-full max-h-full`                                                                                                            |
| `'responsive'` | Full width/height on small screens, smaller on md/large: `w-full h-full max-w-full max-h-full md:max-w-[50dvw] md:max-h-[90dvh]` (using `dvw`/`dvh` units internally) |
