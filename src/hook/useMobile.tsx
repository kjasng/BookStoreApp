import { useEffect } from "react";

import { useState } from "react";

const useMobile = () => {
    const [size, setSize] = useState(0);

    const handleResize = () => {
        window.addEventListener("resize", () => {
            setSize(window.innerWidth);
        });
    };
    useEffect(() => {
        handleResize();
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [size]);
    return size;
};

export default useMobile;
