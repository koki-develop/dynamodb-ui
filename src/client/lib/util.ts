import { useCallback, useEffect, useState } from "react";

export const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = useCallback(() => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return size;
};

export const usePosition = (ref: React.RefObject<HTMLElement>) => {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  const handleScroll = useCallback(() => {
    if (ref.current) {
      setPosition({
        x: ref.current.getBoundingClientRect().x,
        y: ref.current.getBoundingClientRect().y,
      });
    }
  }, [ref]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return position;
};
