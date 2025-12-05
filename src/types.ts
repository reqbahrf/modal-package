// src/types.ts
import React from 'react';

export type SizeOption = 'sm' | 'md' | 'full' | 'responsive' | 'md-f-h';

export type NoticeType = 'warn' | 'notify';

export interface OnBeforeClosing {
  noticeType: NoticeType;
  textContent: string;
}

export interface OpenModalProps {
  content: React.ReactNode;
  size?: SizeOption;
  title?: string;
  headerColor?: string;
  bodyColor?: string;
  onClose?: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
  onBeforeClosing?: OnBeforeClosing | null;
  // new UX flags:
  disableBackdropClose?: boolean;
  disableEscapeClose?: boolean;
}

export interface ModalInstance {
  id: string;
  content: React.ReactNode;
  title: string;
  triggerRef?: React.RefObject<HTMLElement>;
  headerColor?: string;
  bodyColor?: string;
  size?: SizeOption;
  closeId: string;
  onCloseCallback?: () => void;
  onBeforeClosing?: OnBeforeClosing | null;
  // new UX flags:
  disableBackdropClose?: boolean;
  disableEscapeClose?: boolean;
}
