# Changelog

All notable changes to this project will be documented in this file.

## [1.1.4] – 2025-12-16

- Fix: Add ability to bypass onBeforeClosing confirmation when closing modals programmatically
  - Fixed an issue where modals with `onBeforeClosing` handlers couldn't be closed programmatically (such as after form submissions). Added `isForceClose` option to `closeModal` to bypass confirmation when needed.

## [1.1.3] – 2025-12-09

- Enhanced modal flexibility and styling
  - Made the modal title optional with dynamic header layout adjustment
  - Updated padding and gap values from pixels to `rem` units for better responsiveness
  - Set default modal header background to transparent
  - Added dynamic `justify-content` based on title presence

## [1.1.2] – 2025-12-08

- Enhanced modal sizing and scroll behavior
  - Updated CSS viewport units from `vw`/`vh` to `dvw`/`dvh` for more accurate and consistent sizing, especially on mobile devices with dynamic browser UI
  - Implemented body scroll locking when a modal is open to prevent background scrolling and improve focus on the active modal

## [1.0.0] – 2025-02-01

Initial release of `ram-react-modal`.
