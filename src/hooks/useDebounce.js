import { useEffect, useState } from "react";

const useDebounce = (searchInput, wait) => {
  const [debouncedInput, setDebouncedInput] = useState(searchInput);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(searchInput);
    }, wait);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput, wait]);

  return debouncedInput;
};

export default useDebounce;
