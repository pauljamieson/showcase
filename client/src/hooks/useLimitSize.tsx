import { useEffect, useState } from "react";

interface Dimensions {
  width: number;
  height: number;
}

function getWindowDimensions(): Dimensions {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}

function getSize(): number {
  const { width } = getWindowDimensions();
  if (width < 779) return 10;
  if (width < 959) return 9;
  if (width < 1439) return 12;
  return 10;
}

export default function useLimitSize(): number {
  const [size, setSize] = useState<number>(getSize());

  useEffect(() => {
    function handleResize() {
      setSize(getSize());
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}
