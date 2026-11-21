import { useEffect, useRef } from 'react';

interface UseModalKeyEventsOptions {
  isOpen?: boolean;
  onClose?: () => void;
  enableEnterNavigation?: boolean;
}

export function useModalKeyEvents<T extends HTMLElement = HTMLDivElement>({
  isOpen = true,
  onClose,
  enableEnterNavigation = true,
}: UseModalKeyEventsOptions = {}) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. ESC tugmasi bosilganda modalni yopish
      if (e.key === 'Escape' && onClose) {
        e.preventDefault();
        onClose();
        return;
      }

      // 2. Enter bosilganda navbatdagi inputga o'tish
      if (enableEnterNavigation && e.key === 'Enter') {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        // Textarea yoki tugma bo'lsa aralashmaymiz
        if (target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON') {
          return;
        }

        if (
          containerRef.current &&
          containerRef.current.contains(target) &&
          (target.tagName === 'INPUT' || target.tagName === 'SELECT')
        ) {
          // Modal ichidagi barcha ko'rinadigan va faol inputlarni topish
          const allInputs = Array.from(
            containerRef.current.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
              'input:not([type="hidden"]):not([type="button"]):not([type="submit"]):not([disabled]), select:not([disabled])'
            )
          ).filter((el) => {
            return el.offsetParent !== null && window.getComputedStyle(el).display !== 'none';
          });

          const currentIndex = allInputs.indexOf(target as any);
          if (currentIndex !== -1 && currentIndex < allInputs.length - 1) {
            e.preventDefault();
            const nextElement = allInputs[currentIndex + 1];
            nextElement.focus();
            if (
              'select' in nextElement &&
              typeof (nextElement as HTMLInputElement).select === 'function' &&
              (nextElement as HTMLInputElement).type !== 'file'
            ) {
              (nextElement as HTMLInputElement).select();
            }
          }
          // Agar oxirgi input bo'lsa, e.preventDefault() chaqirilmaydi va form odatiy tarzda submit bo'ladi
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, enableEnterNavigation]);

  return containerRef;
}

