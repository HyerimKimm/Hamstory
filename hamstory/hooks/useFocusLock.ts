import React, { useEffect } from "react";

const focusableElements =
  "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

const useFocusLock = <T extends HTMLElement | null>({
  containerRef,
  onClose = () => {},
  enabled = true,
}: {
  containerRef: React.RefObject<T>;
  onClose?: () => void;
  enabled?: boolean;
}) => {
  useEffect(() => {
    if (!enabled) return;

    /**
     * 첫 번째 요소를 찾아서 return 하는 함수
     * 전체 요소를 차례로 돌면서,
     * 현재 요소가 숨겨진 input 요소가 아니고,
     * disabled 상태가 아니고,
     * tabIndex가 0 이상이고,
     * aria-hidden 속성이 없는 경우
     * => 해당 요소가 포커스 가능한 첫 번째 요소이다 */
    const getFirstElement = (e: NodeListOf<HTMLElement>) => {
      for (const el of e) {
        if (
          !(el instanceof HTMLInputElement && el.type === "hidden") &&
          !el.hasAttribute("disabled") &&
          el.tabIndex >= 0 &&
          !el.getAttribute("aria-hidden")
        ) {
          return el;
        }
      }
      return null;
    };

    /**
     * 마지막 요소를 찾아서 return 하는 함수
     * 전체 요소를 차례로 돌면서,
     * 현재 요소가 숨겨진 input 요소가 아니고,
     * disabled 상태가 아니고,
     * tabIndex가 0 이상이고,
     * aria-hidden 속성이 없는 경우
     * => 해당 요소가 포커스 가능한 마지막 요소이다 */
    const getLastElement = (e: NodeListOf<HTMLElement>) => {
      for (let i = e.length - 1; i >= 0; i--) {
        const el = e[i];

        if (
          !(el instanceof HTMLInputElement && el.type === "hidden") &&
          !el.hasAttribute("disabled") &&
          el.tabIndex >= 0 &&
          !el.getAttribute("aria-hidden")
        ) {
          return el;
        }
      }
      return null;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;

      // esc 누르면 팝업 닫음
      if (e.key === "Escape") {
        onClose();
      }

      // tab 혹은 shift+tab 눌렀을 때 처리
      const elements = containerRef.current.querySelectorAll(
        focusableElements,
      ) as NodeListOf<HTMLElement>;

      if (elements.length === 0) return;

      const firstElement = getFirstElement(elements);
      const lastElement = getLastElement(elements);

      if (e.key === "Tab" && e.shiftKey) {
        if (document.activeElement === firstElement && lastElement) {
          e.preventDefault();
          lastElement.focus();
        }
      }

      if (e.key === "Tab") {
        /* 현재 focus된 요소가 마지막 focusable 요소이면 모달의 첫번째 focusable 요소로 포커스 이동 */
        if (document.activeElement === lastElement && firstElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.addEventListener("keydown", handleKeyDown);
        containerRef.current.focus();
      }

      return () => {
        containerRef.current?.removeEventListener("keydown", handleKeyDown);
      };
    }, 0);
  }, [enabled]);
};

export default useFocusLock;
