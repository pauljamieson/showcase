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
  if (width >= 1440) return 15;
  if (width >= 960) return 12;
  if (width >= 780) return 9;
  else return 10;
}

export default function useLimitSize(): number {
  const [size, setSize] = useState<number>(getSize());

  useEffect(() => {
    function handleResize() {
      const s = getSize();
      setSize(s);
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [size]);

  useEffect(() => {
    console.log(size);
  }, [size]);

  return size;
}
