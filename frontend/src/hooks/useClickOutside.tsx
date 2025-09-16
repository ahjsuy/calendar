import { useEffect, useRef } from "react";

const useClickOutside = (callback: Function) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        callback();
      }
    };
    document.addEventListener("click", handleClick, true);
  }, [ref, callback]);

  return ref;
};

export default useClickOutside;
