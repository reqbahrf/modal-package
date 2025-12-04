import { ReactElement } from 'react';

export type ModalSize = 'sm' | 'md' | 'full' | 'responsive' | 'md-f-h';
export interface ModalProps<T = any> {
  children: ReactElement<T>;
  size: ModalSize;
  title: string;
  triggerRef?: React.RefObject<HTMLButtonElement> | undefined;
  headerColor?: string;
  onClose: () => void;
}

export interface OpenModalProps extends Omit<ModalProps, 'onClose'> {
  onClose?: () => void;
}
