import { useRef, useEffect } from "react";

const useTimeout = (timeLimit, callback = (f) => f, callbackPerSecond = f => f) => {
    const time = useRef(null);
    const timerId = useRef(null);

    const setTimer = () => {
        time.current = timeLimit;
        timerId.current = setInterval(() => {
            time.current -= 1000;
            if (time.current === 0) {
                if (callback && typeof callback === "function") {
                    callback();
                    clearInterval(timerId.current);
                }
            }
            callbackPerSecond(time.current/1000);
        }, 1000);
    };

    const reset = () => {
        // console.log("🔊 Reset Timer");
        clearInterval(timerId.current);
        time.current = timeLimit;
        setTimer();
    };

    useEffect(() => {
        setTimer();
        return () => {
            clearInterval(timerId.current);
        };
    }, [timeLimit]);

    return [reset];
};

export default useTimeout;
