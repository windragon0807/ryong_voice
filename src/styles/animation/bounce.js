const bounce = {
    off: {
        y: 100,
    },
    on: (delaySec = 0.5) => ({  
        y: 0,
        transition: {
            delay: delaySec * 1,
            type: "spring",
            bounce: 0.7,
            duration: 0.8,
        },
    }),
}

export default bounce;