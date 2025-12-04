# ram-react-modal

A flexible, context-based React modal component built with TypeScript, React Hooks, and Tailwind CSS, featuring a unique, scale-up animation originating from the triggering element.

## Features

- **Context-Based Management:** Easily open and close modals from any component using the `useModalContext` hook.
- **Animated Entry:** Smooth scale-up animation originating from the button that triggered the modal (if provided).
- **Customizable Sizes:** Supports `sm`, `md` (default), `full`, and `responsive` sizes.
- **Prop-Driven Content:** Pass JSX content directly to the `openModal` function.

## Prerequisites

This package requires the following peer dependencies to be installed in your project:

- React 18 or later
- React DOM 18 or later
- Tailwind CSS 3.0 or later

## Installation

1. First, ensure you have Tailwind CSS installed and configured in your project. If you haven't set up Tailwind CSS yet, follow the [official installation guide](https://tailwindcss.com/docs/installation).

2. Install the modal package:

```bash
# Using npm
npm install ram-react-modal

# Using yarn
yarn add ram-react-modal
```

3. **Configure Tailwind and Styles**

The essential positioning and base styles are automatically imported when you include the `ModalProvider`. However, if you utilize props that accept dynamic Tailwind classes (e.g., `headerColor`), you must configure your consuming project's `tailwind.config.js` to scan the library's source files:

```js
module.exports = {
  // ...
  content: [
    // ...
    './node_modules/ram-react-modal/src/**/*.{js,ts,jsx,tsx}',
  ],
  // ...
};
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

| Prop          | Type                                     | Description                                                                                                      | Required |
| :------------ | :--------------------------------------- | :--------------------------------------------------------------------------------------------------------------- | :------- |
| `children`    | `React.ReactElement`                     | The JSX content to render inside the modal body.                                                                 | Yes      |
| `title`       | `string`                                 | The title displayed in the modal header.                                                                         | Yes      |
| `size`        | `'sm' \| 'md' \| 'full' \| 'responsive'` | Defines the size of the modal. Defaults to `'md'`.                                                               | No       |
| `headerColor` | `string`                                 | Tailwind CSS class for the header background (e.g., `'bg-blue-500'`).                                            | No       |
| `triggerRef`  | `React.RefObject<HTMLElement>`           | A ref pointing to the element that triggered the modal. Used for the animation origin.                           | No       |
| `onClose`     | `() => void`                             | Optional callback function executed when the modal is closed by the user (via the close button or `closeModal`). | No       |

**Example:**

```tsx
const handleOpen = () => {
  openModal({
    title: 'Confirm Action',
    size: 'sm',
    triggerRef: triggerRef, // Optional: for animation origin
    children: (
      <div>
        <p>Are you sure you want to proceed?</p>
        <button
          onClick={() => {
            console.log('Action confirmed!');
            closeModal();
          }}
        >
          Confirm
        </button>
      </div>
    ),
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
    Open Confirmation Modal
  </button>
);
```

### 3. Closing the Modal

Use the `closeModal` function provided by `useModalContext` to programmatically close the modal. This is typically done within the `children` content passed to `openModal`.

```tsx
// Inside the children content:
<button onClick={closeModal}>Close</button>
```

## Available Sizes

The `Modal` component supports four size options via the `size` prop:

| Size           | Description                                                                                                                    |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------- |
| `'sm'`         | Small size: `max-w-[50vw] max-h-[30vh]`                                                                                        |
| `'md'`         | Medium size (Default): `max-w-[70vw] max-h-[50vh]`                                                                             |
| `'full'`       | Full screen: `min-w-full max-w-full min-h-full max-h-full`                                                                     |
| `'responsive'` | Full width/height on small screens, smaller on md/large: `w-full h-full max-w-full max-h-full md:max-w-[50vw] md:max-h-[90vh]` |
