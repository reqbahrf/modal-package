'use client';
import React, { useEffect, useRef, useState } from 'react';
import type { ModalProps } from './types';

const Modal = ({
  title,
  size,
  headerColor,
  triggerRef,
  onClose,
  children,
}: ModalProps) => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  let sizeClass = '';
  switch (size) {
    case 'sm':
      sizeClass = 'max-w-[50vw] max-h-[30vh]';
      break;
    case 'md':
      sizeClass = 'max-w-[70vw] max-h-[50vh]';
      break;
    case 'full':
      sizeClass = 'min-w-full max-w-full min-h-full max-h-full';
      break;
    case 'responsive':
      sizeClass =
        'w-full h-full max-w-full max-h-full md:max-w-[50vw] md:max-h-[90vh]';
      break;
    default:
      break;
  }

  useEffect(() => {
    if (modalRef.current) {
      let ReferenceCenterX: number;
      let ReferenceCenterY: number;

      if (triggerRef?.current) {
        const buttonRect = triggerRef.current.getBoundingClientRect();
        ReferenceCenterX = buttonRect.left + buttonRect.width / 2;
        ReferenceCenterY = buttonRect.top + buttonRect.height / 2;
      } else {
        ReferenceCenterX = window.innerWidth / 2;
        ReferenceCenterY = window.innerHeight / 2;
      }

      modalRef.current.style.transformOrigin = `${ReferenceCenterX}px ${ReferenceCenterY}px`;
      const animation = modalRef.current.animate(
        [
          { transform: 'scale(0)', opacity: 0, borderRadius: '40px' },
          { transform: 'scale(1)', opacity: 1, borderRadius: '0px' },
        ],
        {
          duration: 400,
          easing: 'cubic-bezier(0.55, 0.09, 0.68, 0.53)',
        }
      );

      animation.onfinish = () => {
        setIsAnimationComplete(true);
      };

      return () => {
        animation?.cancel();
      };
    }
  }, [triggerRef]);

  return (
    <div
      ref={modalRef}
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isAnimationComplete ? 'bg-black bg-opacity-50' : 'bg-transparent'
      }`}
    >
      <div
        className={`relative ${sizeClass} overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl`}
      >
        <div
          className={`sticky top-0 flex justify-between items-center p-4 ${
            headerColor || 'bg-white dark:bg-gray-800'
          }`}
        >
          <h2 className='text-2xl text-center font-bold text-gray-700 dark:text-white'>
            {title}
          </h2>
          <button
            onClick={onClose}
            className='text-2xl right-90 text-gray-600 dark:text-gray-400'
          >
            &times;
          </button>
        </div>
        <div className='flex flex-col gap-4 mt-4 p-6'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
