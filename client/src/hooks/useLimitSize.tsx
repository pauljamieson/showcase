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
  const { width, height } = getWindowDimensions();
  if (width < 779) return 10;
  if (width < 959) return height < 425 ? 3 : height < 750 ? 6 : 9;
  if (width < 1439) return height < 425 ? 4 : height < 750 ? 8 : 12;
  return height < 425 ? 5 : height < 750 ? 10 : 15;
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
