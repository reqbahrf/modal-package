# ram-react-modal

A flexible, context-based React modal component built with TypeScript, React Hooks, and Tailwind CSS, featuring a unique, scale-up animation originating from the triggering element.

## Features

- **Context-Based Management:** Easily open and close modals from any component using the `useModalContext` hook.
- **Animated Entry:** Smooth scale-up animation originating from the button that triggered the modal (if provided).
- **Customizable Sizes:** Supports `sm`, `md` (default), `full`, `responsive`, and the unreleased `md-f-h` size.
- **Customizable Appearance:** Configure the background color for both the header (`headerColor`) and the body (`bodyColor`) using Tailwind CSS classes.
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

To ensure the modal's base styles and Tailwind directives are applied correctly, you must import the package's CSS file into your main stylesheet (e.g., `globals.css`):

```css
@import 'ram-react-modal/src/ModalBase.css';
```

Additionally, if you utilize props that accept dynamic Tailwind classes (e.g., `headerColor`), you must configure your consuming project's `tailwind.config.js` to scan the library's source files:

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

| Prop          | Type                                                 | Description                                                                                                      | Required |
| :------------ | :--------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------- | :------- |
| `children`    | `React.ReactElement`                                 | The JSX content to render inside the modal body.                                                                 | Yes      |
| `title`       | `string`                                             | The title displayed in the modal header.                                                                         | Yes      |
| `size`        | `'sm' \| 'md' \| 'full' \| 'responsive' \| 'md-f-h'` | Defines the size of the modal. Defaults to `'md'`.                                                               | No       |
| `headerColor` | `string`                                             | Tailwind CSS class for the header background (e.g., `'bg-red-500'`). Defaults to `'bg-blue-500 text-white'`.     | No       |
| `bodyColor`   | `string`                                             | Tailwind CSS class for the modal body background (e.g., `'bg-white'`). Defaults to `'bg-gray-800 text-white'`.   | No       |
| `triggerRef`  | `React.RefObject<HTMLElement>`                       | A ref pointing to the element that triggered the modal. Used for the animation origin.                           | No       |
| `onClose`     | `() => void`                                         | Optional callback function executed when the modal is closed by the user (via the close button or `closeModal`). | No       |

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

| Size           | Description                                                                                                                                                           |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `'sm'`         | Small size: `max-width: 50dvw; max-height: 30dvh;`                                                                                                                    |
| `'md'`         | Medium size (Default): `max-width: 70dvw; max-height: 50dvh;`                                                                                                         |
| `'md-f-h'`     | Medium width, fixed height: `max-width: 70dvw; max-height: 95dvh;`                                                                                                    |
| `'full'`       | Full screen: `min-w-full max-w-full min-h-full max-h-full`                                                                                                            |
| `'responsive'` | Full width/height on small screens, smaller on md/large: `w-full h-full max-w-full max-h-full md:max-w-[50dvw] md:max-h-[90dvh]` (using `dvw`/`dvh` units internally) |
