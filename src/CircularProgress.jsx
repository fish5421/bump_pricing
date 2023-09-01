import { motion, useMotionValue, useTransform } from 'framer-motion';

export default function CircularProgress({ progress }) {
    const circleLength = useTransform(progress, [0, 100], [0, 1]);
    const checkmarkPathLength = useTransform(progress, [0, 95, 100], [0, 0, 1]);
    const circleColor = useTransform(
        progress,
        [0, 95, 100],
        ['#FFCC66', '#FFCC66', '#66BB66']
    );

    return (
        <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="128"
            height="128"
            viewBox="0 0 128 128"
        >
            <motion.path
                transform="translate(30 42)"
                d="M1 25L22 46L67 1"
                fill="transparent"
                stroke="#7BB86F"
                strokeWidth={4}
                style={{ pathLength: checkmarkPathLength }}
            />
            <motion.path
                d="M 64 3 C 99.241 3 127 30.759 127 64 C 127 97.241 99.241 125 64 125 C 30.759 125 3 97.241 3 64 C 3 30.759 30.759 3 64 3 Z"
                fill="transparent"
                strokeWidth="4"
                stroke={circleColor}
                style={{
                    pathLength: circleLength
                }}
            />
        </motion.svg>
    );
}
