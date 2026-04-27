

export const throttle = (func: Function, delay: number) => {
  let lastCall = 0; 
    return function (...args: any[]) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
};

export const debounce = (func: Function, delay: number) => {    
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return function (...args: any[]) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
            timeoutId = null;
        }, delay);
    };
};
