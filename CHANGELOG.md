# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

### Added

- **Multi-Modal Stacking Support**: Refactored the modal context and hook to allow multiple modal elements to be spawned and stacked (e.g., a modal opening another modal).
  - The `useModal` hook now manages a `modalStack` array instead of a single state object.
  - Modals are rendered with dynamic z-indices based on their position in the stack.
  - The backdrop overlay (`.ram-active-backdrop`) is only applied to the topmost modal.
  - `openModal` and `closeModal` functions in `useModalContext` are updated to manage the stack.
- **Pre-Closing Confirmation Hook**: Added an optional `onBeforeClosing` parameter to `openModal`. When provided, attempting to close the modal will interrupt the action and display a small confirmation modal (`size: 'sm'`) with custom text and styling based on `noticeType` (e.g., `warning`, `error`).

### Changed

- **`OpenModalProps`**: Added optional `onBeforeClosing` object parameter.
- **`ModalProps`**: Added `id`, `isTopModal`, and `style` props. The `onClose` callback now receives the modal's unique ID.
- **CSS**: Removed static `z-50` from `.ram-modal-overlay` in [`src/ModalBase.css`](src/ModalBase.css) to enable dynamic z-index. Introduced `ram-active-backdrop` and `ram-inactive-backdrop` classes for conditional overlay styling.
