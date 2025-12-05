import { ReactElement, CSSProperties } from 'react';

export type ModalSize = 'sm' | 'md' | 'full' | 'responsive' | 'md-f-h';

export type NoticeType = 'notify' | 'warn';
export interface OnBeforeClosingProps {
  noticeType: NoticeType;
  textContent: string;
}

export interface ModalProps<T = any> {
  id: string; // Add unique ID for stacking
  children: ReactElement<T>;
  size: ModalSize;
  title: string;
  triggerRef?: React.RefObject<HTMLButtonElement> | undefined;
  headerColor?: string;
  bodyColor?: string;
  onClose: (id: string) => void; // Close handler now accepts ID
  isTopModal: boolean; // Flag to determine z-index/backdrop visibility
  style?: CSSProperties;
}

export interface OpenModalProps
  extends Omit<
    ModalProps,
    'onClose' | 'id' | 'isTopModal' | 'style' | 'children'
  > {
  content: ReactElement;
  onClose?: () => void;
  onBeforeClosing?: OnBeforeClosingProps;
}

// Defines a modal currently in the stack
// We omit isTopModal and style because they are calculated during rendering.
export interface ModalInstance
  extends Omit<ModalProps, 'onClose' | 'isTopModal' | 'style' | 'children'> {
  content: ReactElement;
  onCloseCallback: (() => void) | undefined;
  closeId: string; // The ID to call the context's closeModal with
  onBeforeClosing?: OnBeforeClosingProps;
}
